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
    <div class="${hasInput ? "error-panel" : "simulation-note"}" role="status" aria-live="polite">
      ${hasInput
        ? "Data rekening dan bank tidak cocok dengan penerima simulasi. Periksa kembali tujuan."
        : "Masukkan rekening simulasi dan pilih bank untuk memverifikasi penerima."}
    </div>
  `;
}

function renderHome() {
  app.innerHTML = `
    <div class="page">
      <section class="brand">
        <p>Simulasi New JConnect Mobile</p>
        <h1>Beranda</h1>
      </section>
      <div class="content">
        ${networkPanel()}
        ${historyErrorPanel()}
        <p class="simulation-note">Aplikasi ini menggunakan data simulasi lokal. Tidak terhubung ke rekening atau sistem perbankan nyata.</p>
        <nav class="menu-grid" aria-label="Menu utama">
          <button class="menu-card" type="button" data-action="new-transfer">
            <span aria-hidden="true">⇄</span>
            <div><strong>Transfer Antarbank</strong><span>Transfer ke bank tujuan simulasi</span></div>
          </button>
          <button class="menu-card" type="button" data-action="history">
            <span aria-hidden="true">↗</span>
            <div><strong>Riwayat Transaksi</strong><span>Lihat status dan referensi yang tersedia</span></div>
          </button>
          <button class="menu-card" type="button" data-action="help">
            <span aria-hidden="true">?</span>
            <div><strong>Customer Service</strong><span>Bantuan konteks simulasi</span></div>
          </button>
        </nav>
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
  app.innerHTML = `
    <div class="page">
      ${header("Metode Transfer", "back-transfer")}
      <div class="content">
        ${networkPanel()}
        ${historyErrorPanel()}
        <p class="simulation-note">Nama di bawah hanya label pembanding simulasi, bukan nama metode bank. Biaya, kecepatan, ketentuan, dan batas nominal masih TBD.</p>
        <div class="method-list" role="radiogroup" aria-label="Metode transfer">
          ${methods.map((method) => `
            <label class="method-option ${state.methodId === method.id ? "selected" : ""}">
              <input type="radio" name="method" value="${method.id}" ${state.methodId === method.id ? "checked" : ""} />
              <span>
                <strong>${method.name}</strong>
                <span class="method-meta">Biaya: ${method.fee}</span>
                <span class="method-meta">Kecepatan: ${method.speed}</span>
                <span class="method-meta">Ketentuan: ${method.terms}</span>
                <span class="method-meta">Batas nominal: ${method.limit}</span>
              </span>
            </label>
          `).join("")}
        </div>
        <div id="method-error" class="field-error" role="alert"></div>
        <div class="actions">
          <button class="button button-primary" type="button" data-action="confirm-method">Gunakan Metode Pilihan</button>
        </div>
      </div>
    </div>
  `;
}

function renderConfirmation() {
  const bank = selectedBank();
  const method = selectedMethod();
  const matchingDuplicate = checkDuplicate();
  const duplicateProcessing = state.history.some((item) =>
    item.id === state.duplicateTransactionId &&
    item.id === matchingDuplicate?.id &&
    item.status === STATUS.PROCESSING
  );
  if (!bank || !method) {
    state.route = "transfer";
    renderTransfer();
    return;
  }

  app.innerHTML = `
    <div class="page">
      ${header("Konfirmasi Transfer", "methods")}
      <div class="content">
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
        <div class="card">
          <h2>Ringkasan Transfer</h2>
          <dl>
            <div class="summary-row"><dt>Penerima</dt><dd>${escapeHtml(currentRecipient())}</dd></div>
            <div class="summary-row"><dt>Bank tujuan</dt><dd>${escapeHtml(bank.name)}</dd></div>
            <div class="summary-row"><dt>Nominal</dt><dd>${formatAmount(state.amount)}</dd></div>
            <div class="summary-row"><dt>Biaya administrasi</dt><dd>TBD</dd></div>
            <div class="summary-row"><dt>Metode</dt><dd>${escapeHtml(method.name)}</dd></div>
            <div class="summary-row"><dt>Total dana didebit</dt><dd>TBD (biaya belum ditetapkan)</dd></div>
          </dl>
        </div>
        <button class="button button-secondary button-full-width" type="button" data-action="correct">Ubah Tujuan</button>
        ${duplicateProcessing ? "" : `
          <div class="actions">
            <button class="button button-primary" type="button" data-action="approve">Setujui Transfer Simulasi</button>
          </div>
        `}
      </div>
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

function validateTransferForm() {
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
    accountNumber && bankId && !recipientName
      ? "Data rekening tidak ditemukan untuk bank yang dipilih. Periksa kembali tujuan."
      : "",
    false
  );

  if (accountNumber && bankId && !recipientName) {
    const accountField = document.getElementById("accountNumber");
    if (accountField) accountField.setAttribute("aria-invalid", "true");
    valid = false;
  }

  if (!valid) {
    document.querySelector('#transfer-form [aria-invalid="true"]')?.focus();
    return false;
  }

  state.methodId = "";
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
  go("transfer");
}

function refreshRecipientVerification() {
  const verification = document.getElementById("recipient-verification");
  if (verification) verification.innerHTML = renderRecipientVerification();

  const accountError = document.getElementById("account-error");
  const recipientError = document.getElementById("recipient-error");
  const bankError = document.getElementById("bank-error");
  if (accountError) accountError.textContent = "";
  if (recipientError) recipientError.textContent = "";
  if (bankError && state.bankId) bankError.textContent = "";
  document.getElementById("accountNumber")?.setAttribute("aria-invalid", "false");
  document.getElementById("bankId")?.setAttribute("aria-invalid", "false");
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
