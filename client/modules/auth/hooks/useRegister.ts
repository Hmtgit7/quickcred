import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { ROUTES } from "@/constants/routes";
import type { RegisterPayload } from "../types/auth.types";

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.replace(ROUTES.DASHBOARD);
    },
  });
}
