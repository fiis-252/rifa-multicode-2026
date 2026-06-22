import { apiClient } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
	const reqForm = document.getElementById('form-request-otp');
	const verifyForm = document.getElementById('form-verify-otp');
	let userIdentifier = '';

	if (reqForm) {
		reqForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			userIdentifier = document.getElementById('identifier').value.trim();

			try {
				const res = await apiClient.auth.sendOtp(userIdentifier);
				if (res && res.success) {
					reqForm.style.display = 'none';
					verifyForm.style.display = 'block';
				} else {
					alert(
						'Error al enviar el OTP. Verifique que sus datos estén en el padrón o conversar con su delegado de código',
					);
				}
			} catch (error) {
				console.error('[auth error]', error);
				alert('Fallo de conexión al solicitar OTP, conversar con su delegado de codigo');
			}
		});
	}

	if (verifyForm) {
		verifyForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const otpCode = document.getElementById('otp').value.trim();

			try {
				const res = await apiClient.auth.verifyOtp(userIdentifier, otpCode);
				if (res && res.token) {
					sessionStorage.setItem('vendor_token', res.token);
					sessionStorage.setItem('vendor_code', res.code);
					window.location.replace('/dashboard');
				} else {
					alert('Código incorrecto o expirado.');
				}
			} catch (error) {
				console.error('[auth error]', error);
				alert('Fallo de conexión al verificar el OTP.');
			}
		});
	}
});
