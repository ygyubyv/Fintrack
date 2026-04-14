import { jwtDecode } from "jwt-decode";
import { AuthService } from "./services/auth.service";
import type {
  AuthState,
  TAccessTokenClaims,
  IForgotPasswordPayload,
  ILoginPayload,
  IResetPasswordPayload,
  ISignupPayload,
  IVerifyEmailPayload,
} from "./types";
import type { CredentialResponse } from "vue3-google-signin";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const state = ref<AuthState>("anonymous");

  // Flag to call bootstrap only once
  const isInitialized = ref(false);
  const isLoading = ref(false);
  const tokenIsRefreshing = ref(false);

  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const idToken = ref<string | null>(null);

  const isAuthenticated = computed(() => {
    return state.value === "authenticated";
  });

  const isExpired = (accessToken: string) => {
    const decodedAccessToken = jwtDecode<TAccessTokenClaims>(accessToken);
    return decodedAccessToken.exp * 1000 < Date.now();
  };

  const setSession = (accessTk: string, refreshTk: string, idTk: string) => {
    accessToken.value = accessTk;
    refreshToken.value = refreshTk;
    idToken.value = idTk;

    localStorage.setItem("accessToken", accessTk);
    localStorage.setItem("refreshToken", refreshTk);
    localStorage.setItem("idToken", idTk);

    state.value = "authenticated";
  };

  const clearSession = () => {
    accessToken.value = null;
    refreshToken.value = null;
    idToken.value = null;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("idToken");

    state.value = "anonymous";
  };

  const login = async (payload: ILoginPayload) => {
    isLoading.value = true;

    try {
      const data = await AuthService().login(payload);

      if (!data) {
        return;
      }

      setSession(data.accessToken, data.refreshToken, data.idToken);
    } finally {
      isLoading.value = false;
    }
  };

  const signup = async (payload: ISignupPayload) => {
    isLoading.value = true;

    try {
      await AuthService().signup(payload);
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    try {
      if (refreshToken.value) {
        await AuthService().logout({
          refreshToken: refreshToken.value,
        });
      }

      clearSession();

      router.replace({
        name: "auth",
        query: {
          mode: "login",
        },
      });
    } finally {
      isLoading.value = false;
    }
  };

  const refresh = async () => {
    if (!refreshToken.value) {
      return clearSession();
    }

    try {
      isLoading.value = true;
      tokenIsRefreshing.value = true;

      const tokens = await AuthService().refresh({
        refreshToken: refreshToken.value,
      });

      setSession(tokens.accessToken, tokens.refreshToken, tokens.idToken);
    } catch (error) {
      clearSession();
      console.error(error);
    } finally {
      isLoading.value = false;
      tokenIsRefreshing.value = false;
    }
  };

  const forgotPassword = async (payload: IForgotPasswordPayload) => {
    try {
      isLoading.value = true;
      await AuthService().forgotPassword(payload);
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (payload: IResetPasswordPayload) => {
    try {
      isLoading.value = true;
      await AuthService().resetPassword(payload);
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const verifyEmail = async (payload: IVerifyEmailPayload) => {
    isLoading.value = true;

    try {
      const data = await AuthService().verifyEmail(payload);

      if (!data) {
        return;
      }

      setSession(data.accessToken, data.refreshToken, data.idToken);
    } finally {
      isLoading.value = false;
    }
  };

  const googleAuth = async (payload: CredentialResponse) => {
    isLoading.value = true;

    try {
      if (!payload.credential) {
        return;
      }

      const data = await AuthService().googleAuth({
        idToken: payload.credential,
      });

      if (!data) {
        return;
      }

      setSession(data.accessToken, data.refreshToken, data.idToken);
    } finally {
      isLoading.value = false;
    }
  };

  const bootstrap = async () => {
    if (isInitialized.value) {
      return;
    }

    const accessTk = localStorage.getItem("accessToken");
    const refreshTk = localStorage.getItem("refreshToken");
    const idTk = localStorage.getItem("idToken");

    if (!accessTk || !refreshTk || !idTk) {
      state.value = "anonymous";
      return;
    }

    accessToken.value = accessTk;
    refreshToken.value = refreshTk;
    idToken.value = idTk;

    if (isExpired(accessTk)) {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      }
    } else {
      state.value = "authenticated";
    }

    isInitialized.value = true;
  };

  return {
    state,
    accessToken,
    isAuthenticated,
    tokenIsRefreshing,
    isLoading,

    login,
    signup,
    logout,
    refresh,
    forgotPassword,
    resetPassword,
    verifyEmail,
    googleAuth,
    bootstrap,
    isExpired,
  };
});
