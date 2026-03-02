export type TLastLoginResponseDto = {
  id: number;
  userAgent?: string;
  ipAddress?: string;
  lastLoginAt: Date;
};
