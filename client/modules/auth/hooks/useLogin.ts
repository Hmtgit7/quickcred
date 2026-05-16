import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { ROLE_ROUTES, ROUTES } from "@/constants/routes";
import type { LoginPayload } from "../types/auth.types";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      const redirect = ROLE_ROUTES[data.user.role] ?? ROUTES.DASHBOARD;
      router.replace(redirect);
    },
  });
}
