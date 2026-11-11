import axios from 'axios'

const TOKEN_KEY = 'todo-app-token'

export const http = axios.create({
    baseURL: '/api',
    timeout: 10000,
})

http.interceptors.request.use(config => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

http.interceptors.response.use(
    response => response,
    (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY)
        }
        return Promise.reject(error)
    }
)
