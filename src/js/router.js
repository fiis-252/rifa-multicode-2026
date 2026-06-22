(function () {
	const secureRoutes = ['/vender'];
	const currentPath = window.location.pathname;
	const token = sessionStorage.getItem('vendor_token');
	const isSecure = secureRoutes.some((route) => currentPath.startsWith(route));
	if (isSecure && !token) {
		console.warn(
			'intento de acceso no autorizado, redirigiendo al execution guard...',
		);
		window.location.replace('/login');
	}
})();
