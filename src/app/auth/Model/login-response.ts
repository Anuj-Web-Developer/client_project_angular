export interface LoginResponse {
  token: string;
  tokenType: string;
  username: string;
  authorities: Authority[];
  user: User;
}

export interface Authority {
  authority: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}