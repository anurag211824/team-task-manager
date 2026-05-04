import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  UserDashboardResponse,
  ProjectDashboardResponse,
  ApiResponse,
} from "@/types";

export const useDashboard = (projectId?: string) =>
  useQuery({
    queryKey: ["dashboard", projectId],
    queryFn: async () => {
      const res = await apiClient.get<
        ApiResponse<
          | UserDashboardResponse["data"]
          | ProjectDashboardResponse["data"]
        >
      >("/dashboard", { params: { projectId } });

      return res.data.data!;
    },
  });