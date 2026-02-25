export interface ICreateUser {
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  emailVerified?: boolean;
}

export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
  emailVerified?: boolean;
}
