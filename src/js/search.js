// src/js/search.js
import { apiClient } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
	const vendorCode = sessionStorage.getItem('vendor_code');
	if (vendorCode) {
		document.body.setAttribute('data-code', vendorCode);
	}
	const form = document.getElementById('form-search-tickets');
	const btnSearch = document.getElementById('btn-search');
	const resultsContainer = document.getElementById('results-container');
	const ticketsGrid = document.getElementById('tickets-grid');
	const resultsTitle = document.getElementById('results-title');

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const phone = document.getElementById('search-phone').value.trim();
		if (!phone) return;

		// Lock UI State
		btnSearch.disabled = true;
		btnSearch.textContent = 'Buscando y Generando...';
		resultsContainer.style.display = 'none';
		ticketsGrid.innerHTML = '';

		try {
			// Utilize the unified apiClient
			const data = await apiClient.request(`/tickets/search/${phone}`);

			if (data && data.success && data.tickets) {
				resultsTitle.textContent = `Boletos encontrados: ${data.tickets.length}`;

				data.tickets.forEach((ticket) => {
					const ticketCard = document.createElement('div');
					ticketCard.className = 'card border-gradient';
					ticketCard.style.padding = '1rem';
					ticketCard.style.display = 'flex';
					ticketCard.style.flexDirection = 'column';
					ticketCard.style.alignItems = 'center';

					ticketCard.innerHTML = `
                        <p style="font-family: var(--font-dynamic); font-size: 1.2rem; color: var(--theme-primary); margin-bottom: 0.5rem;">
                            ${ticket.ticketNumber}
                        </p>
                        <img src="${ticket.image}" alt="Boleto ${ticket.ticketNumber}" style="width: 100%; border-radius: var(--radius-sm); margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                        <a href="${ticket.image}" download="${ticket.ticketNumber}.png" style="text-decoration: none; width: 100%;">
                            <button style="background: var(--surface-color); border: 1px solid var(--theme-primary); color: var(--theme-primary);">
                                Descargar Imagen
                            </button>
                        </a>
                    `;
					ticketsGrid.appendChild(ticketCard);
				});

				resultsContainer.style.display = 'block';
			} else {
				alert(
					data.error || 'No se encontraron boletos asociados a este número.',
				);
			}
		} catch (err) {
			console.error(err);
			alert('Error de conexión con el servidor.');
		} finally {
			// Unlock UI State
			btnSearch.disabled = false;
			btnSearch.textContent = 'Buscar Mis Boletos';
		}
	});
});
