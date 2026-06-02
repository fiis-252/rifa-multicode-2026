const API_BASE_URL = 'https://devchrisacosta.net/api/rifa-multicode';
// console.warn("cambiar a https://devchrisacosta.net/api/rifa-multicode al subir a github -> hostinger")

export const apiClient = {
	async request(endpoint, options = {}) {
		const token = sessionStorage.getItem('vendor_token');

		const headers = {
			'Content-Type': 'application/json',
			...options.headers,
		};

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		const config = {
			...options,
			headers,
		};

		try {
			const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

			if (response.status === 401 || response.status === 403) {
				sessionStorage.removeItem('vendor_token');
				sessionStorage.removeItem('vendor_code');
				window.location.replace('/login');
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error(`API Error on ${endpoint}:`, error);
			throw error;
		}
	},

	auth: {
		sendOtp: (identifier) =>
			apiClient.request('/auth/otp', {
				method: 'POST',
				body: JSON.stringify({ identifier }),
			}),
		verifyOtp: (identifier, otp) =>
			apiClient.request('/auth/verify', {
				method: 'POST',
				body: JSON.stringify({ identifier, otp }),
			}),
	},

	tickets: {
		create: (ticketData) =>
			apiClient.request('/tickets', {
				method: 'POST',
				body: JSON.stringify(ticketData),
			}),
		getStats: () => apiClient.request('/tickets/stats'),
	},
};
