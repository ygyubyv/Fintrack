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
