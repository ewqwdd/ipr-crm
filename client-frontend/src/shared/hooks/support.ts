import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { $api } from "../lib/$api";
import { queryKeys } from "../types/query-keys";
import type { SupportTicketType } from "../types/Support";

export const useGetSupport = () =>
  useQuery<SupportTicketType[], Error>({
    queryKey: [queryKeys.support],
    queryFn: async () => {
      const { data } = await $api.get<SupportTicketType[]>("/support");
      return data;
    },
    staleTime: 1000 * 60 * 15,
  });

export const useAddSupportTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { title: string; description: string }>({
    mutationFn: async ({ title, description }) => {
      await $api.post("/support", { title, description });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.support],
      });
    },
  });
};
