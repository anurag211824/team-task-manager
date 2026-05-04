import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import {
  ProjectMembersListResponse,
  AddProjectMemberRequest,
  UpdateProjectMemberRequest,
} from "@/types";

export const useProjectMembers = (projectId: string) =>
  useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const res =
        await apiClient.get<ProjectMembersListResponse>(
          `/projects/${projectId}/members`
        );
      return res.data.data;
    },
    enabled: !!projectId,
  });

export const useAddMember = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddProjectMemberRequest) =>
      apiClient.post(`/projects/${projectId}/members`, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["members", projectId] }),
  });
};

export const useUpdateMember = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: string;
      data: UpdateProjectMemberRequest;
    }) =>
      apiClient.put(
        `/projects/${projectId}/members/${memberId}`,
        data
      ),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["members", projectId] }),
  });
};

export const useDeleteMember = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      apiClient.delete(
        `/projects/${projectId}/members/${memberId}`
      ),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["members", projectId] }),
  });
};