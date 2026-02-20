export type AuthMode = "login" | "register";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ISignupSchema {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
