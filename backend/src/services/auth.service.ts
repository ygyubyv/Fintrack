import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserService } from "./user.service";
import { RefreshTokenService } from "./refresh-token.service";
import type { SignOptions } from "jsonwebtoken";
import {
  IAuthContext,
  ILoginPayload,
  ILogoutPayload,
  IRefreshTokenClaims,
  IRefreshTokensPayload,
  ISignupPayload,
} from "../types/v1";
import { AUTH_CONFIG } from "../config/auth.config";
import { AppError } from "../errors/AppError";
import crypto from "crypto";

const hashToken = (token: string, key: string) => {
  return crypto.createHmac("sha256", key).update(token).digest("hex");
};

const generateToken = (
  tokenType: "id" | "access" | "refresh",
  claims?: Record<string, string | number>,
) => {
  switch (tokenType) {
    case "id":
      return jwt.sign(
        {
          ...claims,
          tokenType,
        },
        AUTH_CONFIG.idTokenSecret!,
        {
          issuer: AUTH_CONFIG.jwtIssuer,
          audience: AUTH_CONFIG.jwtAudienceClient,
          expiresIn: AUTH_CONFIG.idTokenExpiresIn as SignOptions["expiresIn"],
        },
      );

    case "access":
      return jwt.sign(
        {
          ...claims,
          tokenType,
        },
        AUTH_CONFIG.accessTokenSecret!,
        {
          issuer: AUTH_CONFIG.jwtIssuer,
          audience: AUTH_CONFIG.jwtAudienceApi,
          expiresIn:
            AUTH_CONFIG.accessTokenExpiresIn as SignOptions["expiresIn"],
        },
      );

    case "refresh":
      return jwt.sign(
        {
          ...claims,
          tokenType,
        },
        AUTH_CONFIG.refreshTokenSecret!,
        {
          issuer: AUTH_CONFIG.jwtIssuer,
          audience: AUTH_CONFIG.jwtAudienceApi,
          expiresIn:
            AUTH_CONFIG.refreshTokenExpiresIn as SignOptions["expiresIn"],
        },
      );
  }
};

export const AuthService = () => {
  const userService = UserService();
  const refreshTokenService = RefreshTokenService();

  const login = async (payload: ILoginPayload, context: IAuthContext) => {
    const user = await userService.findByEmail(payload.email);

    const passwordMatched =
      user && (await bcrypt.compare(payload.password, user.password));

    if (!passwordMatched) {
      throw new AppError("AUTH_INVALID_CREDENTIALS");
    }

    const accessToken = generateToken("access", {
      sub: String(user.id),
    });

    const idToken = generateToken("id", {
      sub: String(user.id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const refreshToken = generateToken("refresh", {
      sub: String(user.id),
    });

    const decodedRefreshToken = jwt.decode(refreshToken) as IRefreshTokenClaims;

    const expiresAt = new Date(decodedRefreshToken.exp * 1000);
    const tokenHash = hashToken(refreshToken, AUTH_CONFIG.refreshTokenSecret!);

    await refreshTokenService.create({
      tokenHash,
      userId: user.id,
      expiresAt,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    await userService.update(user.id, {
      lastLogin: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      idToken,
    };
  };

  const signup = async (payload: ISignupPayload, context: IAuthContext) => {
    const user = await userService.create(payload);

    const accessToken = generateToken("access", {
      sub: String(user.id),
    });

    const idToken = generateToken("id", {
      sub: String(user.id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const refreshToken = generateToken("refresh", {
      sub: String(user.id),
    });

    const decodedRefreshToken = jwt.decode(refreshToken) as IRefreshTokenClaims;

    const expiresAt = new Date(decodedRefreshToken.exp * 1000);
    const tokenHash = hashToken(refreshToken, AUTH_CONFIG.refreshTokenSecret!);

    await refreshTokenService.create({
      tokenHash,
      userId: user.id,
      expiresAt,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return {
      accessToken,
      refreshToken,
      idToken,
    };
  };

  const logout = async (payload: ILogoutPayload) => {
    try {
      jwt.verify(payload.refreshToken, AUTH_CONFIG.refreshTokenSecret!);

      await refreshTokenService.revoke(
        hashToken(payload.refreshToken, AUTH_CONFIG.refreshTokenSecret!),
      );
    } catch (err) {
      throw new AppError("AUTH_TOKEN_INVALID");
    }
  };

  const refreshTokens = async (
    payload: IRefreshTokensPayload,
    context: IAuthContext,
  ) => {
    try {
      const decoded = jwt.verify(
        payload.refreshToken,
        AUTH_CONFIG.refreshTokenSecret!,
      ) as IRefreshTokenClaims;

      const userId = Number(decoded.sub);

      const user = await userService.findById(userId);
      if (!user) {
        throw new AppError("AUTH_TOKEN_INVALID");
      }

      await refreshTokenService.revoke(
        hashToken(payload.refreshToken, AUTH_CONFIG.refreshTokenSecret!),
      );

      const accessToken = generateToken("access", {
        sub: String(user.id),
      });

      const idToken = generateToken("id", {
        sub: String(user.id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      const refreshToken = generateToken("refresh", {
        sub: String(user.id),
      });

      const decodedRefreshToken = jwt.decode(
        refreshToken,
      ) as IRefreshTokenClaims;

      const expiresAt = new Date(decodedRefreshToken.exp * 1000);
      const tokenHash = hashToken(
        refreshToken,
        AUTH_CONFIG.refreshTokenSecret!,
      );

      await refreshTokenService.create({
        tokenHash,
        userId: user.id,
        expiresAt,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      });

      return {
        accessToken,
        refreshToken,
        idToken,
      };
    } catch (err) {
      throw new AppError("AUTH_TOKEN_INVALID");
    }
  };

  return {
    login,
    signup,
    logout,
    refreshTokens,
  };
};
