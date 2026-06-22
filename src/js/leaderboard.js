// src/js/leaderboard.js
import { apiClient } from './api.js';

async function loadStats() {
	try {
		const data = await apiClient.tickets.getStats();

		if (data) {
			const totalEl = document.getElementById('total-tickets');
			if (totalEl) totalEl.innerText = data.total;

			const codeList = document.getElementById('code-ranking');
			if (codeList && data.codes) {
				codeList.innerHTML = '';
				Object.entries(data.codes)
					.sort(([, a], [, b]) => b - a)
					.forEach(([code, amount]) => {
						const li = document.createElement('li');
						li.style.padding = '10px';
						li.style.borderBottom = '1px solid #eee';
						li.style.display = 'flex';
						li.style.justifyContent = 'space-between';

						li.innerHTML = `<strong>Codigo ${code}</strong> <span style="color: var(--color-primary); font-weight: bold;">${amount} boletos</span>`;
						codeList.appendChild(li);
					});
			}

			const vendorList = document.getElementById('top-vendors-list');
			if (vendorList && data.topVendors) {
				vendorList.innerHTML = '';

				const sortedVendors = data.topVendors
					.sort((a, b) => b.sold - a.sold)
					.slice(0, 10);

				if (sortedVendors.length === 0) {
					vendorList.innerHTML =
						'<li style="text-align: center; color: #666;">Aún no hay ventas registradas.</li>';
				} else {
					sortedVendors.forEach((vendor, index) => {
						const li = document.createElement('li');
						li.style.padding = '10px';
						li.style.borderBottom = '1px solid #eee';
						li.style.display = 'flex';
						li.style.justifyContent = 'space-between';
						li.style.alignItems = 'center';

						let medal = '';
						if (index === 0) medal = '🥇 ';
						else if (index === 1) medal = '🥈 ';
						else if (index === 2) medal = '🥉 ';
						else
							medal = `<span style="display:inline-block; width: 24px; text-align: center; color: #888;">${index + 1}.</span> `;

						// Asumimos que el backend retorna 'name', si no, hacemos un fallback seguro al 'identifier'
						const vendorName = vendor.name || vendor.identifier;

						li.innerHTML = `
              <span style="font-size: 0.95rem;">
                ${medal} <strong>${vendorName}</strong> 
                <small style="color: #666; margin-left: 5px;">(${vendor.code})</small>
              </span> 
              <span style="background: var(--color-bg); padding: 2px 8px; border-radius: var(--radius-sm); font-weight: bold; font-size: 0.9rem;">
                ${vendor.sold} tks
              </span>
            `;
						vendorList.appendChild(li);
					});
				}
			}
		}
	} catch (err) {
		console.error('[LEADERBOARD API ERROR]', err);
		const codeRanking = document.getElementById('code-ranking');
		const vendorRanking = document.getElementById('top-vendors-list');

		if (codeRanking)
			codeRanking.innerHTML =
				'<li style="color: red;">Error al conectar con la base de datos.</li>';
		if (vendorRanking)
			vendorRanking.innerHTML =
				'<li style="color: red;">Métricas de vendedores inaccesibles.</li>';
	}
}

// Inicializar el renderizado cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadStats);
