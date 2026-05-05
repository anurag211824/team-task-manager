import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { NotificationsListResponse } from "@/types";

export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res =
        await apiClient.get<NotificationsListResponse>(
          "/notifications"
        );
      return res.data;
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

export const useMarkNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { ids?: string[]; all?: boolean }) =>
      apiClient.put("/notifications", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
