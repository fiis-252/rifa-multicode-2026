import { apiClient } from "./api.js";

let cachedTickets = [];

async function loadTickets() {
  const tbody = document.getElementById("tickets-table-body");
  const mTotal = document.getElementById("metric-total-count");
  const mBlue = document.getElementById("metric-blue-count");
  const mPink = document.getElementById("metric-pink-count");
  const mMoney = document.getElementById("metric-total-money");

  tbody.innerHTML = `<tr><td colspan="7" class="table-loading">obteniendo tickets...</td></tr>`;

  try {
    const res = await apiClient.request("/tickets");
    cachedTickets = res.tickets || (Array.isArray(res) ? res : []);

    renderMetrics(cachedTickets, { mTotal, mBlue, mPink, mMoney });
    renderTable(cachedTickets);
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="7" class="table-error">error al cargar tickets</td></tr>`;
  }
}

function renderMetrics(tickets, els) {
  let blueCount = 0;
  let pinkCount = 0;
  let totalRevenue = 0;

  tickets.forEach((t) => {
    const isPink =
      t.tier === "premium" || t.type === "premium" || t.weight === 2;
    if (isPink) {
      pinkCount++;
      totalRevenue += 5;
    } else {
      blueCount++;
      totalRevenue += 3;
    }
  });

  if (els.mTotal) els.mTotal.innerText = tickets.length;
  if (els.mBlue) els.mBlue.innerText = blueCount;
  if (els.mPink) els.mPink.innerText = pinkCount;
  if (els.mMoney) els.mMoney.innerText = `S/ ${totalRevenue}.00`;
}

function renderTable(tickets) {
  const tbody = document.getElementById("tickets-table-body");
  if (!tbody) return;

  if (tickets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="table-empty">No se encontraron tickets registrados.</td></tr>`;
    return;
  }

  tbody.innerHTML = tickets
    .map((t, idx) => {
      /*
      id: t.id,
      ticketNumber: t.ticketNumber,
      buyerName: t.buyerName,
      buyerPhone: t.buyerPhone,
      code: t.code,
      tier: t.tier,
      weight: t.weight,
      price: t.price,
      createdAt: t.createdAt,
      vendorName: t.vendor ? t.vendor.name : "Desconocido",
      vendorCode: t.vendor ? t.vendor.code : t.code,
      */
      const serial =
        t.ticketNumber || String(idx + 1).padStart(4, "0");
      const isPink =
        t.tier === "premium" || t.type === "premium" || t.weight === 2;
      const phone = t.buyerPhone || "---";
      const name = t.buyerName || "---";
      const code = t.code || "---";
      const vendorName = t.vendorName;
      const date = t.createdAt
        ? new Date(t.createdAt).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "---";

      return `
      <tr>
        <td><strong class="serial-tag">#${serial}</strong></td>
        <td>
          <span class="type-pill ${isPink ? "pill-pink" : "pill-blue"}">
            ${isPink ? "Rosa" : "Azul"}
          </span>
        </td>
        <td><strong>${name}</strong></td>
        <td>
          <a href="https://wa.me/51${phone}" target="_blank">
            ${phone}
          </a>
        </td>
        <td><span class="badge-code">${code == "GENERAL" ? "WEB" : code}</span></td>
        <td><span style="font-size: 0.8rem;">${String(vendorName).trim()}</span></td>
        <td class="date-txt" style="font-size: 0.6rem;">${date}</td>
        <td>
          <button type="button" class="btn-voucher-action" data-id="${t.id}" data-ticket="${serial}" data-buyer="${name}">
            Ver Voucher
          </button>
        </td>
      </tr>
    `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("receipt-modal");
  const modalImg = document.getElementById("receipt-modal-img");
  const modalTitle = document.getElementById("receipt-modal-title");
  const btnClose = document.getElementById("btn-close-receipt");

  document
    .getElementById("tickets-table-body")
    ?.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-voucher-action");
      if (!btn) return;

      const ticketId = btn.dataset.id;
      const ticketNum = btn.dataset.ticket;
      const buyerName = btn.dataset.buyer;

      modalTitle.innerText = `Voucher #${ticketNum} - ${buyerName}`;
      modalImg.src = `https://devchrisacosta.net/api/rifa-multicode/tickets/receipt/${ticketId}`;
      modal.style.display = "flex";
      modal.classList.add("open");
    });

  const closeReceiptModal = () => {
    modal.style.display = "none";
    modal.classList.remove("open");
    modalImg.src = "";
  };

  btnClose?.addEventListener("click", closeReceiptModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeReceiptModal();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  loadTickets();

  const filterInput = document.getElementById("filter-input");
  if (filterInput) {
    filterInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = cachedTickets.filter((t) => {
        const name = (t.name || t.buyerName || "").toLowerCase();
        const phone = (t.phone || t.buyerPhone || "").toLowerCase();
        const serial = (t.ticketNumber || t.number || "").toLowerCase();
        const code = (t.code || t.vendorCode || "").toLowerCase();
        return (
          name.includes(q) ||
          phone.includes(q) ||
          serial.includes(q) ||
          code.includes(q)
        );
      });
      renderTable(filtered);
    });
  }

  const btnRefresh = document.getElementById("btn-refresh");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", loadTickets);
  }
});
