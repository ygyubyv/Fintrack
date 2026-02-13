export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
  lastLogin?: Date;
}
