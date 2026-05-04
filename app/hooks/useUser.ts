import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import {
  UserProfileResponse,
  UpdateUserProfileRequest,
} from "@/types";

export const useUser = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res =
        await apiClient.get<UserProfileResponse>(
          `/users/${id}`
        );
      return res.data.data;
    },
    enabled: !!id,
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserProfileRequest;
    }) => apiClient.put(`/users/${id}`, data),
    onSuccess: (_, { id }) =>
      qc.invalidateQueries({ queryKey: ["user", id] }),
  });
};