import type { TLastLoginResponseDto } from "../../last-login/types/last-login.types";

export type TUserResponseDto = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: TLastLoginResponseDto | null;
};
