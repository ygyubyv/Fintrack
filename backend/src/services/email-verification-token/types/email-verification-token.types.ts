export interface ICreateEmailVerificationToken {
  tokenHash: string;
  userId: number;
  expiresAt: Date;
  usedAt?: Date;
}
