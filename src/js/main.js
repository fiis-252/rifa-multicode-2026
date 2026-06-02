const targetDate = new Date('2026-07-15T18:00:00').getTime(); // ajustar a la fecha de semana 14 en la que sera la rifa, aca esta puesto como 15 de julio a las 6pm
const timerElement = document.getElementById('countdown-timer');

function updateCountdown() {
	const now = new Date().getTime();
	const distance = targetDate - now;

	if (distance < 0) {
		timerElement.innerText = 'el sorteo ha comenzado'; // cambiar texto
		return;
	}

	const d = Math.floor(distance / (1000 * 60 * 60 * 24));
	const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const s = Math.floor((distance % (1000 * 60)) / 1000);

	timerElement.innerText =
		`${String(d).padStart(2, '0')}d ` +
		`${String(h).padStart(2, '0')}h ` +
		`${String(m).padStart(2, '0')}m ` +
		`${String(s).padStart(2, '0')}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

document.getElementById('btn-buy-random')?.addEventListener('click', () => { // creo que tendremos varios numeros que escoger de cada codigo
	// falta rellenar aca los numeros de telefono de cada codigo
	const treasurers = {
		'24-2': [
			'https://wa.me/51999999991?text=Hola,%20quiero%20comprar%20una%20rifa%20',
			'https://wa.me/51999999992?text=Hola,%20quiero%20comprar%20una%20rifa%20',
			'https://wa.me/51999999993?text=Hola,%20quiero%20comprar%20una%20rifa%20',
		],
		'25-1': [
			'https://wa.me/51999999991?text=Hola,%20quiero%20comprar%20una%20rifa%20',
			'https://wa.me/51999999992?text=Hola,%20quiero%20comprar%20una%20rifa%20',
			'https://wa.me/51999999993?text=Hola,%20quiero%20comprar%20una%20rifa%20',
		],
		'25-2': [
			'https://wa.me/51999999991?text=Hola,%20quiero%20comprar%20una%20rifa%20',
			'https://wa.me/51999999992?text=Hola,%20quiero%20comprar%20una%20rifa%20',
			'https://wa.me/51999999993?text=Hola,%20quiero%20comprar%20una%20rifa%20',
		],
	};

	const equitableIndex = Math.floor(Math.random() * treasurers.length);

	window.location.href = treasurers[equitableIndex];
});
