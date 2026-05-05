import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  UserDashboardResponse,
  ProjectDashboardResponse,
  ApiResponse,
} from "@/types";

export const useDashboard = (projectId?: string) => {
  const projectQuery = useQuery<ProjectDashboardResponse["data"]>({
    queryKey: ["dashboard", projectId],
    queryFn: async () => {
      const res = await apiClient.get<
        ApiResponse<ProjectDashboardResponse["data"]>
      >("/dashboard", { params: { projectId } });
      return res.data.data!;
    },
    enabled: !!projectId,
  });

  const userQuery = useQuery<UserDashboardResponse["data"]>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await apiClient.get<
        ApiResponse<UserDashboardResponse["data"]>
      >("/dashboard");
      return res.data.data!;
    },
    enabled: !projectId,
  });

  return projectId ? projectQuery : userQuery;
};