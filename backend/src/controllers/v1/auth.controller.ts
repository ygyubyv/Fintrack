import { AuthService } from "../../services/auth/auth.service";
import type { Request, Response, NextFunction } from "express";

export const AuthController = () => {
  const login = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = request.body;
      const userAgent = request.get("user-agent");
      const ipAddress = request.ip;

      const tokens = await AuthService().login(
        {
          email,
          password,
        },
        {
          ipAddress,
          userAgent,
        },
      );

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

      await AuthService().signup({
        firstName,
        lastName,
        email,
        password,
      });

      return response.sendStatus(201);
    } catch (error) {
      next(error);
    }
  };

  const refresh = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { refreshToken } = request.body;

      const tokens = await AuthService().refreshTokens({
        refreshToken,
      });

      return response.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  };

  const logout = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { refreshToken } = request.body;

      await AuthService().logout({
        refreshToken,
      });

      return response.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  const forgotPassword = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = request.body;

      await AuthService().forgotPassword({
        email,
      });

      return response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  const resetPassword = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { token, password } = request.body;

      await AuthService().resetPassword({
        token,
        password,
      });

      return response.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  const verifyEmail = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { code } = request.body;

      const tokens = await AuthService().verifyEmail({
        code,
      });

      return response.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  };

  return {
    login,
    signup,
    logout,
    refresh,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };
};
