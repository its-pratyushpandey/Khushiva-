import axios from 'axios'
import type { ChatRequest, ChatResponse, Session } from '@/types/chat'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>('/chat', request)
    return response.data
  },

  getSessionHistory: async (sessionId: string): Promise<Session> => {
    const response = await apiClient.get<Session>(`/chat/session/${sessionId}`)
    return response.data
  },

  checkHealth: async () => {
    const response = await apiClient.get('/health')
    return response.data
  },
}

export default apiClient
