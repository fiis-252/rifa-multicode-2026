import { apiClient } from '/src/js/api.js';

async function loadStats() {
	try {
		const data = await apiClient.tickets.getStats();

		// ejemplo de api
		/*
			{ 
				total: 450, 
				codes: { 
					'24-2': 150, 
					'25-1': 100, 
					'25-2': 200 
				}, 
				topVendors: { 
					identifier: 'token unico, tipo id', 
					code: '25-2', 
					sold: 10 
				}
			} 
			*/

		if (data) {
			document.getElementById('total-tickets').innerText = data.total;

			const codeList = document.getElementById('code-ranking');
			codeList.innerHTML = '';

			Object.entries(data.codes)
				.sort(([, a], [, b]) => b - a)
				.forEach(([code, amount]) => {
					const li = document.createElement('li');
					li.style.padding = '10px';
					li.style.borderBottom = '1px solid #eee';
					li.style.display = 'flex';
					li.style.justifyContent = 'space-between';

					li.innerHTML = `<strong>Código ${code}</strong> <span>${amount} boletos</span>`;
					codeList.appendChild(li);
				});
		}
	} catch (err) {
		document.getElementById('code-ranking').innerHTML =
			'<li>Error al cargar métricas.</li>';
	}
}

document.addEventListener('DOMContentLoaded', loadStats);
