export interface jwtPayload {
  userId: string;
  type: 'refresh' | 'access';
}
