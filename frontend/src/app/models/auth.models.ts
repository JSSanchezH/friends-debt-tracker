// request para login
export interface LoginRequest {
  email: string;
  password: string;
}

// respuesta del backend
export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
}

export interface AuthField {
  name: string; // formControlName
  placeholder: string;
  type?: string; // tipo de input, default: text
}
