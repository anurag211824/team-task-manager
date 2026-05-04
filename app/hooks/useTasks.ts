import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import {
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskQueryParams,
  ApiPaginatedResponse,
  TaskDetailApiResponse,
} from "@/types";

export const useTasks = (params: TaskQueryParams) =>
  useInfiniteQuery({
    queryKey: ["tasks", params],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res =
        await apiClient.get<ApiPaginatedResponse<TaskResponse>>(
          "/tasks",
          { params: { ...params, page: pageParam } }
        );
      return res.data.data!;
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined,
  });

export const useTask = (id: string) =>
  useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res =
        await apiClient.get<TaskDetailApiResponse>(
          `/tasks/${id}`
        );
      return res.data.data;
    },
    enabled: !!id,
  });

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskRequest) =>
      apiClient.post("/tasks", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTaskRequest;
    }) => apiClient.put(`/tasks/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task", id] });
    },
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
};