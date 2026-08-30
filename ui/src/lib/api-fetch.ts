export const apiFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> => {
    const token = localStorage.getItem('auth_token');
    const headers = new Headers(init?.headers);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(input, {
        ...init,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        if (
            window.location.pathname !== '/login' &&
            window.location.pathname !== '/register'
        ) {
            window.location.href = '/login';
        }
    }

    return response;
};
