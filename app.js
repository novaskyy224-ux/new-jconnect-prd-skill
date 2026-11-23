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
    name: "Metode Standar",
    fee: "TBD",
    speed: "TBD",
    terms: "Ketentuan simulasi belum ditetapkan",
    limit: "TBD",
  },
  {
    id: "metode-b",
    name: "Metode Prioritas",
    fee: "TBD",
    speed: "TBD",
    terms: "Ketentuan simulasi belum ditetapkan",
    limit: "TBD",
  },
];

const state = {
  route: "home",
  recipientName: "",
  accountNumber: "",
  bankId: "",
  amount: "",
  methodId: "",
  editing: false,
  history: loadHistory(),
  currentTransactionId: null,
  networkWarning: !navigator.onLine,
};

const app = document.getElementById("app");

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem("jconnect-history") || "[]");
  } catch {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem("jconnect-history", JSON.stringify(state.history));
}

function formatAmount(value) {
  const number = Number(String(value).replace(/[^\d]/g, ""));
  if (!number) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
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
      ${backAction ? `<button class="icon-button" type="button" data-action="${backAction}" aria-label="Kembali">←</button>` : "<div style=\"width:44px\"></div>"}
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

function renderHome() {
  app.innerHTML = `
    <div class="page">
      <section class="brand">
        <p>Simulasi New JConnect Mobile</p>
        <h1>Beranda</h1>
      </section>
      <div class="content">
        ${networkPanel()}
        <p class="simulation-note">Aplikasi ini menggunakan data simulasi lokal. Tidak terhubung ke rekening atau sistem perbankan nyata.</p>
        <nav class="menu-grid" aria-label="Menu utama">
          <button class="menu-card" type="button" data-action="transfer">
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
        <p class="simulation-note">Isi data simulasi. Nama penerima hanya ditampilkan berdasarkan pemetaan lokal yang tersedia.</p>
        <form id="transfer-form" novalidate>
          <div class="form-group">
            <label for="accountNumber">Nomor rekening tujuan simulasi</label>
            <input class="input" id="accountNumber" name="accountNumber" inputmode="numeric" autocomplete="off"
              value="${escapeHtml(state.accountNumber)}" aria-describedby="account-error"
              placeholder="Contoh: 100001" />
            <div id="account-error" class="field-error" role="alert"></div>
          </div>
          <div class="form-group">
            <label for="recipientName">Nama penerima</label>
            <input class="input" id="recipientName" name="recipientName" autocomplete="off"
              value="${escapeHtml(state.recipientName)}" aria-describedby="recipient-error"
              placeholder="Diisi otomatis jika tersedia di data simulasi" />
            <div id="recipient-error" class="field-error" role="alert"></div>
          </div>
          <div class="form-group">
            <label for="bankId">Bank tujuan</label>
            <select class="input" id="bankId" name="bankId" aria-describedby="bank-error">
              <option value="">Pilih bank simulasi</option>
              ${banks.map((bank) => `<option value="${bank.id}" ${state.bankId === bank.id ? "selected" : ""}>${bank.name}</option>`).join("")}
            </select>
            <div id="bank-error" class="field-error" role="alert"></div>
          </div>
          <div class="form-group">
            <label for="amount">Nominal</label>
            <input class="input" id="amount" name="amount" inputmode="numeric" autocomplete="off"
              value="${escapeHtml(state.amount)}" aria-describedby="amount-error" placeholder="Rp" />
            <div id="amount-error" class="field-error" role="alert"></div>
          </div>
          ${selectedBank() ? `
            <div class="card identity-card" aria-label="Identitas penerima">
              <div class="avatar" aria-hidden="true">${escapeHtml((state.recipientName || "?").charAt(0).toUpperCase())}</div>
              <div><strong>${escapeHtml(state.recipientName || "Nama belum tersedia")}</strong><br><span>${escapeHtml(selectedBank().name)}</span></div>
            </div>
          ` : ""}
          <div class="actions">
            <button class="button button-secondary" type="button" data-action="methods">Lihat dan Pilih Metode</button>
            <button class="button button-primary" type="submit">Lanjut ke Konfirmasi</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderMethods() {
  app.innerHTML = `
    <div class="page">
      ${header("Metode Transfer", "transfer")}
      <div class="content">
        ${networkPanel()}
        <p class="simulation-note">Nilai biaya, kecepatan, dan batas nominal belum ditetapkan dalam PRD. Semua ditampilkan sebagai TBD.</p>
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
        <div class="card">
          <h2>Ringkasan Transfer</h2>
          <dl>
            <div class="summary-row"><dt>Penerima</dt><dd>${escapeHtml(state.recipientName)}</dd></div>
            <div class="summary-row"><dt>Bank tujuan</dt><dd>${escapeHtml(bank.name)}</dd></div>
            <div class="summary-row"><dt>Nominal</dt><dd>${formatAmount(state.amount)}</dd></div>
            <div class="summary-row"><dt>Biaya</dt><dd>TBD</dd></div>
            <div class="summary-row"><dt>Metode</dt><dd>${escapeHtml(method.name)}</dd></div>
            <div class="summary-row"><dt>Total debit</dt><dd>TBD + ${formatAmount(state.amount)}</dd></div>
          </dl>
        </div>
        <button class="button button-secondary" type="button" data-action="correct" style="width:100%">Ubah Tujuan</button>
        <div class="actions">
          <button class="button button-primary" type="button" data-action="approve">Setujui Transfer Simulasi</button>
        </div>
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
        <div class="card status-card" role="status">
          <div class="status-icon ${statusClass}" aria-hidden="true">${statusIcon}</div>
          <h2>${statusTitle}</h2>
          <p>${statusDescription}</p>
          ${transaction.reference ? `<p><strong>Nomor referensi simulasi:</strong> ${escapeHtml(transaction.reference)}</p>` : ""}
        </div>

        ${transaction.status === STATUS.PROCESSING ? `
          <div class="loading" role="status">
            <span class="spinner" aria-hidden="true"></span>
            <span>Memuat atau menunggu pembaruan status</span>
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
          ${transaction.status !== STATUS.PROCESSING ? `<button class="button button-secondary" type="button" data-action="transfer">Transfer Baru</button>` : ""}
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
        ${state.history.length === 0 ? `
          <div class="empty-state">
            <strong>Belum ada transaksi</strong>
            <span>Riwayat akan muncul setelah transfer simulasi dimulai.</span>
            <div class="actions"><button class="button button-primary" type="button" data-action="transfer">Mulai Transfer</button></div>
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
            ${transaction.reference ? `<p><strong>Nomor referensi:</strong> ${escapeHtml(transaction.reference)}</p>` : `<p><strong>Nomor referensi:</strong> Tidak tersedia</p>`}
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
  const fields = [
    ["accountNumber", "account-error", "Masukkan nomor rekening tujuan simulasi."],
    ["recipientName", "recipient-error", "Masukkan nama penerima atau gunakan pemetaan data simulasi."],
    ["bankId", "bank-error", "Pilih bank tujuan simulasi."],
    ["amount", "amount-error", "Masukkan nominal transfer."],
  ];

  fields.forEach(([fieldId, errorId, message]) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (!field || String(field.value).trim()) {
      if (field) field.setAttribute("aria-invalid", "false");
      if (error) error.textContent = "";
      return;
    }
    valid = false;
    field.setAttribute("aria-invalid", "true");
    error.textContent = message;
  });

  if (valid) state.methodId = state.methodId || methods[0].id;
  return valid;
}

function findLocalRecipient(accountNumber) {
  const recipients = {
    "100001": "Penerima Simulasi Satu",
    "100002": "Penerima Simulasi Dua",
  };
  return recipients[accountNumber] || "";
}

function checkDuplicate() {
  return state.history.find((transaction) =>
    transaction.status === STATUS.PROCESSING &&
    transaction.accountNumber === state.accountNumber &&
    transaction.bankId === state.bankId &&
    transaction.amount === state.amount &&
    transaction.methodId === state.methodId
  );
}

function approveTransfer() {
  const duplicate = checkDuplicate();
  if (duplicate) {
    const cancelTransfer = window.confirm(
      "Ada transfer serupa yang masih diproses. Tekan OK untuk membatalkan transfer ini, atau Cancel untuk melanjutkan."
    );
    if (cancelTransfer) return;
  }

  const bank = selectedBank();
  const method = selectedMethod();
  const id = `trx-${Date.now()}`;
  const transaction = {
    id,
    recipientName: state.recipientName,
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
  saveHistory();
  state.route = "status";
  renderStatus();
}

function updateStatus(status) {
  const transaction = state.history.find((item) => item.id === state.currentTransactionId);
  if (!transaction) return;
  transaction.status = status;
  transaction.reference = status === STATUS.SUCCESS ? `SIM-${transaction.id.slice(-8).toUpperCase()}` : null;
  saveHistory();
  renderStatus();
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
    const recipient = findLocalRecipient(state.accountNumber);
    if (recipient && !state.editing) {
      state.recipientName = recipient;
      const nameInput = document.getElementById("recipientName");
      if (nameInput) nameInput.value = recipient;
    }
  }
  if (event.target.id === "recipientName") {
    state.editing = true;
    state.recipientName = event.target.value;
  }
  if (event.target.id === "amount") state.amount = event.target.value;
});

document.addEventListener("change", (event) => {
  if (event.target.id === "bankId") state.bankId = event.target.value;
  if (event.target.name === "method") {
    state.methodId = event.target.value;
    document.querySelectorAll(".method-option").forEach((option) => option.classList.remove("selected"));
    event.target.closest(".method-option")?.classList.add("selected");
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "transfer-form") return;
  event.preventDefault();
  if (!validateTransferForm()) return;
  state.editing = false;
  go("confirm");
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    const action = actionButton.dataset.action;
    if (action === "transfer") {
      state.editing = false;
      go("transfer");
    } else if (action === "methods") {
      if (!validateTransferForm()) return;
      go("methods");
    } else if (action === "confirm-method") {
      if (!state.methodId) state.methodId = methods[0].id;
      go("confirm");
    } else if (action === "correct") {
      state.editing = true;
      go("transfer");
    } else if (action === "approve") {
      approveTransfer();
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
  if (event.key !== "jconnect-history") return;
  state.history = loadHistory();
  if (state.route === "status") renderStatus();
});

renderHome();
