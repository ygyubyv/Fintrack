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
      const userAgent = request.get("user-agent");
      const ipAddress = request.ip;

      const tokens = await AuthService().signup(
        {
          firstName,
          lastName,
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

  const refresh = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { refreshToken } = request.body;
      const userAgent = request.get("user-agent");
      const ipAddress = request.ip;

      const tokens = await AuthService().refreshTokens(
        {
          refreshToken,
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

  return {
    login,
    signup,
    logout,
    refresh,
  };
};
