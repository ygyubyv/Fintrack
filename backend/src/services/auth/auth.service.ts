import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserService } from "../user/user.service";
import { RefreshTokenService } from "../refresh-token/refresh-token.service";
import type { SignOptions } from "jsonwebtoken";
import {
  IAuthContext,
  IVerifyEmailPayload,
  IForgotPasswordPayload,
  ILoginPayload,
  ILogoutPayload,
  IRefreshTokenClaims,
  IRefreshTokensPayload,
  IResetPasswordPayload,
  ISignupPayload,
  IGooglePayload,
} from "./types/auth.types";
import { AUTH_CONFIG } from "../../config/auth.config";
import { AppError } from "../../errors/AppError";
import crypto from "crypto";
import { EmailService } from "../email/email.service";
import { FRONTEND_URL } from "../../config/app.config";
import { PasswordResetTokenService } from "../password-reset-token/password-reset-token.service";
import { EmailVerificationTokenService } from "../email-verification-token/email-verification-token.service";
import { LastLoginService } from "../last-login/last-login.service";
import { OAuth2Client } from "google-auth-library";

const generateHashToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

const hashToken = (token: string, key: string) => {
  return crypto.createHmac("sha256", key).update(token).digest("hex");
};

const generateVerificationCode = () => {
  return crypto.randomInt(100000, 1000000);
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
  const emailService = EmailService();
  const emailVerificationTokenService = EmailVerificationTokenService();
  const passwordVerificationTokenService = PasswordResetTokenService();
  const lastLoginService = LastLoginService();

  const login = async (payload: ILoginPayload, context: IAuthContext) => {
    const user = await userService.findByEmail(payload.email);

    const passwordMatched =
      user && (await bcrypt.compare(payload.password, user.password!));

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

    refreshTokenService.create({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    lastLoginService.upsert({
      userId: user.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return {
      accessToken,
      refreshToken,
      idToken,
    };
  };

  const signup = async (payload: ISignupPayload) => {
    const user =
      (await userService.findByEmail(payload.email)) ||
      (await userService.create(payload));

    if (user.emailVerified) {
      throw new AppError("USER_EMAIL_EXISTS");
    }

    const verificationCode = generateVerificationCode();

    emailService.sendTemplateEmail(
      user.email,
      "Verify your Fintrack account",
      "VerifyEmail",
      {
        firstName: user.firstName,
        verificationCode,
      },
    );

    emailVerificationTokenService.create({
      tokenHash: hashToken(
        String(verificationCode),
        AUTH_CONFIG.verifyEmailSecret!,
      ),
      expiresAt: new Date(Date.now() + AUTH_CONFIG.verifyEmailTokenExpiresIn),
      userId: user.id,
    });
  };

  const logout = async (payload: ILogoutPayload) => {
    try {
      jwt.verify(payload.refreshToken, AUTH_CONFIG.refreshTokenSecret!);

      refreshTokenService.revoke(
        hashToken(payload.refreshToken, AUTH_CONFIG.refreshTokenSecret!),
      );
    } catch (err) {
      throw new AppError("AUTH_TOKEN_INVALID");
    }
  };

  const refreshTokens = async (payload: IRefreshTokensPayload) => {
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

      refreshTokenService.create({
        tokenHash,
        userId: user.id,
        expiresAt,
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

  const forgotPassword = async (payload: IForgotPasswordPayload) => {
    const user = await userService.findByEmail(payload.email);

    if (!user) {
      return;
    }

    const token = generateHashToken();
    const tokenHash = hashToken(token, AUTH_CONFIG.resetPasswordSecret!);

    passwordVerificationTokenService.create({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + AUTH_CONFIG.resetPasswordTokenExpiresIn),
    });

    emailService.sendTemplateEmail(
      user.email,
      "Reset Password",
      "ResetPassword",
      {
        firstName: user.firstName,
        resetLink: `${FRONTEND_URL}/auth?mode=reset&token=${token}`,
      },
    );
  };

  const resetPassword = async (payload: IResetPasswordPayload) => {
    const token = await passwordVerificationTokenService.findByResetToken(
      hashToken(payload.token, AUTH_CONFIG.resetPasswordSecret!),
    );

    if (!token) {
      return;
    }

    if (new Date(token.expiresAt).getTime() < Date.now() || token.usedAt) {
      throw new AppError("AUTH_RESET_TOKEN_INVALID");
    }

    userService.update(token.user.id, {
      password: payload.password,
    });
  };

  const verifyEmail = async (payload: IVerifyEmailPayload) => {
    const token = await emailVerificationTokenService.findByVerificationToken(
      hashToken(String(payload.code), AUTH_CONFIG.verifyEmailSecret!),
    );

    if (!token) {
      return;
    }

    if (new Date(token.expiresAt).getTime() < Date.now() || token.usedAt) {
      throw new AppError("AUTH_EMAIL_VERIFICATION_TOKEN_INVALID");
    }

    const user = await userService.update(token.userId, {
      emailVerified: true,
    });

    emailVerificationTokenService.consume(token.tokenHash);

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

    refreshTokenService.create({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      idToken,
    };
  };

  const google = async (payload: IGooglePayload, context: IAuthContext) => {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken: payload.idToken,
      audience: AUTH_CONFIG.googleClientId,
    });

    const data = ticket.getPayload();

    if (!data) {
      throw new AppError("AUTH_GOOGLE_ID_TOKEN_INVALID");
    }

    const user =
      (await userService.findByEmail(data.email!)) ||
      (await userService.create({
        email: data.email!,
        firstName: data.given_name || data.name?.split(" ")[0] || "",
        lastName:
          data.family_name || data.name?.split(" ").slice(1).join(" ") || "",
        emailVerified: data.email_verified || false,
      }));

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

    refreshTokenService.create({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    lastLoginService.upsert({
      userId: user.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return {
      accessToken,
      refreshToken,
      idToken,
    };
  };

  return {
    login,
    signup,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail,
    google,
  };
};
