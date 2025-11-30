import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

export interface RegisterData {
  fullName: string
  email: string
  password: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface PhoneLoginData {
  phone: string
}

export interface VerifyOTPData {
  phone: string
  otp: string
}

export interface AuthResponse {
  token: string
  email: string
  fullName: string
  profilePicture?: string
  expiresAt: string
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data)
    return response.data
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data)
    return response.data
  },

  sendOTP: async (data: PhoneLoginData): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API_BASE_URL}/auth/phone/send-otp`, data)
    return response.data
  },

  verifyOTP: async (data: VerifyOTPData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/phone/verify-otp`, data)
    return response.data
  },
}
