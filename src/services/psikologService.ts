import { ApiResponse, PaginationState, Psychologist, PsychologistFormData } from "../utils/Psikolog";

const API_BASE_URL = 'https://psy-backend-production.up.railway.app/api/v1';

export const fetchPsychologists = async ({ page, limit }: PaginationState): Promise<ApiResponse> => {
	const token = localStorage.getItem('token');
	if (!token) throw new Error('Tidak ada token autentikasi');

	const response = await fetch(`${API_BASE_URL}/psychologists?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Gagal mengambil data psikolog');
	}

	return await response.json();
};

export const fetchPsychologistById = async (id: string): Promise<{ data: Psychologist }> => {
	const token = localStorage.getItem('token');
	if (!token) throw new Error('Tidak ada token autentikasi');

	const response = await fetch(`${API_BASE_URL}/psychologists/${id}`, { headers: { Authorization: `Bearer ${token}` } });

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Gagal mengambil data psikolog');
	}

	return await response.json();
};

export const createPsychologist = async (data: PsychologistFormData): Promise<any> => {
	const token = localStorage.getItem('token');
	if (!token) throw new Error('Tidak ada token autentikasi');

	// Pastikan specializations selalu diformat dengan benar sebagai array string
	const formattedData = {
		...data,
		specializations: Array.isArray(data.specializations)
			? data.specializations.flatMap((item) =>
					// Jika item adalah string yang berisi koma, pisahkan menjadi item terpisah
					typeof item === 'string' && item.includes(',')
						? item
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean)
						: item
				)
			: [data.specializations].filter(Boolean),
	};

	const response = await fetch(`${API_BASE_URL}/auth/register/psychologist`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(formattedData),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Gagal menambahkan psikolog');
	}
	return await response.json();
};

export const updatePsychologist = async (id: string, data: Partial<PsychologistFormData>): Promise<any> => {
	const token = localStorage.getItem('token');
	if (!token) throw new Error('Tidak ada token autentikasi');

	// Pastikan specializations diformat dengan benar jika ada
	const formattedData = { ...data };
	if (data.specializations) {
		formattedData.specializations = Array.isArray(data.specializations)
			? data.specializations.flatMap((item) =>
					typeof item === 'string' && item.includes(',')
						? item
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean)
						: item
				)
			: [data.specializations].filter(Boolean);
	}

	const response = await fetch(`${API_BASE_URL}/psychologists/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(formattedData),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Gagal memperbarui psikolog');
	}

	return await response.json();
};

export const deletePsychologist = async (id: string): Promise<any> => {
	const token = localStorage.getItem('token');
	if (!token) throw new Error('Tidak ada token autentikasi');

	const response = await fetch(`${API_BASE_URL}/psychologists/${id}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Gagal menghapus psikolog');
	}

	return await response.json();
};