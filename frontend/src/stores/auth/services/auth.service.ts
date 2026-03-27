import type {
  IAuthResponse,
  IForgotPasswordPayload,
  IGoogleAuthPayload,
  ILoginPayload,
  ILogoutPayload,
  IRefreshTokensPayload,
  IResetPasswordPayload,
  ISignupPayload,
  IVerifyEmailPayload,
} from "../types";
import { useApi } from "@/composables/useApi";
import { AuthApi } from "./api/auth.api";

export const AuthService = () => {
  const { $api } = useApi();
  const login = async (payload: ILoginPayload) => {
    return await $api<IAuthResponse>({
      url: AuthApi.login,
      method: "POST",
      payload,
    });
  };

  const signup = async (payload: ISignupPayload) => {
    return await $api({
      url: AuthApi.signup,
      method: "POST",
      payload,
    });
  };

  const logout = async (payload: ILogoutPayload) => {
    return await $api({
      url: AuthApi.logout,
      method: "POST",
      payload,
    });
  };

  const refresh = async (payload: IRefreshTokensPayload) => {
    return await $api<IAuthResponse>({
      url: AuthApi.refresh,
      method: "POST",
      payload,
    });
  };

  const forgotPassword = async (payload: IForgotPasswordPayload) => {
    return await $api({
      url: AuthApi.forgotPassword,
      method: "POST",
      payload,
    });
  };

  const resetPassword = async (payload: IResetPasswordPayload) => {
    return await $api({
      url: AuthApi.resetPassword,
      method: "POST",
      payload,
    });
  };

  const verifyEmail = async (payload: IVerifyEmailPayload) => {
    return await $api<IAuthResponse>({
      url: AuthApi.verifyEmail,
      method: "POST",
      payload,
    });
  };

  const googleAuth = async (payload: IGoogleAuthPayload) => {
    return await $api<IAuthResponse>({
      url: AuthApi.google,
      method: "POST",
      payload,
    });
  };

  return {
    login,
    signup,
    logout,
    refresh,
    forgotPassword,
    resetPassword,
    verifyEmail,
    googleAuth,
  };
};
