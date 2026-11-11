import axios from 'axios'

export function getErrorMessage(error: unknown, fallback = '请求失败'): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data
        if (data && typeof data === 'object' && 'message' in data) {
            const message = (data as { message: unknown }).message
            if (typeof message === 'string') {
                return message
            }
            if (Array.isArray(message)) {
                return message.join(', ')
            }
        }
        return error.message
    }
    return error instanceof Error ? error.message : fallback
}
