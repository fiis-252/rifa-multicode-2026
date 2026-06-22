// 1. Temporizador del Sorteo
const targetDate = new Date('2026-07-15T18:00:00').getTime();
const timerElement = document.getElementById('countdown-timer');

function updateCountdown() {
	const now = new Date().getTime();
	const distance = targetDate - now;

	if (distance < 0) {
		if (timerElement) timerElement.innerText = '¡El sorteo ha comenzado!';
		return;
	}

	const d = Math.floor(distance / (1000 * 60 * 60 * 24));
	const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const s = Math.floor((distance % (1000 * 60)) / 1000);

	if (timerElement) {
		timerElement.innerText =
			`${String(d).padStart(2, '0')}d ` +
			`${String(h).padStart(2, '0')}h ` +
			`${String(m).padStart(2, '0')}m ` +
			`${String(s).padStart(2, '0')}s`;
	}
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 2. Enrutador Equitativo de Compradores (WhatsApp)
const buyBtn = document.getElementById('btn-buy-random');

if (buyBtn) {
	buyBtn.addEventListener('click', () => {
		// El mensaje predeterminado que aparecerá en WhatsApp
		const msg =
			'?text=Hola,%20quiero%20comprar%20un%20boleto%20para%20la%20rifa%20FIIS';

		// REEMPLAZAR ESTOS NÚMEROS: Mantener el 51 (Código de Perú) seguido de los 9 dígitos
		const treasurers = {
			'24-2': [
				`https://wa.me/51999999991${msg}`,
				`https://wa.me/51999999992${msg}`,
			],
			'25-1': [
				`https://wa.me/51999999993${msg}`,
				`https://wa.me/51999999994${msg}`,
			],
			'25-2': [
				`https://wa.me/51999999995${msg}`, // <-- Reemplaza por el tuyo / tu equipo
				`https://wa.me/51999999996${msg}`,
			],
		};

		// Extrae todas las listas y las aplana en un solo gran array (O(N) time complexity)
		const allLinks = Object.values(treasurers).flat();

		// Selecciona un número entero al azar basado en el total de tesoreros reales
		const equitableIndex = Math.floor(Math.random() * allLinks.length);

		// Descomentado y activado. ¡Redirige al cliente!
		window.location.href = allLinks[equitableIndex];
	});
}
