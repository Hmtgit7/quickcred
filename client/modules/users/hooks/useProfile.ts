import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "../services/userService";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { UpdateProfilePayload } from "@/types/user.types";
import { getAxiosErrorMessage, getBREFailedRules } from "@/lib/axios/errorUtils";
import { useState } from "react";

export function useProfile() {
    const setUser = useAuthStore((s) => s.setUser);
    // BRE server-side failed rules — shown alongside client-side checks
    const [serverBREErrors, setServerBREErrors] = useState<string[]>([]);

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
            setServerBREErrors([]);
            setUser(updatedUser);
            queryClient.setQueryData(QUERY_KEYS.AUTH.ME, updatedUser);
            toast.success("Profile updated successfully");
        },
        onError: (error) => {
            // Extract BRE rule messages for inline display
            const rules = getBREFailedRules(error);
            if (rules.length > 0) {
                setServerBREErrors(rules.map((r) => r.message));
                toast.error("Eligibility check failed. See details below.");
            } else {
                setServerBREErrors([]);
                toast.error(getAxiosErrorMessage(error, "Failed to update profile"));
            }
        },
    });

    return {
        user: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
        updateProfile: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        serverBREErrors, // ← new: pass to form for display
    };
}