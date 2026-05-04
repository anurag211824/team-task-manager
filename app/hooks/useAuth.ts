import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

import {
  AuthRequest,
  SignupRequest,
  AuthResponse,
} from "@/types";

export const useAuth = () => {
  const loginMutation = useMutation({
    mutationFn: async (data: AuthRequest) => {
      const res = await apiClient.post("/auth/login", data);
      return res.data.data as AuthResponse;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupRequest) => {
      const res = await apiClient.post("/auth/signup", data);
      return res.data.data as AuthResponse;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
  };

  return {
    // login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // signup
    signup: signupMutation.mutate,
    signupAsync: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,

    // logout
    logout,
  };
};