export interface ICreatePasswordResetToken {
  tokenHash: string;
  userId: number;
  expiresAt: Date;
  usedAt?: Date;
}
