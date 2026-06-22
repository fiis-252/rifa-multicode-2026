import { apiClient } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
	const vendorCode = sessionStorage.getItem('vendor_code');
	const qrContainer = document.getElementById('qr-container');

	const qrMapping = {
		'24-1': '/assets/qr-yape/241.png',
		'24-2': '/assets/qr-yape-242.png',
		'25-1': '/assets/qr-yape-251.png',
		'25-2': '/assets/qr-yape-252.png',
	};

	if (qrContainer) {
		if (qrMapping[vendorCode]) {
			qrContainer.innerHTML = `<img src="${qrMapping[vendorCode]}" alt="QR Yape ${vendorCode}" width="200" style="border-radius: var(--radius-md); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`;
		} else {
			qrContainer.innerHTML = `<p style="color: red; font-weight: bold;">Error: Código de tesorería no identificado o sesión corrupta.</p>`;
		}
	}

	const sellForm = document.getElementById('form-sell-ticket');
	if (sellForm) {
		sellForm.addEventListener('submit', async (e) => {
			e.preventDefault();

			const ticketPayload = {
				name: document.getElementById('buyer-name').value.trim(),
				phone: document.getElementById('buyer-phone').value.trim(),
				code: vendorCode,
			};

			try {
				const result = await apiClient.tickets.create(ticketPayload);
				if (result && result.success) {
					alert(
						`ticker #${result.ticketNumber} registrado correctamente.`,
					);
					sellForm.reset();
				} else {
					alert('Error al registrar la transacción');
				}
			} catch (error) {
				console.error('[ticket error]', error);
				alert(
					'Fallo crítico al conectar con el servidor. Verifica tu conexión.',
				);
			}
		});
	}

	const logoutBtn = document.getElementById('btn-logout');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', () => {
			sessionStorage.clear();
			window.location.replace('/login');
		});
	}
});
