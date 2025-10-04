export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

if (!BACKEND_URL || BACKEND_URL.length === 0) {
    throw new Error("VITE_BACKEND_URL environment variable is not set");
}

export async function api(endpoint, options = {}) {
    const url = `${BACKEND_URL}${endpoint}`;
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    return response.json();
}
