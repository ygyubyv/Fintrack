export type AuthState = "anonymous" | "authenticated";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ISignupPayload {
  firstName: string;
  lastName: string;
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

export interface IAuthResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
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

export interface IAccessTokenClaims extends ITokenClaims {}

export interface IRefreshTokenClaims extends ITokenClaims {}
