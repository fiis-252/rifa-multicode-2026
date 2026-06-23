import { apiClient } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
	const vendorCode =  sessionStorage.getItem('vendor_code');
	const qrContainer = document.getElementById('qr-container');
	const qrH3 = document.getElementById('qr-h3');

	if (vendorCode) {
		document.body.setAttribute('data-code', vendorCode);
	}

	const treasuryData = {
		'24-1': {
			img: './assets/imgs/qr/qr-plin-241.png',
			name: 'Gabriel Wei',
			phone: '959260609',
		},
		'24-2': {
			img: './assets/imgs/qr/qr-yape-242.png',
			name: 'Eduardo Acosta',
			phone: '945416248',
		},
		'25-1': {
			img: './assets/imgs/qr/qr-yape-251.png',
			name: 'Jose Canchanya',
			phone: '921584492',
		},
		'25-2': {
			img: './assets/imgs/qr/qr-yape-252.png',
			name: 'Christopher Acosta',
			phone: '917862194',
		},
	};

	if (qrContainer) {
		const data = treasuryData[vendorCode];
		if (data) {
			if (qrH3)
				qrH3.innerHTML = `${vendorCode == '24-1' ? 'Plin' : 'Yape'} ${vendorCode}`;
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
		const uploadSection = document.getElementById('upload-section');
		const uploadInput = document.getElementById('upload-image');
		const captureInput = document.getElementById('capture-image');
		const previewText = document.getElementById('file-name-preview');
		const submitBtn = sellForm.querySelector('button[type="submit"]');

		let selectedFile = null;

		// FEATURE FLAG: Only enforce the upload system for '25-2'
		const requiresImage = vendorCode === '25-2';

		if (!requiresImage) {
			// Hide the section entirely and ensure the button starts unlocked
			if (uploadSection) uploadSection.style.display = 'none';
			submitBtn.disabled = false;
		} else {
			// Lock the button initially for 25-2
			submitBtn.disabled = true;
		}

		// File Selection Handler
		const handleFileSelection = (event) => {
			const file = event.target.files[0];
			if (file) {
				selectedFile = file;
				previewText.textContent = `📷 Archivo adjunto: ${file.name}`;
				previewText.style.display = 'block';
				submitBtn.disabled = false; // Unlock button

				if (event.target.id === 'upload-image') captureInput.value = '';
				else uploadInput.value = '';
			} else {
				selectedFile = null;
				previewText.style.display = 'none';
				if (requiresImage) submitBtn.disabled = true; // Relock if canceled
			}
		};

		if (uploadInput)
			uploadInput.addEventListener('change', handleFileSelection);
		if (captureInput)
			captureInput.addEventListener('change', handleFileSelection);

		// Submission Handler
		sellForm.addEventListener('submit', async (e) => {
			e.preventDefault();

			// Condition: They are 25-2 and forgot the file
			if (requiresImage && !selectedFile) {
				alert('Debes adjuntar el comprobante de pago.');
				return;
			}

			submitBtn.disabled = true;
			const originalText = submitBtn.textContent;
			submitBtn.textContent = 'Procesando Venta...';

			const formData = new FormData();
			formData.append(
				'quantity',
				document.getElementById('ticket-quantity').value,
			);
			formData.append(
				'name',
				document.getElementById('buyer-name').value.trim(),
			);
			formData.append(
				'phone',
				document.getElementById('buyer-phone').value.trim(),
			);
			formData.append('code', vendorCode);

			// Only append the receipt to the payload if it actually exists
			if (selectedFile) {
				formData.append('receipt', selectedFile);
			}

			try {
				const result = await apiClient.request('/tickets', {
					method: 'POST',
					body: formData,
				});

				if (result && result.success) {
					alert(
						`${document.getElementById('ticket-quantity').value} tickets registrados correctamente.`,
					);

					sellForm.reset();
					selectedFile = null;
					previewText.style.display = 'none';

					submitBtn.textContent = originalText;
					// Re-apply the lock logic for the next sale
					if (requiresImage) submitBtn.disabled = true;
					else submitBtn.disabled = false;
				} else {
					alert(result.error || 'Error al registrar la transacción');
					submitBtn.disabled = false;
					submitBtn.textContent = originalText;
				}
			} catch (error) {
				console.error('[ticket error]', error);
				alert('Fallo crítico al conectar con el servidor.');
				submitBtn.disabled = false;
				submitBtn.textContent = originalText;
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
