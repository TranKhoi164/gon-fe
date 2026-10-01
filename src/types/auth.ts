export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  xp: number;
  level: number;
  streakCount: number;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

export interface TokenPairResponse {
  accessToken: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LogoutResponse {
  success: boolean;
}
