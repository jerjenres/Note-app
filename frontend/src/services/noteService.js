const API_BASE_URL = 'http://localhost:8080/api/notes';

class ApiError extends Error {
	constructor(message, status) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

const parseResponseBody = async (response) => {
	const contentType = response.headers.get('content-type') || '';
	const isJson = contentType.includes('application/json');
	const body = isJson ? await response.json() : await response.text();
	return body;
};

const handleResponse = async (response) => {
	const body = await parseResponseBody(response);
	if (!response.ok) {
		const message = typeof body === 'string' && body
			? body
			: body?.message || 'Request failed';
		throw new ApiError(message, response.status);
	}
	return body;
};

const noteService = {
	async getNotes() {
		const response = await fetch(API_BASE_URL, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			},
			credentials: 'include'
		});

		try {
			return await handleResponse(response);
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				error.message = 'Your session has expired. Please sign in again.';
			}
			throw error;
		}
	},

	async createNote(note) {
		const response = await fetch(API_BASE_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(note)
		});

		try {
			return await handleResponse(response);
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				error.message = 'Your session has expired. Please sign in again.';
			}
			throw error;
		}
	},

	async getNote(noteId) {
		const response = await fetch(`${API_BASE_URL}/${noteId}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			},
			credentials: 'include'
		});

		try {
			return await handleResponse(response);
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				error.message = 'Your session has expired. Please sign in again.';
			}
			throw error;
		}
	},

	async updateNote(noteId, note) {
		const response = await fetch(`${API_BASE_URL}/${noteId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(note)
		});

		try {
			return await handleResponse(response);
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				error.message = 'Your session has expired. Please sign in again.';
			}
			throw error;
		}
	},

	async deleteNote(noteId) {
		const response = await fetch(`${API_BASE_URL}/${noteId}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json'
			},
			credentials: 'include'
		});

		try {
			await handleResponse(response);
			return true;
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				error.message = 'Your session has expired. Please sign in again.';
			}
			throw error;
		}
	}
};

export { ApiError };
export default noteService;
