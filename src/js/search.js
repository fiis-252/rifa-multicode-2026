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
    statusEl.textContent = "consultando...";

    try {
      const data = await apiClient.request(`/tickets/search/${rawPhone}`);

      if (data && data.success && data.tickets && data.tickets.length > 0) {
        statusEl.style.display = "none";
        resultsCount.textContent = `${data.tickets.length} Ticket${data.tickets.length === 1 ? "" : "s"} Registrado${data.tickets.length === 1 ? "" : "s"}`;

        data.tickets.forEach((ticket, idx) => {
          const ticketNumber =
            ticket.ticketNumber ||
            ticket.number ||
            String(idx + 1).padStart(4, "0");
          const isPremium = ticket.tier === "premium" || ticket.weight === 2;

          const ticketCard = document.createElement("div");
          ticketCard.className = "rendered-ticket-card";

          ticketCard.innerHTML = `
            <div class="rendered-ticket-img-box">
              ${
                ticket.image
                  ? `
                <img src="${ticket.image}" alt="Ticket ${ticketNumber}" class="rendered-ticket-img" />
              `
                  : `
                <div class="ticket-img-fallback">Ticket #${ticketNumber} (generando vista previa...)</div>
              `
              }
            </div>

            <div class="rendered-ticket-toolbar">
              <div class="ticket-meta-info">
                <span class="ticket-num-badge">#${ticketNumber}</span>
                <span class="type-pill ${isPremium ? "pill-pink" : "pill-blue"}">
                  ${isPremium ? "★ Doble Chance" : "Estándar"}
                </span>
              </div>

              ${
                ticket.image
                  ? `
                <a href="${ticket.image}" download="${ticketNumber}.png" class="btn btn-download-action">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Descargar Imagen
                </a>
              `
                  : ""
              }
            </div>
          `;

          ticketsGrid.appendChild(ticketCard);
        });

        resultsContainer.style.display = "block";
      } else {
        statusEl.className = "search-status empty";
        statusEl.textContent =
          "No encontramos tickets asociados a este numero celular.";
      }
    } catch (err) {
      console.error(err);
      statusEl.className = "search-status error";
      statusEl.textContent =
        "Fallo de conexion al buscar los tickets. Intentalo nuevamente.";
    } finally {
      btnSearch.disabled = false;
      btnSearch.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        Consultar Mis Tickets
      `;
    }
  });
});
