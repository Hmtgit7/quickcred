import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "../services/userService";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { UpdateProfilePayload } from "@/types/user.types";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";

export function useProfile() {
    const setUser = useAuthStore((s) => s.setUser);

    const query = useQuery({
        queryKey: QUERY_KEYS.AUTH.ME,
        queryFn: userService.getMe,
        staleTime: 5 * 60 * 1000,
    });

    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: (payload: UpdateProfilePayload) =>
            userService.updateProfile(payload),
        onSuccess: (updatedUser) => {
            setUser(updatedUser);
            queryClient.setQueryData(QUERY_KEYS.AUTH.ME, updatedUser);
            toast.success("Profile updated successfully");
        },
        onError: (error) => {
            toast.error(getAxiosErrorMessage(error, "Failed to update profile"));
        },
    });

    return {
        user: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
        updateProfile: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
    };
}