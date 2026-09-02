import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DRAFT_QUERY_KEY } from "../config/query-key";

export const deleteDraft = async (id: string) => {
  const response = await apiClient.delete(`/drafts/${id}`);

  return response.data;
};

type UseDeleteDraftOptions = {
  mutationConfig?: MutationConfig<typeof deleteDraft>;
};

export const useDeleteDraft = ({
  mutationConfig,
}: UseDeleteDraftOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDraft,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: DRAFT_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};