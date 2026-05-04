import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import {
  ProjectResponse,
  ProjectDetailResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectQueryParams,
  ApiPaginatedResponse,
  ApiResponse,
} from "@/types";

export const useProjects = (params?: ProjectQueryParams) =>
  useInfiniteQuery({
    queryKey: ["projects", params],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res =
        await apiClient.get<ApiPaginatedResponse<ProjectResponse>>(
          "/projects",
          { params: { ...params, page: pageParam } }
        );
      return res.data.data!;
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined,
  });

export const useProject = (id: string) =>
  useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const res =
        await apiClient.get<ApiResponse<ProjectDetailResponse>>(
          `/projects/${id}`
        );
      return res.data.data!;
    },
    enabled: !!id,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      apiClient.post("/projects", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProjectRequest;
    }) => apiClient.put(`/projects/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project", id] });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
};