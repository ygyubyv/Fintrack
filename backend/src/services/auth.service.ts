import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserService } from "./user.service";
import { ILoginPayload, ISignupPayload } from "../types/v1";
import { JWT_CONFIG } from "../config";
import { AppError } from "../errors/AppError";

export const AuthService = () => {
  const userService = UserService();

  const login = async (payload: ILoginPayload) => {
    const user = await userService.findByEmail(payload.email);

    const passwordMatched =
      user && (await bcrypt.compare(payload.password, user.password));

    if (!passwordMatched) {
      throw new AppError("AUTH_INVALID_CREDENTIALS");
    }

    const accessToken = jwt.sign(
      {
        sub: String(user.id),
        tokenType: "access",
      },
      JWT_CONFIG.accessTokenSecret!,
      {
        issuer: JWT_CONFIG.jwtIssuer,
        audience: JWT_CONFIG.jwtAudienceApi,
        expiresIn: "1h",
      },
    );

    const idToken = jwt.sign(
      {
        sub: String(user.id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tokenType: "id",
      },
      JWT_CONFIG.idTokenSecret!,
      {
        issuer: JWT_CONFIG.jwtIssuer,
        audience: JWT_CONFIG.jwtAudienceClient,
        expiresIn: "1h",
      },
    );

    await userService.update(user.id, {
      lastLogin: new Date(),
    });

    return {
      accessToken,
      idToken,
    };
  };

  const signup = async (payload: ISignupPayload) => {
    const user = await userService.create(payload);

    const accessToken = jwt.sign(
      {
        sub: String(user.id),
        tokenType: "access",
      },
      JWT_CONFIG.accessTokenSecret!,
      {
        issuer: JWT_CONFIG.jwtIssuer,
        audience: JWT_CONFIG.jwtAudienceApi,
        expiresIn: "1h",
      },
    );

    const idToken = jwt.sign(
      {
        sub: String(user.id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tokenType: "id",
      },
      JWT_CONFIG.idTokenSecret!,
      {
        issuer: JWT_CONFIG.jwtIssuer,
        audience: JWT_CONFIG.jwtAudienceClient,
        expiresIn: "1h",
      },
    );

    return {
      accessToken,
      idToken,
    };
  };

  const logout = async () => {};

  return {
    login,
    signup,
    logout,
  };
};
