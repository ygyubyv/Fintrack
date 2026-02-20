import axiosInstance from "@/plugins/axios.plugin";
import type {
  IAuthResponse,
  ILoginPayload,
  ILogoutPayload,
  IRefreshTokensPayload,
  ISignupPayload,
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
    return await axiosInstance.post<IAuthResponse>("/auth/signup", payload, {
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

  return {
    login,
    signup,
    logout,
    refresh,
  };
};
