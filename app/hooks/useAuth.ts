import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { setCookie, removeCookie, clearAuthCookies } from "@/lib/cookies";
import {
  AuthRequest,
  SignupRequest,
  AuthResponse,
  ApiResponse,
} from "@/types";

export const useAuth = () => {
  const login = useMutation({
    mutationFn: async (data: AuthRequest) => {
      const res = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        data
      );
      return res.data.data!;
    },
    onSuccess: (data) => {
      // Store token in both localStorage (client-side access) and cookie (middleware access)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      
      // Set cookies for middleware access (7 day expiry)
      setCookie("token", data.token, 7);
      setCookie("userId", data.user.id, 7);
    },
  });

  const signup = useMutation({
    mutationFn: async (data: SignupRequest) => {
      const res = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/signup",
        data
      );
      return res.data.data!;
    },
    onSuccess: (data) => {
      // Store token in both localStorage (client-side access) and cookie (middleware access)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      
      // Set cookies for middleware access (7 day expiry)
      setCookie("token", data.token, 7);
      setCookie("userId", data.user.id, 7);
    },
  });

  const logout = () => {
    // Clear from both localStorage and cookies
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    clearAuthCookies();
  };

  return { login, signup, logout };
};