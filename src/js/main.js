const TARGET_DATE = new Date("2026-10-29T19:00:00").getTime();

function initCountdown() {
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMinutes = document.getElementById("cd-minutes");
  const elSeconds = document.getElementById("cd-seconds");

  if (!elDays) return;

  function update() {
    const now = Date.now();
    const distance = TARGET_DATE - now;

    if (distance <= 0) {
      elDays.innerText = "00";
      elHours.innerText = "00";
      elMinutes.innerText = "00";
      elSeconds.innerText = "00";
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    elDays.innerText = String(d).padStart(2, "0");
    elHours.innerText = String(h).padStart(2, "0");
    elMinutes.innerText = String(m).padStart(2, "0");
    elSeconds.innerText = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

const TREASURY = {
  "25-2": {
    name: "Christopher Acosta",
    phone: "917862194",
    method: "Yape / Plin",
    codeTitle: "Promo 25-2 (Lobo)",
  },
  "26-1": {
    name: "Tesorería 26-1",
    phone: "921584492",
    method: "Yape / Plin",
    codeTitle: "Promo 26-1 (Fenix)",
  },
  "26-2": {
    name: "Tesorería 26-2",
    phone: "945416248",
    method: "Yape / Plin",
    codeTitle: "Promo 26-2 (Gengar)",
  },
};

const state = {
  tier: "premium",
  quantity: 1,
  cohort: "random",
};

const PRICES = {
  standard: { unitPrice: 3, weight: 1, label: "Boleto Azul (Clasico)" },
  premium: { unitPrice: 5, weight: 2, label: "Boleto Premium (Rosa)" },
};

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}

function updateCalculatorUI() {
  const activeConfig = PRICES[state.tier];
  const totalPrice = activeConfig.unitPrice * state.quantity;
  const totalChances = activeConfig.weight * state.quantity;

  const qtyDisplay = document.getElementById("qty-display");
  const summaryTotal = document.getElementById("summary-total");
  const summaryChances = document.getElementById("summary-chances");

  if (qtyDisplay) qtyDisplay.innerText = state.quantity;
  if (summaryTotal) summaryTotal.innerText = `S/ ${totalPrice}.00`;
  if (summaryChances) {
    summaryChances.innerText = `${totalChances} ${totalChances === 1 ? "Opcion" : "Opciones"}`;
  }

  document.querySelectorAll(".ticket-radio-card").forEach((card) => {
    if (card.dataset.type === state.tier) {
      card.classList.add("active");
      const radio = card.querySelector("input");
      if (radio) radio.checked = true;
    } else {
      card.classList.remove("active");
    }
  });

  document.querySelectorAll(".pill-btn").forEach((btn) => {
    const qty = parseInt(btn.dataset.qty, 10);
    btn.classList.toggle("active", qty === state.quantity);
  });

  updateTreasuryAndWhatsApp(totalPrice);
}

function resolveCohort() {
  if (state.cohort !== "random") {
    return state.cohort;
  }
  const codes = Object.keys(TREASURY);
  const randomIndex = Math.floor(Math.random() * codes.length);
  return codes[randomIndex];
}

const TREASURY_PHONE = "917862194";

function updateTreasuryAndWhatsApp(totalPrice) {
  const btnWa = document.getElementById("btn-whatsapp-send");
  const ticketLabel =
    state.tier === "premium"
      ? "Boleto(s) Premium Rosa (S/ 5)"
      : "Boleto(s) Clasico Azul (S/ 3)";

  const msg = encodeURIComponent(
    `¡Hola! Quiero comprar ${state.quantity} ${ticketLabel} para la Rifa Multicodigo FIIS 2026.\n` +
      `Monto transferido: S/ ${totalPrice}.00\n` +
      `Adjunto mi comprobante de pago:`,
  );

  if (btnWa) {
    btnWa.href = `https://wa.me/51${TREASURY_PHONE}?text=${msg}`;
  }
}

function initPurchaseModal() {
  const sheet = document.getElementById("purchase-sheet");
  const btnClose = document.getElementById("btn-close-sheet");
  const btnMinus = document.getElementById("qty-minus");
  const btnPlus = document.getElementById("qty-plus");
  const selectCohort = document.getElementById("select-cohort");
  const btnCopy = document.getElementById("btn-copy-phone");

  function openModal(defaultTier = "premium") {
    state.tier = defaultTier;
    updateCalculatorUI();
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".js-open-purchase").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tier = e.currentTarget.dataset.ticket || "premium";
      openModal(tier);
    });
  });

  if (btnClose) btnClose.addEventListener("click", closeModal);

  if (sheet) {
    sheet.addEventListener("click", (e) => {
      if (e.target === sheet) closeModal();
    });
  }

  document.querySelectorAll(".ticket-radio-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.tier = card.dataset.type;
      updateCalculatorUI();
    });
  });

  if (btnMinus) {
    btnMinus.addEventListener("click", () => {
      if (state.quantity > 1) {
        state.quantity--;
        updateCalculatorUI();
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener("click", () => {
      if (state.quantity < 30) {
        state.quantity++;
        updateCalculatorUI();
      }
    });
  }

  document.querySelectorAll(".pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.quantity = parseInt(btn.dataset.qty, 10);
      updateCalculatorUI();
    });
  });

  if (selectCohort) {
    selectCohort.addEventListener("change", (e) => {
      state.cohort = e.target.value;
      updateCalculatorUI();
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      navigator.clipboard.writeText(TREASURY_PHONE).then(() => {
        showToast(`Numero ${TREASURY_PHONE} copiado`);
      });
    });
  }
}

function checkActiveSession() {
  const token = localStorage.getItem("vendor_token");
  const exp = localStorage.getItem("vendor_token_exp");
  const authBtn = document.getElementById("nav-auth-btn");

  if (!authBtn) return;

  if (token && exp && Date.now() < Number(exp)) {
    authBtn.href = "/dashboard";
    authBtn.title = "Ir a mi Panel de Ventas";

    authBtn.style.borderColor = "rgba(229, 26, 46, 0.4)";
    authBtn.style.color = "#ff5768";
  } else {
    localStorage.removeItem("vendor_token");
    localStorage.removeItem("vendor_code");
    localStorage.removeItem("vendor_token_exp");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  checkActiveSession();
  initCountdown();
  initPurchaseModal();
});
