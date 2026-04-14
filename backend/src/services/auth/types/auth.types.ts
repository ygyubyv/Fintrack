export interface ISignupPayload {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILogoutPayload {
  refreshToken: string;
}

export interface IRefreshTokensPayload {
  refreshToken: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  password: string;
}

export interface IVerifyEmailPayload {
  code: number;
}

export interface IGooglePayload {
  idToken: string;
}

export interface IAuthContext {
  ipAddress?: string;
  userAgent?: string;
}

export type TTokenType = "id" | "access" | "refresh";

export interface ITokenClaims {
  sub: string;
  tokenType: TTokenType;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface IIdTokenClaims extends ITokenClaims {
  email: string;
  firstName: string;
  lastName: string;
}

export type TAccessTokenClaims = ITokenClaims;

export type IRefreshTokenClaims = ITokenClaims;
