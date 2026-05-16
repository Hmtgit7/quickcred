import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { ROUTES } from "@/constants/routes";

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Always clear local state even if API call fails
      clearAuth();
      queryClient.clear();
      router.replace(ROUTES.LOGIN);
    },
  });
}
