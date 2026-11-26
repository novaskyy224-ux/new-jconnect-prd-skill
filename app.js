const STATUS = Object.freeze({
  SUCCESS: "berhasil",
  PROCESSING: "sedang diproses",
  FAILED: "gagal",
});

const banks = [
  { id: "bank-sim-1", name: "Bank Simulasi A" },
  { id: "bank-sim-2", name: "Bank Simulasi B" },
  { id: "bank-sim-3", name: "Bank Simulasi C" },
];

const methods = [
  {
    id: "metode-a",
    name: "Pilihan Metode Simulasi A",
    fee: "TBD",
    speed: "TBD",
    terms: "Ketentuan simulasi belum ditetapkan",
    limit: "TBD",
  },
  {
    id: "metode-b",
    name: "Pilihan Metode Simulasi B",
    fee: "TBD",
    speed: "TBD",
    terms: "Ketentuan simulasi belum ditetapkan",
    limit: "TBD",
  },
];

const state = {
  route: "home",
  accountNumber: "",
  bankId: "",
  amount: "",
  methodId: "",
  history: [],
  historyError: "",
  currentTransactionId: null,
  duplicateTransactionId: null,
  validationAttempted: false,
  networkWarning: !navigator.onLine,
};

const app = document.getElementById("app");
state.history = loadHistory();

function loadHistory() {
  state.historyError = "";
  let serialized;
  try {
    serialized = localStorage.getItem("jconnect-history");
  } catch (error) {
    state.historyError = "Browser tidak mengizinkan riwayat simulasi dibaca. Periksa pengaturan penyimpanan browser.";
    return [];
  }

  if (!serialized) return [];

  let parsed;
  try {
    parsed = JSON.parse(serialized);
  } catch (error) {
    state.historyError = "Riwayat simulasi tidak dapat dibaca karena format datanya rusak.";
    return [];
  }

  const validStatuses = Object.values(STATUS);
  const validHistory = Array.isArray(parsed) && parsed.every((item) =>
    item &&
    typeof item.id === "string" &&
    typeof item.recipientName === "string" &&
    typeof item.accountNumber === "string" &&
    typeof item.bankId === "string" &&
    typeof item.bankName === "string" &&
    typeof item.amount === "string" &&
    /^\d+$/.test(item.amount) &&
    typeof item.methodId === "string" &&
    typeof item.methodName === "string" &&
    validStatuses.includes(item.status)
  );

  if (!validHistory) {
    state.historyError = "Riwayat simulasi memiliki data yang tidak sesuai. Data lama tidak ditampilkan.";
    return [];
  }

  return parsed.map((item) => ({
    ...item,
    reference: typeof item.reference === "string" && !item.reference.startsWith("SIM-")
      ? item.reference
      : null,
  }));
}

function saveHistory() {
  try {
    localStorage.setItem("jconnect-history", JSON.stringify(state.history));
    state.historyError = "";
    return true;
  } catch (error) {
    state.historyError = "Riwayat tidak dapat disimpan di browser ini. Transaksi hanya tersedia selama halaman terbuka.";
    return false;
  }
}

function formatAmount(value) {
  const digits = String(value).replace(/[^\d]/g, "");
  if (!digits) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(BigInt(digits));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function selectedBank() {
  return banks.find((bank) => bank.id === state.bankId);
}

function selectedMethod() {
  return methods.find((method) => method.id === state.methodId);
}

function header(title, backAction) {
  return `
    <header class="header">
      ${backAction ? `<button class="icon-button" type="button" data-action="${backAction}" aria-label="Kembali">←</button>` : '<span class="header-spacer" aria-hidden="true"></span>'}
      <h1>${escapeHtml(title)}</h1>
    </header>
  `;
}

function networkPanel() {
  if (!state.networkWarning) return "";
  return `
    <div class="network-panel" role="alert">
      <strong>Peringatan koneksi buruk</strong>
      <p>Koneksi tidak dapat dipastikan. Status transaksi tidak berubah hanya karena koneksi buruk.</p>
    </div>
  `;
}

function historyErrorPanel() {
  if (!state.historyError) return "";
  return `<div class="error-panel" role="alert">${escapeHtml(state.historyError)}</div>`;
}

function findLocalRecipient(accountNumber, bankId) {
  const recipients = {
    "bank-sim-1:100001": "Penerima Simulasi Satu",
    "bank-sim-2:100002": "Penerima Simulasi Dua",
  };
  return recipients[`${bankId}:${accountNumber}`] || "";
}

function currentRecipient() {
  return findLocalRecipient(state.accountNumber, state.bankId);
}

function renderRecipientVerification() {
  const recipientName = currentRecipient();
  if (recipientName) {
    return `
      <div class="card identity-card" role="status" aria-live="polite">
        <div class="avatar" aria-hidden="true">${escapeHtml(recipientName.charAt(0).toUpperCase())}</div>
        <div><strong>${escapeHtml(recipientName)}</strong><br><span>${escapeHtml(selectedBank().name)}</span><br><span class="method-meta">Identitas simulasi terverifikasi</span></div>
      </div>
    `;
  }

  const hasInput = Boolean(state.accountNumber || state.bankId);
  return `
    <div class="simulation-note" role="status" aria-live="polite">
      ${hasInput
        ? "Penerima belum terverifikasi dari data simulasi."
        : "Masukkan rekening simulasi dan pilih bank untuk memverifikasi penerima."}
    </div>
  `;
}

function renderHome() {
  const recentTransactions = state.history.slice(0, 3);
  app.innerHTML = `
    <div class="page dashboard-page">
      <div class="dashboard-shell">
        <aside class="dashboard-sidebar" aria-label="Navigasi simulasi">
          <button class="dashboard-brand" type="button" data-action="home" aria-label="J-Connect, Beranda simulasi">
            <span class="brand-mark" aria-hidden="true">J</span>
            <span>J-Connect<small>Bank Jatim · Simulasi</small></span>
          </button>
          <span class="dashboard-nav-label">MENU SIMULASI</span>
          <nav class="dashboard-nav">
            <button class="dashboard-nav-link active" type="button" data-action="home" aria-current="page"><span aria-hidden="true">⌂</span>Beranda</button>
            <button class="dashboard-nav-link" type="button" data-action="new-transfer"><span aria-hidden="true">⇄</span>Transfer Antarbank</button>
            <button class="dashboard-nav-link" type="button" data-action="history"><span aria-hidden="true">◷</span>Riwayat Transaksi</button>
            <button class="dashboard-nav-link" type="button" data-action="help"><span aria-hidden="true">?</span>Bantuan Transfer</button>
          </nav>
          <div class="dashboard-sidebar-bottom">
            <div class="sidebar-simulation-icon" aria-hidden="true">✓</div>
            <strong>Simulasi lokal</strong>
            <p>Tidak terhubung ke rekening atau sistem perbankan nyata.</p>
            <button class="text-button" type="button" data-action="help">Tentang simulasi <span aria-hidden="true">→</span></button>
          </div>
          <div class="dashboard-sidebar-footer">J-Connect · Bank Jatim</div>
        </aside>
        <div class="dashboard-main">
          <header class="dashboard-topbar">
            <div>
              <span class="eyebrow">BERANDA SIMULASI</span>
              <h1>Selamat datang di J-Connect</h1>
              <p>Kelola alur transfer antarbank simulasi Anda.</p>
            </div>
            <span class="simulation-mode"><span aria-hidden="true"></span>Mode simulasi</span>
          </header>
          ${networkPanel()}
          ${historyErrorPanel()}
          <section class="dashboard-hero">
            <div class="dashboard-hero-copy">
              <span class="dashboard-hero-kicker">TRANSFER ANTARBANK</span>
              <h2>Periksa tujuan sebelum transfer.</h2>
              <p>Tinjau penerima, metode, dan status dalam satu alur simulasi yang jelas.</p>
              <button class="button dashboard-hero-button" type="button" data-action="new-transfer">Mulai transfer simulasi <span aria-hidden="true">→</span></button>
            </div>
            <div class="dashboard-hero-steps" aria-label="Tahapan transfer simulasi">
              <div><span>01</span><strong>Periksa penerima</strong><small>Nama dan bank tujuan</small></div>
              <div><span>02</span><strong>Tinjau metode</strong><small>Rincian yang tersedia</small></div>
              <div><span>03</span><strong>Pantau status</strong><small>Ikuti pembaruan terbaru</small></div>
            </div>
          </section>
          <section class="dashboard-quick-section" aria-labelledby="dashboard-quick-title">
            <div class="dashboard-section-heading">
              <div><span class="eyebrow">AKSES CEPAT</span><h2 id="dashboard-quick-title">Layanan simulasi</h2></div>
            </div>
            <nav class="dashboard-quick-grid" aria-label="Akses layanan simulasi">
              <button class="dashboard-quick-card" type="button" data-action="new-transfer">
                <span class="dashboard-quick-icon" aria-hidden="true">⇄</span><span><strong>Transfer Antarbank</strong><small>Mulai alur transfer lokal</small></span><span class="quick-arrow" aria-hidden="true">→</span>
              </button>
              <button class="dashboard-quick-card" type="button" data-action="history">
                <span class="dashboard-quick-icon history" aria-hidden="true">◷</span><span><strong>Riwayat Transaksi</strong><small>Lihat status simulasi terbaru</small></span><span class="quick-arrow" aria-hidden="true">→</span>
              </button>
              <button class="dashboard-quick-card" type="button" data-action="help">
                <span class="dashboard-quick-icon help" aria-hidden="true">?</span><span><strong>Bantuan Transfer</strong><small>Arahan untuk status belum jelas</small></span><span class="quick-arrow" aria-hidden="true">→</span>
              </button>
            </nav>
          </section>
          <div class="dashboard-content-grid">
            <section class="dashboard-activity card" aria-labelledby="activity-title">
              <div class="dashboard-section-heading activity-heading">
                <div><span class="eyebrow">AKTIVITAS LOKAL</span><h2 id="activity-title">Transaksi terbaru</h2></div>
                <button class="text-button" type="button" data-action="history">Lihat semua <span aria-hidden="true">→</span></button>
              </div>
              ${recentTransactions.length ? `
                <div class="dashboard-transaction-list">
                  ${recentTransactions.map((transaction) => `
                    <article class="dashboard-transaction">
                      <span class="transaction-mark" aria-hidden="true">↗</span>
                      <span class="transaction-description"><strong>${escapeHtml(transaction.recipientName)}</strong><small>${escapeHtml(transaction.bankName)} · ${escapeHtml(transaction.methodName)}</small>${transaction.reference ? `<small>Referensi: ${escapeHtml(transaction.reference)}</small>` : ""}</span>
                      <span class="transaction-amount">${formatAmount(transaction.amount)}</span>
                      <span class="history-status ${transaction.status === STATUS.SUCCESS ? "success" : transaction.status === STATUS.FAILED ? "failed" : "processing"}">${transaction.status === STATUS.SUCCESS ? "✓" : transaction.status === STATUS.FAILED ? "!" : "⏳"} ${escapeHtml(transaction.status)}</span>
                    </article>
                  `).join("")}
                </div>
              ` : `
                <div class="dashboard-empty">
                  <span class="empty-activity-icon" aria-hidden="true">◷</span>
                  <div><strong>Belum ada transaksi simulasi</strong><p>Riwayat akan muncul setelah Anda menjalankan alur transfer.</p></div>
                  <button class="button button-secondary" type="button" data-action="new-transfer">Mulai simulasi</button>
                </div>
              `}
            </section>
            <aside class="dashboard-side-panels" aria-label="Informasi simulasi dan bantuan">
              <section class="dashboard-note-card">
                <span class="note-icon" aria-hidden="true">i</span>
                <h2>Informasi saldo</h2>
                <p>Saldo rekening dan rekening sumber tidak tersedia dalam simulasi ini.</p>
                <span class="note-foot">Data transaksi hanya tersimpan lokal di browser.</span>
              </section>
              <section class="dashboard-help-card">
                <span class="help-icon-large" aria-hidden="true">?</span>
                <h2>Status belum jelas?</h2>
                <p>Periksa riwayat terlebih dahulu. Jangan ulangi transfer serupa jika status masih diproses.</p>
                <button class="text-button" type="button" data-action="help">Buka panduan bantuan <span aria-hidden="true">→</span></button>
              </section>
            </aside>
          </div>
          <footer class="dashboard-footer"><span>J-Connect · Simulasi transfer antarbank</span><span>Data lokal · Tidak ada transaksi bank nyata</span></footer>
        </div>
      </div>
    </div>
  `;
}

function renderTransfer() {
  app.innerHTML = `
    <div class="page">
      ${header("Transfer Antarbank", "home")}
      <div class="content">
        ${networkPanel()}
        ${historyErrorPanel()}
        <ol class="confirm-steps transfer-progress" aria-label="Langkah transfer">
          <li class="current" aria-current="step"><span>1</span>Tujuan</li>
          <li><span>2</span>Metode</li>
          <li><span>3</span>Konfirmasi</li>
        </ol>
        <p class="simulation-note">Data simulasi tersedia: rekening 100001 untuk Bank Simulasi A dan 100002 untuk Bank Simulasi B. Nama penerima hanya ditampilkan dari pemetaan lokal.</p>
        <form id="transfer-form" class="transfer-form" novalidate>
          <div class="form-group">
            <label for="accountNumber">Nomor rekening tujuan simulasi</label>
            <input class="input" id="accountNumber" name="accountNumber" inputmode="numeric" autocomplete="off"
              value="${escapeHtml(state.accountNumber)}" aria-describedby="account-error recipient-error"
              placeholder="Contoh: 100001" />
            <div id="account-error" class="field-error" role="alert"></div>
          </div>
          <div class="form-group">
            <label for="bankId">Bank tujuan</label>
            <select class="input" id="bankId" name="bankId" aria-describedby="bank-error">
              <option value="">Pilih bank simulasi</option>
              ${banks.map((bank) => `<option value="${bank.id}" ${state.bankId === bank.id ? "selected" : ""}>${bank.name}</option>`).join("")}
            </select>
            <div id="bank-error" class="field-error" role="alert"></div>
          </div>
          <div id="recipient-verification">${renderRecipientVerification()}</div>
          <div id="recipient-error" class="field-error" role="alert"></div>
          <div class="form-group form-group-wide">
            <label for="amount">Nominal</label>
            <input class="input" id="amount" name="amount" inputmode="numeric" autocomplete="off"
              value="${escapeHtml(state.amount)}" aria-describedby="amount-error" placeholder="Rp" />
            <div id="amount-error" class="field-error" role="alert"></div>
          </div>
          <div class="actions">
            <button class="button button-primary" type="submit">Lihat dan Pilih Metode</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderMethods() {
  const bank = selectedBank();
  const recipientName = currentRecipient();
  if (!bank || !recipientName) {
    state.route = "transfer";
    renderTransfer();
    return;
  }

  app.innerHTML = `
    <div class="page directory-screen">
      <header class="site-header">
        <button class="site-brand" type="button" data-action="home" aria-label="J-Connect, Beranda">
          <span class="brand-mark" aria-hidden="true">J</span>
          <span>J-Connect<small>Bank Jatim · Simulasi</small></span>
        </button>
        <nav class="site-nav" aria-label="Navigasi utama">
          <button type="button" class="site-nav-link" data-action="home">Beranda</button>
          <button type="button" class="site-nav-link active" data-action="back-transfer" aria-current="page">Transfer</button>
          <button type="button" class="site-nav-link" data-action="history">Riwayat</button>
          <button type="button" class="site-nav-link" data-action="help">Bantuan</button>
        </nav>
        <button class="button button-secondary site-login" type="button" data-action="back-transfer">Ubah tujuan</button>
      </header>
      <div class="directory-main">
        <nav class="directory-breadcrumb" aria-label="Breadcrumb">
          <button type="button" data-action="home">Beranda</button><span aria-hidden="true">/</span>
          <button type="button" data-action="back-transfer">Transfer</button><span aria-hidden="true">/</span>
          <span aria-current="page">Metode transfer</span>
        </nav>
        <div class="directory-heading">
          <div>
            <span class="eyebrow">LANGKAH 2 DARI 3</span>
            <h1>Pilih metode transfer</h1>
            <p>Bandingkan pilihan simulasi sebelum meninjau ringkasan konfirmasi.</p>
          </div>
          <div class="directory-recipient">
            <span class="recipient-avatar" aria-hidden="true">${escapeHtml(recipientName.charAt(0).toUpperCase())}</span>
            <span><small>Penerima simulasi</small><strong>${escapeHtml(recipientName)}</strong><small>${escapeHtml(bank.name)}</small></span>
            <button type="button" class="text-button" data-action="correct">Ubah</button>
          </div>
        </div>
        ${networkPanel()}
        ${historyErrorPanel()}
        <div class="directory-layout">
          <section class="directory-results" aria-labelledby="method-list-title">
            <div class="directory-toolbar">
              <div><h2 id="method-list-title">Metode transfer</h2><p>Informasi biaya dan ketentuan belum ditetapkan.</p></div>
              <span class="method-count">${methods.length} pilihan simulasi</span>
            </div>
            <p class="simulation-note method-simulation-note">Nama metode dan seluruh rincian berikut hanya untuk simulasi. Biaya, kecepatan, ketentuan, dan batas nominal masih TBD.</p>
            <div class="method-list method-grid" role="radiogroup" aria-label="Pilih metode transfer simulasi">
              ${methods.map((method) => `
                <label class="method-option method-card ${state.methodId === method.id ? "selected" : ""}">
                  <input type="radio" name="method" value="${method.id}" ${state.methodId === method.id ? "checked" : ""} />
                  <span class="method-card-content">
                    <span class="method-card-head">
                      <span class="method-symbol" aria-hidden="true">${method.id === methods[0].id ? "↗" : "⇄"}</span>
                      <span><strong>${escapeHtml(method.name)}</strong><span class="method-meta">Metode transfer simulasi</span></span>
                      <span class="method-selected-mark" aria-hidden="true">✓</span>
                    </span>
                    <span class="method-card-description">Bandingkan informasi metode sebelum melanjutkan. Nilai resmi belum tersedia dalam simulasi ini.</span>
                    <span class="method-facts">
                      <span><small>Biaya</small><strong>${escapeHtml(method.fee)}</strong></span>
                      <span><small>Kecepatan</small><strong>${escapeHtml(method.speed)}</strong></span>
                      <span><small>Ketentuan</small><strong>${escapeHtml(method.terms)}</strong></span>
                      <span><small>Batas nominal</small><strong>${escapeHtml(method.limit)}</strong></span>
                    </span>
                  </span>
                </label>
              `).join("")}
            </div>
            <div id="method-error" class="field-error" role="alert"></div>
            <div class="directory-actions">
              <button class="button button-secondary" type="button" data-action="back-transfer">Kembali ke tujuan</button>
              <button class="button button-primary" type="button" data-action="confirm-method">Lanjut ke konfirmasi <span aria-hidden="true">→</span></button>
            </div>
          </section>
          <aside class="directory-sidebar" aria-label="Informasi transfer">
            <section class="info-card">
              <span class="info-card-icon" aria-hidden="true">i</span>
              <h2>Informasi metode</h2>
              <p>Rincian biaya, kecepatan, ketentuan, dan batas nominal belum ditentukan untuk pilihan simulasi.</p>
              <ul>
                <li>Bandingkan informasi dengan format yang sama.</li>
                <li>Tinjau seluruh rincian pada konfirmasi.</li>
              </ul>
            </section>
            <section class="security-card">
              <span class="security-icon" aria-hidden="true">✓</span>
              <h2>Periksa tujuan Anda</h2>
              <p>Pastikan nama penerima dan bank tujuan sudah benar sebelum menyetujui transfer simulasi.</p>
              <button type="button" class="text-button" data-action="correct">Ubah tujuan <span aria-hidden="true">→</span></button>
            </section>
            <button class="assistance-link" type="button" data-action="help">
              <span class="assistance-icon" aria-hidden="true">?</span>
              <span><strong>Butuh bantuan?</strong><small>Baca panduan transaksi simulasi</small></span>
              <span aria-hidden="true">→</span>
            </button>
          </aside>
        </div>
      </div>
      <footer class="site-footer">
        <span class="footer-brand"><span class="brand-mark" aria-hidden="true">J</span><strong>J-Connect</strong></span>
        <span>Simulasi lokal · Tidak terhubung ke rekening atau sistem perbankan nyata</span>
        <nav aria-label="Tautan bantuan"><button type="button" data-action="history">Riwayat</button><button type="button" data-action="help">Bantuan</button></nav>
      </footer>
    </div>
  `;
}

function renderConfirmation() {
  const bank = selectedBank();
  const method = selectedMethod();
  const recipientName = currentRecipient();
  const maskedAccount = state.accountNumber
    ? `•••• ${state.accountNumber.slice(-4)}`
    : "Nomor rekening simulasi";
  const matchingDuplicate = checkDuplicate();
  const duplicateProcessing = state.history.some((item) =>
    item.id === state.duplicateTransactionId &&
    item.id === matchingDuplicate?.id &&
    item.status === STATUS.PROCESSING
  );
  if (!bank || !method || !recipientName) {
    state.route = "transfer";
    renderTransfer();
    return;
  }

  app.innerHTML = `
    <div class="page confirm-page">
      <header class="site-header">
        <button class="site-brand" type="button" data-action="home" aria-label="J-Connect, Beranda">
          <span class="brand-mark" aria-hidden="true">J</span>
          <span>J-Connect<small>Bank Jatim · Simulasi</small></span>
        </button>
        <nav class="site-nav" aria-label="Navigasi utama">
          <button type="button" class="site-nav-link" data-action="home">Beranda</button>
          <button type="button" class="site-nav-link active" data-action="methods" aria-current="page">Transfer</button>
          <button type="button" class="site-nav-link" data-action="history">Riwayat</button>
          <button type="button" class="site-nav-link" data-action="help">Bantuan</button>
        </nav>
        <button class="button button-secondary site-login" type="button" data-action="correct">Ubah tujuan</button>
      </header>
      <div class="confirm-main">
        <nav class="directory-breadcrumb" aria-label="Breadcrumb">
          <button type="button" data-action="home">Beranda</button><span aria-hidden="true">/</span>
          <button type="button" data-action="methods">Transfer</button><span aria-hidden="true">/</span>
          <span aria-current="page">Konfirmasi</span>
        </nav>
        <div class="confirm-heading">
          <div>
            <span class="eyebrow">LANGKAH 3 DARI 3</span>
            <h1>Periksa detail penerima</h1>
            <p>Pastikan informasi tujuan transfer sudah benar sebelum menyetujui simulasi.</p>
          </div>
          <ol class="confirm-steps" aria-label="Langkah transfer">
            <li class="complete"><span>✓</span>Tujuan</li>
            <li class="complete"><span>✓</span>Detail transfer</li>
            <li class="current" aria-current="step"><span>3</span>Konfirmasi</li>
          </ol>
        </div>
        ${networkPanel()}
        ${historyErrorPanel()}
        ${duplicateProcessing ? `
          <div class="warning-panel" role="alert">
            <strong>Transfer serupa masih diproses.</strong>
            <p>Periksa status transaksi sebelum mengirim ulang. Status ini belum final.</p>
            <div class="actions">
              <button class="button button-secondary" type="button" data-action="review-duplicate">Tinjau Status</button>
              <button class="button button-secondary" type="button" data-action="cancel-duplicate">Batal dan Kembali ke Formulir</button>
              <button class="button button-primary" type="button" data-action="proceed-duplicate">Lanjutkan Simulasi</button>
            </div>
          </div>
        ` : ""}
        <div class="confirm-layout">
          <div class="confirm-primary-column">
            <section class="recipient-profile card" aria-labelledby="recipient-title">
              <div class="profile-heading">
                <span class="eyebrow">TUJUAN TRANSFER</span>
                <button class="button button-secondary profile-edit" type="button" data-action="correct">Ubah Tujuan</button>
              </div>
              <div class="profile-identity">
                <span class="bank-logo-placeholder" aria-hidden="true">▣</span>
                <div class="profile-name">
                  <h2 id="recipient-title">${escapeHtml(recipientName)}</h2>
                  <p>${escapeHtml(bank.name)}</p>
                  <span class="account-number">${escapeHtml(maskedAccount)}</span>
                </div>
              </div>
              <div class="recipient-verification">
                <span aria-hidden="true">✓</span>
                <span><strong>Nama penerima terverifikasi</strong><small>Berdasarkan data simulasi lokal</small></span>
              </div>
            </section>
            <section class="selected-method-card card" aria-labelledby="selected-method-title">
              <div class="selected-method-header">
                <span class="method-symbol" aria-hidden="true">⇄</span>
                <span><small>METODE TERPILIH</small><strong id="selected-method-title">${escapeHtml(method.name)}</strong></span>
                <span class="method-selected-mark selected" aria-hidden="true">✓</span>
              </div>
              <div class="selected-method-facts">
                <span><small>Biaya administrasi</small><strong>${escapeHtml(method.fee)}</strong></span>
                <span><small>Kecepatan</small><strong>${escapeHtml(method.speed)}</strong></span>
                <span><small>Ketentuan</small><strong>${escapeHtml(method.terms)}</strong></span>
              </div>
              <button type="button" class="text-button selected-method-edit" data-action="methods">Ubah metode transfer <span aria-hidden="true">→</span></button>
            </section>
            <section class="confirm-security-note">
              <span class="security-icon" aria-hidden="true">✓</span>
              <div><strong>Periksa kembali nama dan rekening tujuan</strong><p>Pastikan informasi penerima sudah sesuai sebelum menyetujui transfer simulasi.</p></div>
            </section>
            <div class="confirm-actions">
              <button class="button button-secondary" type="button" data-action="methods">Kembali</button>
              ${duplicateProcessing ? "" : `<button class="button button-primary" type="button" data-action="approve">Setujui Transfer Simulasi <span aria-hidden="true">→</span></button>`}
            </div>
          </div>
          <aside class="confirm-sidebar" aria-label="Ringkasan dan bantuan transfer">
            <section class="confirm-summary card" aria-labelledby="confirm-summary-title">
              <div class="summary-title-row">
                <h2 id="confirm-summary-title">Ringkasan transfer</h2>
                <span class="summary-sim-tag">SIMULASI</span>
              </div>
              <dl>
                <div class="summary-row"><dt>Penerima</dt><dd>${escapeHtml(recipientName)}</dd></div>
                <div class="summary-row"><dt>Bank tujuan</dt><dd>${escapeHtml(bank.name)}</dd></div>
                <div class="summary-row summary-amount-row"><dt>Nominal transfer</dt><dd>${formatAmount(state.amount)}</dd></div>
                <div class="summary-row"><dt>Biaya administrasi</dt><dd>${escapeHtml(method.fee)}</dd></div>
                <div class="summary-row"><dt>Metode</dt><dd>${escapeHtml(method.name)}</dd></div>
                <div class="summary-row summary-total"><dt>Total dana didebit</dt><dd>TBD</dd></div>
              </dl>
              <p class="summary-disclaimer">Total debit belum dapat dihitung karena biaya metode masih TBD.</p>
            </section>
            <section class="confirm-help-card">
              <span class="help-status-icon" aria-hidden="true">i</span>
              <div><strong>Status transaksi</strong><p>Status terbaru akan ditampilkan setelah simulasi disetujui. Jika belum jelas, periksa riwayat dan jangan mengulang transfer serupa.</p></div>
              <button type="button" class="text-button" data-action="help">Buka bantuan <span aria-hidden="true">→</span></button>
              <button type="button" class="text-button" data-action="history">Lihat riwayat <span aria-hidden="true">→</span></button>
            </section>
          </aside>
        </div>
      </div>
      <footer class="site-footer">
        <span class="footer-brand"><span class="brand-mark" aria-hidden="true">J</span><strong>J-Connect</strong></span>
        <span>Simulasi lokal · Tidak terhubung ke rekening atau sistem perbankan nyata</span>
        <nav aria-label="Tautan bantuan"><button type="button" data-action="history">Riwayat</button><button type="button" data-action="help">Bantuan</button></nav>
      </footer>
    </div>
  `;
}

function renderStatus() {
  const transaction = state.history.find((item) => item.id === state.currentTransactionId);
  if (!transaction) {
    state.route = "home";
    renderHome();
    return;
  }

  const statusClass = transaction.status === STATUS.SUCCESS ? "status-success" :
    transaction.status === STATUS.FAILED ? "status-failed" : "status-processing";
  const statusIcon = transaction.status === STATUS.SUCCESS ? "✓" :
    transaction.status === STATUS.FAILED ? "!" : "⏳";
  const statusTitle = transaction.status === STATUS.SUCCESS ? "Transfer Berhasil" :
    transaction.status === STATUS.FAILED ? "Transfer Gagal" : "Sedang Diproses";
  const statusDescription = transaction.status === STATUS.SUCCESS ?
    "Status terbaru menyatakan transfer berhasil." :
    transaction.status === STATUS.FAILED ?
      "Status terbaru menyatakan transfer gagal. Periksa riwayat atau hubungi bantuan." :
      "Status belum final. Periksa riwayat atau tunggu pembaruan status.";

  app.innerHTML = `
    <div class="page">
      ${header("Status Transaksi", "home")}
      <div class="content">
        ${networkPanel()}
        ${historyErrorPanel()}
        <p class="simulation-note">Status ini hanya hasil simulasi lokal. Tidak ada transaksi yang dikirim ke bank.</p>
        <div class="card status-card" role="status">
          <div class="status-icon ${statusClass}" aria-hidden="true">${statusIcon}</div>
          <h2>${statusTitle}</h2>
          <p>${statusDescription}</p>
          ${transaction.reference ? `<p><strong>Nomor referensi simulasi:</strong> ${escapeHtml(transaction.reference)}</p>` : ""}
          ${!transaction.reference ? `<p class="method-meta">Nomor referensi belum tersedia dalam simulasi ini.</p>` : ""}
        </div>

        ${transaction.status === STATUS.PROCESSING ? `
          <div class="loading" role="status">
            <span class="spinner" aria-hidden="true"></span>
            <span>Menunggu pembaruan status. Periksa riwayat jika belum jelas.</span>
          </div>
          <div class="card">
            <h3>Perbarui Status Simulasi</h3>
            <p class="method-meta">Tidak ada durasi otomatis yang ditetapkan oleh PRD.</p>
            <div class="actions">
              <button class="button button-secondary" type="button" data-action="set-success">Simulasikan Berhasil</button>
              <button class="button button-danger" type="button" data-action="set-failed">Simulasikan Gagal</button>
            </div>
          </div>
        ` : ""}

        <div class="actions">
          <button class="button button-primary" type="button" data-action="history">Buka Riwayat</button>
          <button class="button button-secondary" type="button" data-action="help">Customer Service</button>
          ${state.duplicateTransactionId && transaction.id === state.duplicateTransactionId && transaction.status === STATUS.PROCESSING ? `<button class="button button-secondary" type="button" data-action="confirm">Kembali ke Konfirmasi</button>` : ""}
          ${transaction.status !== STATUS.PROCESSING ? `<button class="button button-secondary" type="button" data-action="new-transfer">Transfer Baru</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

function renderHistory() {
  app.innerHTML = `
    <div class="page">
      ${header("Riwayat Transaksi", "home")}
      <div class="content">
        ${networkPanel()}
        ${historyErrorPanel()}
        ${state.history.length === 0 ? `
          <div class="empty-state">
            <strong>${state.historyError ? "Riwayat tidak dapat ditampilkan" : "Belum ada transaksi"}</strong>
            <span>${state.historyError ? "Periksa pesan kendala penyimpanan di atas." : "Riwayat akan muncul setelah transfer simulasi dimulai."}</span>
            <div class="actions"><button class="button button-primary" type="button" data-action="new-transfer">Mulai Transfer</button></div>
          </div>
        ` : state.history.map((transaction) => `
          <article class="history-item">
            <div class="history-top">
              <div><strong>${escapeHtml(transaction.recipientName)}</strong><br><span class="method-meta">${escapeHtml(transaction.bankName)}</span></div>
              <span class="history-status ${transaction.status === STATUS.SUCCESS ? "success" : transaction.status === STATUS.FAILED ? "failed" : "processing"}">
                ${transaction.status === STATUS.SUCCESS ? "✓" : transaction.status === STATUS.FAILED ? "!" : "⏳"} ${escapeHtml(transaction.status)}
              </span>
            </div>
            <p>${formatAmount(transaction.amount)} · ${escapeHtml(transaction.methodName)}</p>
            ${transaction.reference ? `<p><strong>Nomor referensi simulasi:</strong> ${escapeHtml(transaction.reference)}</p>` : `<p>Nomor referensi belum tersedia dalam simulasi ini.</p>`}
            <button class="text-button" type="button" data-history-id="${transaction.id}">Lihat Detail</button>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderHelp() {
  app.innerHTML = `
    <div class="page">
      ${header("Customer Service", "home")}
      <div class="content">
        ${networkPanel()}
        ${historyErrorPanel()}
        <div class="card">
          <h2>Bantuan Transfer</h2>
          <p>Untuk transaksi yang belum jelas, periksa riwayat terlebih dahulu. Jangan mengirim transfer serupa jika status masih diproses.</p>
          <div class="actions">
            <button class="button button-primary" type="button" data-action="history">Buka Riwayat</button>
            <button class="button button-secondary" type="button" data-action="home">Kembali ke Beranda</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function validateTransferForm(shouldFocusInvalid = true) {
  state.validationAttempted = true;
  let valid = true;
  const setError = (fieldId, errorId, message, markInvalid = true) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    const hasError = Boolean(message);
    if (field && markInvalid) field.setAttribute("aria-invalid", String(hasError));
    if (error) error.textContent = message;
    if (hasError) valid = false;
  };

  const accountNumber = state.accountNumber.trim();
  const bankId = state.bankId;
  const amount = state.amount.trim();
  const recipientName = findLocalRecipient(accountNumber, bankId);
  const amountIsValid = /^\d+$/.test(amount) && BigInt(amount || "0") > 0n;

  setError(
    "accountNumber",
    "account-error",
    !accountNumber
      ? "Masukkan nomor rekening tujuan simulasi."
      : !/^\d+$/.test(accountNumber)
        ? "Nomor rekening simulasi hanya boleh berisi angka."
        : ""
  );
  setError("bankId", "bank-error", bankId ? "" : "Pilih bank tujuan simulasi.");
  setError(
    "amount",
    "amount-error",
    !amount
      ? "Masukkan nominal transfer."
      : !/^\d+$/.test(amount)
        ? "Nominal hanya boleh berisi angka."
        : !amountIsValid
          ? "Nominal harus lebih besar dari nol."
          : ""
  );
  setError(
    "accountNumber",
    "recipient-error",
    accountNumber && bankId && /^\d+$/.test(accountNumber) && !recipientName
      ? "Rekening tidak cocok dengan bank yang dipilih. Periksa nomor rekening atau pilih bank yang sesuai."
      : "",
    false
  );

  if (accountNumber && bankId && !recipientName) {
    const accountField = document.getElementById("accountNumber");
    if (accountField) accountField.setAttribute("aria-invalid", "true");
    valid = false;
  }

  if (!valid && shouldFocusInvalid) {
    document.querySelector('#transfer-form [aria-invalid="true"]')?.focus();
    return false;
  }

  return valid;
}

function checkDuplicate() {
  return state.history.find((transaction) =>
    transaction.status === STATUS.PROCESSING &&
    transaction.accountNumber === state.accountNumber &&
    transaction.bankId === state.bankId &&
    BigInt(transaction.amount) === BigInt(state.amount) &&
    transaction.methodId === state.methodId
  );
}

function approveTransfer() {
  const duplicate = checkDuplicate();
  if (duplicate && state.duplicateTransactionId !== duplicate.id) {
    state.duplicateTransactionId = duplicate.id;
    renderConfirmation();
    return;
  }

  state.duplicateTransactionId = null;
  createTransfer();
}

function createTransfer() {
  const bank = selectedBank();
  const method = selectedMethod();
  if (!bank || !method || !currentRecipient()) {
    state.route = "transfer";
    renderTransfer();
    return;
  }

  const id = `trx-${Date.now()}-${state.history.length}`;
  const transaction = {
    id,
    recipientName: currentRecipient(),
    accountNumber: state.accountNumber,
    bankId: bank.id,
    bankName: bank.name,
    amount: state.amount,
    methodId: method.id,
    methodName: method.name,
    status: STATUS.PROCESSING,
    reference: null,
  };

  state.history.unshift(transaction);
  state.currentTransactionId = id;
  state.duplicateTransactionId = null;
  saveHistory();
  state.route = "status";
  renderStatus();
}

function updateStatus(status) {
  if (!Object.values(STATUS).includes(status)) return;
  const transaction = state.history.find((item) => item.id === state.currentTransactionId);
  if (!transaction) return;
  transaction.status = status;
  if (state.duplicateTransactionId === transaction.id) state.duplicateTransactionId = null;
  saveHistory();
  renderStatus();
}

function startNewTransfer() {
  state.accountNumber = "";
  state.bankId = "";
  state.amount = "";
  state.methodId = "";
  state.currentTransactionId = null;
  state.duplicateTransactionId = null;
  state.validationAttempted = false;
  go("transfer");
}

function refreshRecipientVerification() {
  const verification = document.getElementById("recipient-verification");
  if (verification) verification.innerHTML = renderRecipientVerification();
  if (state.validationAttempted) validateTransferForm(false);
}

function go(route) {
  state.route = route;
  if (route === "home") renderHome();
  if (route === "transfer") renderTransfer();
  if (route === "methods") renderMethods();
  if (route === "history") renderHistory();
  if (route === "help") renderHelp();
  if (route === "status") renderStatus();
  if (route === "confirm") renderConfirmation();
}

document.addEventListener("input", (event) => {
  if (event.target.id === "accountNumber") {
    state.accountNumber = event.target.value;
    state.methodId = "";
    state.duplicateTransactionId = null;
    refreshRecipientVerification();
  }
  if (event.target.id === "amount") {
    state.amount = event.target.value;
    state.methodId = "";
    state.duplicateTransactionId = null;
    const error = document.getElementById("amount-error");
    if (error) error.textContent = "";
    event.target.setAttribute("aria-invalid", "false");
    if (state.validationAttempted) validateTransferForm(false);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "bankId") {
    state.bankId = event.target.value;
    state.methodId = "";
    state.duplicateTransactionId = null;
    refreshRecipientVerification();
  }
  if (event.target.name === "method") {
    state.methodId = event.target.value;
    state.duplicateTransactionId = null;
    const error = document.getElementById("method-error");
    if (error) error.textContent = "";
    document.querySelectorAll(".method-option").forEach((option) => option.classList.remove("selected"));
    event.target.closest(".method-option")?.classList.add("selected");
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "transfer-form") return;
  event.preventDefault();
  if (!validateTransferForm()) return;
  go("methods");
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    const action = actionButton.dataset.action;
    if (action === "transfer") {
      go("transfer");
    } else if (action === "back-transfer") {
      go("transfer");
    } else if (action === "methods") {
      go("methods");
    } else if (action === "confirm-method") {
      if (!state.methodId) {
        const error = document.getElementById("method-error");
        if (error) error.textContent = "Pilih salah satu metode simulasi untuk melanjutkan.";
        document.querySelector('input[name="method"]')?.focus();
        return;
      }
      go("confirm");
    } else if (action === "correct") {
      state.duplicateTransactionId = null;
      go("transfer");
    } else if (action === "approve") {
      approveTransfer();
    } else if (action === "review-duplicate") {
      state.currentTransactionId = state.duplicateTransactionId;
      go("status");
    } else if (action === "cancel-duplicate") {
      state.duplicateTransactionId = null;
      go("transfer");
    } else if (action === "proceed-duplicate") {
      state.duplicateTransactionId = null;
      createTransfer();
    } else if (action === "set-success") {
      updateStatus(STATUS.SUCCESS);
    } else if (action === "set-failed") {
      updateStatus(STATUS.FAILED);
    } else if (action === "history") {
      go("history");
    } else if (action === "help") {
      go("help");
    } else if (action === "home") {
      go("home");
    } else if (action === "new-transfer") {
      startNewTransfer();
    } else if (action === "confirm") {
      go("confirm");
    }
  }

  const historyButton = event.target.closest("[data-history-id]");
  if (historyButton) {
    state.currentTransactionId = historyButton.dataset.historyId;
    go("status");
  }
});

window.addEventListener("online", () => {
  state.networkWarning = false;
  go(state.route);
});

window.addEventListener("offline", () => {
  state.networkWarning = true;
  go(state.route);
});

window.addEventListener("storage", (event) => {
  if (event.key !== "jconnect-history" && event.key !== null) return;
  state.history = loadHistory();
  if (!state.history.some((item) => item.id === state.duplicateTransactionId && item.status === STATUS.PROCESSING)) {
    state.duplicateTransactionId = null;
  }
  if (state.route === "status") renderStatus();
  if (state.route === "history") renderHistory();
  if (state.route === "confirm") renderConfirmation();
});

renderHome();
