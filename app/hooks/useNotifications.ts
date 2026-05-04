import { useQuery } from "@tanstack/react-query";
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
  });