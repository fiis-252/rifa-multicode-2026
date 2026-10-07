import { apiClient } from "./api.js";

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
  const form = document.getElementById("form-search-tickets");
  const phoneInput = document.getElementById("search-phone");
  const btnSearch = document.getElementById("btn-search");
  const resultsContainer = document.getElementById("results-container");
  const ticketsGrid = document.getElementById("tickets-grid");
  const resultsCount = document.getElementById("results-count");
  const statusEl = document.getElementById("search-status");

  phoneInput.addEventListener("input", (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 9) val = val.slice(0, 9);

    if (val.length > 6) {
      e.target.value = `${val.slice(0, 3)} ${val.slice(3, 6)} ${val.slice(6)}`;
    } else if (val.length > 3) {
      e.target.value = `${val.slice(0, 3)} ${val.slice(3)}`;
    } else {
      e.target.value = val;
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const rawPhone = phoneInput.value.replace(/\s+/g, "");

    if (rawPhone.length < 9) {
      showToast("Ingresa un numero valido de 9 dígitos");
      return;
    }

    btnSearch.disabled = true;
    btnSearch.innerHTML = `Buscando...`;
    resultsContainer.style.display = "none";
    ticketsGrid.innerHTML = "";
    statusEl.style.display = "block";
    statusEl.className = "search-status loading";
    statusEl.textContent = "Consultando base de datos oficial...";

    try {
      const data = await apiClient.request(`/tickets/search/${rawPhone}`);

      if (data && data.success && data.tickets && data.tickets.length > 0) {
        statusEl.style.display = "none";
        resultsCount.textContent = `${data.tickets.length} Boleto${data.tickets.length === 1 ? "" : "s"} Registrado${data.tickets.length === 1 ? "" : "s"}`;

        data.tickets.forEach((ticket, idx) => {
          const ticketNumber =
            ticket.ticketNumber ||
            ticket.number ||
            String(idx + 1).padStart(4, "0");
          const buyerName = ticket.buyerName || ticket.name || "Participante";
          const isPremium =
            ticket.tier === "premium" ||
            ticket.type === "premium" ||
            ticket.weight === 2;

          const ticketCard = document.createElement("div");
          ticketCard.className = `digital-ticket-card ${isPremium ? "ticket-premium" : "ticket-standard"}`;

          ticketCard.innerHTML = `
            <div class="ticket-stub-col">
              <div class="stub-red-box">
                <span class="stub-hash">#</span>
                <span class="stub-number">${ticketNumber}</span>
              </div>
              <span class="stub-draw-date">Sorteo: 29 de Octubre</span>
            </div>

            <div class="ticket-perforation-divider"></div>

            <div class="ticket-body-col">
              <div class="ticket-top-row">
                <span class="ticket-tier-badge ${isPremium ? "badge-pink" : "badge-blue"}">
                  ${isPremium ? "★ PREMIO DOBLE (PESO 2)" : "ESTaNDAR (PESO 1)"}
                </span>
                <span class="ticket-transmission-tag">7:00 PM • En Vivo</span>
              </div>

              <div class="ticket-center-brand">
                <span class="ticket-brand-main">GRAN RIFA</span>
                <span class="ticket-brand-sub">MULTICoDIGO</span>
              </div>

              <div class="ticket-footer-row">
                <div class="ticket-owner-info">
                  <span class="owner-label">Comprador</span>
                  <strong class="owner-name">${buyerName}</strong>
                </div>

                ${
                  ticket.image
                    ? `
                  <a href="${ticket.image}" download="Boleto-${ticketNumber}.png" class="btn-download-ticket" title="Descargar imagen">
                    Descargar
                  </a>
                `
                    : `
                  <span class="ticket-verified-tag">✓ Boleto Valido</span>
                `
                }
              </div>
            </div>
          `;

          ticketsGrid.appendChild(ticketCard);
        });

        resultsContainer.style.display = "block";
      } else {
        statusEl.className = "search-status empty";
        statusEl.textContent =
          "No encontramos boletos asociados a este numero celular.";
      }
    } catch (err) {
      console.error(err);
      statusEl.className = "search-status error";
      statusEl.textContent =
        "Fallo de conexion al buscar los boletos. Intentalo nuevamente.";
    } finally {
      btnSearch.disabled = false;
      btnSearch.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        Consultar Mis Boletos
      `;
    }
  });
});
