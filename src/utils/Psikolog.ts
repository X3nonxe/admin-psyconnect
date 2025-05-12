export interface Education {
	degree: string;
	university: string;
}

export interface Psychologist {
	id: string;
	full_name: string;
	email: string;
	license_number: string;
	specializations: string[];
	consultation_fee: number;
	education: Education[];
	description: string;
	address: string;
}

export interface PsychologistFormData {
	full_name: string;
	email: string;
	password?: string;
	license_number: string;
	specializations: string[];
	consultation_fee: number;
	education: Education[];
	description: string;
	address: string;
}

export interface PaginationState {
	page: number;
	limit: number;
}

export interface ApiResponse {
	data: Psychologist[];
	total: number;
	page: number;
	limit: number;
}
