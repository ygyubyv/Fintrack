import axiosInstance from "@/plugins/axios.plugin";
import type {
  IAuthResponse,
  IForgotPasswordPayload,
  ILoginPayload,
  ILogoutPayload,
  IRefreshTokensPayload,
  IResetPasswordPayload,
  ISignupPayload,
  IVerifyEmailPayload,
} from "../types";

export const AuthService = () => {
  const login = async (payload: ILoginPayload) => {
    return await axiosInstance.post<IAuthResponse>("/auth/login", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const signup = async (payload: ISignupPayload) => {
    await axiosInstance.post("/auth/signup", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const logout = async (payload: ILogoutPayload) => {
    await axiosInstance.post("/auth/logout", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const refresh = async (payload: IRefreshTokensPayload) => {
    return await axiosInstance.post<IAuthResponse>("/auth/refresh", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const forgotPassword = async (payload: IForgotPasswordPayload) => {
    return await axiosInstance.post("/auth/forgot-password", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const resetPassword = async (payload: IResetPasswordPayload) => {
    return await axiosInstance.post("/auth/reset-password", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const verifyEmail = async (payload: IVerifyEmailPayload) => {
    return await axiosInstance.post<IAuthResponse>(
      "/auth/verify-email",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
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
