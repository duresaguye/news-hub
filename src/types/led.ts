export type LedUser = {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type LedAuthResponse = {
  jwt: string;
  user: LedUser;
};

