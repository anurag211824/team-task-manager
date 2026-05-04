import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  CreateCommentRequest,
  CreateCommentResponse,
} from "@/types";

export const useAddComment = (taskId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      const res =
        await apiClient.post<CreateCommentResponse>(
          `/tasks/${taskId}/comments`,
          data
        );
      return res.data.data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["task", taskId] }),
  });
};