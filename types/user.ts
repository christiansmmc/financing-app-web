export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
}

export interface RegisterRequest {
    email: string
    password: string
}