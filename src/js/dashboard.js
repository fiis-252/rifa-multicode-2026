import { apiClient } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
	const vendorCode = sessionStorage.getItem('vendor_code');
	const qrContainer = document.getElementById('qr-container');
	const qrH3 = document.getElementById('qr-h3');

	if (vendorCode) {
		document.body.setAttribute('data-code', vendorCode);
	}

	const treasuryData = {
		'24-1': {
			img: './assets/qr-plin-241.png',
			name: 'Gabriel Wei',
			phone: '959260609',
		},
		'24-2': {
			img: './assets/qr-yape-242.png',
			name: 'Eduardo Acosta',
			phone: '945416248',
		},
		'25-1': {
			img: './assets/qr-yape-251.png',
			name: 'Jose Canchanya',
			phone: '921584492',
		},
		'25-2': {
			img: './assets/qr-yape-252.png',
			name: 'Christopher Acosta',
			phone: '917862194',
		},
	};

	if (qrContainer) {
		const data = treasuryData[vendorCode];
		if (data) {
			if (qrH3) qrH3.innerHTML = `${vendorCode == '24-1' ? 'Plin' : 'Yape'} ${vendorCode}`;
			qrContainer.innerHTML = `
        <div class="qr-card">
          <img src="${data.img}" alt="QR ${vendorCode == '24-1' ? 'Plin' : 'Yape'} ${vendorCode}" class="qr-image" style="border-radius: 10px;">
          <div class="qr-details">
            <h4 style="margin: 0; color: var(--color-accent); font-size: 1.2rem;">${data.name}</h4>
            <div class="yape-number-badge">
              <span style="font-weight: bold;">${data.phone}</span> 
            </div>
          </div>
        </div>
      `;
		} else {
			qrContainer.innerHTML = `<p style="color: var(--danger); font-weight: bold;">Error: Código de tesorería no identificado.</p>`;
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
