import { AuthService } from "../../services/auth.service";
import type { Request, Response, NextFunction } from "express";

export const AuthController = () => {
  const login = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = request.body;

      const tokens = await AuthService().login({
        email,
        password,
      });

      return response.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  };

  const signup = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { firstName, lastName, password, email } = request.body;

      const tokens = await AuthService().signup({
        firstName,
        lastName,
        email,
        password,
      });

      return response.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  };

  const logout = async (request: Request, response: Response) => {};

  return {
    login,
    signup,
    logout,
  };
};
