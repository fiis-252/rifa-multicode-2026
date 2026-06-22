import { initHolograms } from './holograms.js';
const targetDate = new Date('2026-07-03T19:00:00').getTime();
const timerElement = document.getElementById('countdown-timer');
const vendorCode = sessionStorage.getItem('vendor_code');
if (vendorCode) {
	document.body.setAttribute('data-code', vendorCode);
}

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

const buyBtn = document.getElementById('btn-buy-random');

if (buyBtn) {
	buyBtn.addEventListener('click', () => {
		const msg =
			'?text=Hola,%20quiero%20comprar%20un%20boleto%20para%20la%20rifa%20FIIS%202026';

		const treasurers = {
			'24-1': [
				`https://wa.me/51959260609${msg}`,
				`https://wa.me/51987210334${msg}`,
				`https://wa.me/51912559471${msg}`,
				`https://wa.me/51939854051${msg}`,
				`https://wa.me/51955064250${msg}`,
				`https://wa.me/51954256797${msg}`,
				`https://wa.me/51960274974${msg}`,
				`https://wa.me/51949496866${msg}`,
				`https://wa.me/51929416952${msg}`,
				`https://wa.me/51949320276${msg}`,
				`https://wa.me/51983476070${msg}`,
				`https://wa.me/51967366970${msg}`,
				`https://wa.me/51927723495${msg}`,
				`https://wa.me/51936997115${msg}`,
				`https://wa.me/51994264939${msg}`,
			],
			'24-2': [`https://wa.me/51980322820${msg}`],
			'25-1': [
				`https://wa.me/51921584492${msg}`,
				`https://wa.me/51979091548${msg}`,
				`https://wa.me/51921584492${msg}`,
				`https://wa.me/51973274878${msg}`,
			],
			'25-2': [`https://wa.me/51917862194${msg}`],
		};

    const promoCodes = Object.keys(treasurers); // ['24-1', '24-2', '25-1', '25-2']
    const selectedCodeIndex = Math.floor(Math.random() * promoCodes.length);
    const winningCode = promoCodes[selectedCodeIndex];

    const cohortTreasurers = treasurers[winningCode];
    const treasurerIndex = Math.floor(Math.random() * cohortTreasurers.length);
    const finalLink = cohortTreasurers[treasurerIndex];

    console.log(`[ROUTER] Traffic routed to Promo ${winningCode}`);

    window.location.href = finalLink;
	});
}

document.addEventListener('DOMContentLoaded', initHolograms);
