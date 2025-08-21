export interface AuthenticatedUser {
  userId: string;
  username: string;
}

export interface AuthenticatedRequest {
  user: AuthenticatedUser;
}
