export interface ICreateRefreshToken {
  tokenHash: string;
  userId: number;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}
