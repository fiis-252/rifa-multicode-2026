import { apiClient } from "./api.js";

// --- CARGA DE VENTAS PERSONALES Y PESTAÑAS ---
const tabBtnSell = document.getElementById("tab-btn-sell");
const tabBtnHistory = document.getElementById("tab-btn-history");
const viewSellQr = document.querySelector(".dashboard-qr-card");
const viewSellForm = document.querySelector(".form-sell-card");
const viewHistory = document.getElementById("view-history");
const historyList = document.getElementById("vendor-history-list");

// Métricas
const elVstatTickets = document.getElementById("vstat-tickets-count");
const elVstatRevenue = document.getElementById("vstat-revenue-count");
const elVstatBreakdown = document.getElementById("vstat-breakdown");
const elTabHistoryCount = document.getElementById("tab-history-count");

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  const vendorCode = localStorage.getItem("vendor_code") || "25-2";
  const vendorToken = localStorage.getItem("vendor_token");

  if (!vendorToken) {
    window.location.replace("/login");
    return;
  }

  const badgeCode = document.getElementById("vendor-badge-code");
  if (badgeCode) badgeCode.innerText = vendorCode;

  const btnCopy = document.getElementById("btn-copy-vendor-phone");
  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      navigator.clipboard.writeText("917862194").then(() => {
        showToast("Numero 917862194 copiado");
      });
    });
  }
  // gonzalo te amo

  let qtyPink = 1;
  let qtyBlue = 0;

  const elPink = document.getElementById("count-pink");
  const elBlue = document.getElementById("count-blue");
  const elTotal = document.getElementById("sale-total-amount");
  const elChances = document.getElementById("sale-total-chances");

  function updateTotals() {
    const totalAmount = qtyPink * 5 + qtyBlue * 3;
    const totalChances = qtyPink * 2 + qtyBlue * 1;

    if (elPink) elPink.innerText = qtyPink;
    if (elBlue) elBlue.innerText = qtyBlue;
    if (elTotal) elTotal.innerText = `S/ ${totalAmount}.00`;
    if (elChances) {
      elChances.innerText = `${totalChances} ${totalChances === 1 ? "Opcion" : "Opciones"}`;
    }
  }

  document.getElementById("btn-inc-pink")?.addEventListener("click", () => {
    qtyPink++;
    updateTotals();
  });
  document.getElementById("btn-dec-pink")?.addEventListener("click", () => {
    if (qtyPink > 0) qtyPink--;
    updateTotals();
  });
  document.getElementById("btn-inc-blue")?.addEventListener("click", () => {
    qtyBlue++;
    updateTotals();
  });
  document.getElementById("btn-dec-blue")?.addEventListener("click", () => {
    if (qtyBlue > 0) qtyBlue--;
    updateTotals();
  });

  updateTotals();

  const phoneInput = document.getElementById("buyer-phone");
  phoneInput?.addEventListener("input", (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 9) val = val.slice(0, 9);
    if (val.length > 6)
      e.target.value = `${val.slice(0, 3)} ${val.slice(3, 6)} ${val.slice(6)}`;
    else if (val.length > 3)
      e.target.value = `${val.slice(0, 3)} ${val.slice(3)}`;
    else e.target.value = val;
  });

  const fileInput = document.getElementById("input-receipt");
  const previewBox = document.getElementById("receipt-preview-box");
  const thumbImg = document.getElementById("receipt-thumb");
  const fileNameTxt = document.getElementById("receipt-file-name");
  const btnRemoveThumb = document.getElementById("btn-remove-receipt");
  let selectedFile = null;

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      selectedFile = file;
      fileNameTxt.innerText = file.name;

      const reader = new FileReader();
      reader.onload = (event) => {
        thumbImg.src = event.target.result;
        previewBox.style.display = "flex";
      };
      reader.readAsDataURL(file);
    }
  });

  btnRemoveThumb?.addEventListener("click", () => {
    selectedFile = null;
    fileInput.value = "";
    thumbImg.src = "";
    previewBox.style.display = "none";
  });

  const sellForm = document.getElementById("form-sell-ticket");
  const submitBtn = document.getElementById("btn-submit-sale");

  sellForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const totalTickets = qtyPink + qtyBlue;
    if (totalTickets === 0) {
      showToast("Debes seleccionar al menos 1 ticket");
      return;
    }

    const name = document.getElementById("buyer-name").value.trim();
    const rawPhone = phoneInput.value.replace(/\s+/g, "");

    if (rawPhone.length < 9) {
      showToast("Ingresa un numero de celular de 9 dígitos");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Emitiendo Tickets...";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", rawPhone);
    formData.append("code", vendorCode);
    formData.append("quantity", totalTickets);
    formData.append("quantity_premium", qtyPink);
    formData.append("quantity_standard", qtyBlue);
    formData.append("total_amount", qtyPink * 5 + qtyBlue * 3);

    if (selectedFile) {
      formData.append("receipt", selectedFile);
    }

    try {
      const res = await apiClient.request("/tickets", {
        method: "POST",
        body: formData,
      });

      if (res && res.success) {
        showToast(
          `${totalTickets} ticket${totalTickets != 1 ? "s" : ""} emitido${totalTickets != 1 ? "s" : ""}`,
        );
        sellForm.reset();
        btnRemoveThumb?.click();
        qtyPink = 1;
        qtyBlue = 0;
        loadMySales();
        updateTotals();
      } else {
        showToast(res?.error || "Error al procesar la venta");
      }
    } catch (err) {
      console.error(err);
      showToast("Fallo crítico al conectar con el servidor");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Confirmar Tickets";
    }
  });

  document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.replace("/login");
  });
});

async function loadMySales() {
  try {
    const data = await apiClient.request("/tickets/my-sales");
    if (!data || !data.success) return;

    if (elVstatTickets) elVstatTickets.innerText = data.totalSold;
    if (elVstatRevenue) elVstatRevenue.innerText = `S/ ${data.totalRevenue}.00`;
    if (elVstatBreakdown) {
      document.getElementById('vstat-breakdown-blue').innerText = data.countStandard
      document.getElementById('vstat-breakdown-pink').innerText = data.countPremium
    }
    if (elTabHistoryCount) elTabHistoryCount.innerText = data.totalSold;

    if (historyList) {
      if (data.tickets.length === 0) {
        historyList.innerHTML = `<p style="text-align: center; color: var(--text-dim); padding: 2rem;">Aún no has registrado ninguna venta hoy.</p>`;
        return;
      }

      historyList.innerHTML = data.tickets
        .map((t) => {
          const isPink = t.tier === "premium";
          const time = new Date(t.createdAt).toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return `
            <div class="vendor-history-item">
              <div class="vhist-left">
                <span class="vhist-num">#${t.ticketNumber}</span>
                <div class="vhist-buyer">
                  <strong>${t.buyerName}</strong>
                  <small>${t.buyerPhone}</small>
                </div>
              </div>
              <div class="vhist-right">
                <span class="type-pill ${isPink ? "pill-pink" : "pill-blue"}">
                  ${isPink ? "Rosa S/ 5" : "Azul S/ 3"}
                </span>
                <span class="vhist-time">${time}</span>
              </div>
            </div>
          `;
        })
        .join("");
    }
  } catch (err) {
    console.error("[LOAD MY SALES ERROR]", err);
  }
}

tabBtnSell?.addEventListener("click", () => {
  tabBtnSell.classList.add("active");
  tabBtnHistory.classList.remove("active");
  viewSellQr.style.display = "flex";
  viewSellForm.style.display = "block";
  viewHistory.style.display = "none";
});

tabBtnHistory?.addEventListener("click", () => {
  tabBtnHistory.classList.add("active");
  tabBtnSell.classList.remove("active");
  viewSellQr.style.display = "none";
  viewSellForm.style.display = "none";
  viewHistory.style.display = "block";
  loadMySales();
});

loadMySales();
