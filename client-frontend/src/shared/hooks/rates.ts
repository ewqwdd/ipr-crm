import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { $api } from "../lib/$api";
import { type Rate } from "../types/Rate";
import { queryKeys } from "../types/query-keys";
import { useAtomValue } from "jotai";
import { modalTypeAtom } from "@/atoms/modalAtom";

export const useGetAssignedRates = () => {
  const modalType = useAtomValue(modalTypeAtom);

  return useQuery<Rate[], Error>({
    queryKey: [queryKeys.assignedRates],
    queryFn: async () => {
      const { data } = await $api.get<Rate[]>("/rate360/assigned-rates");
      return data;
    },
    staleTime: 1000 * 60 * 15,
    enabled: !modalType,
    subscribed: !modalType,
  });
};

export const useGetSelfRates = () => {
  const modalType = useAtomValue(modalTypeAtom);

  return useQuery<Rate[], Error>({
    queryKey: [queryKeys.selfRates],
    queryFn: async () => {
      const { data } = await $api.get<Rate[]>("/rate360/self-rates");
      return data;
    },
    staleTime: 1000 * 60 * 15,
    enabled: !modalType,
    subscribed: !modalType,
  });
};

export const useGetConfirmRates = () => {
  const modalType = useAtomValue(modalTypeAtom);

  return useQuery<Rate[], Error>({
    queryKey: [queryKeys.confirmRates],
    queryFn: async () => {
      const { data } = await $api.get<Rate[]>("/rate360/confirm-by-user");
      return data;
    },
    enabled: !modalType,
    subscribed: !modalType,
    staleTime: 1000 * 60 * 15,
  });
};

export const useGetConfirmCuratorRates = () => {
  const modalType = useAtomValue(modalTypeAtom);

  return useQuery<Rate[], Error>({
    queryKey: [queryKeys.confirmCuratorRates],
    queryFn: async () => {
      const { data } = await $api.get<Rate[]>("/rate360/confirm-by-curator");
      return data;
    },
    staleTime: 1000 * 60 * 15,
    enabled: !modalType,
    subscribed: !modalType,
  });
};

interface EvaluateUserDto {
  userId: number;
  username: string;
}
interface ConfirmRateDto {
  rateId: number;
  evaluateCurators: EvaluateUserDto[];
  evaluateSubbordinate: EvaluateUserDto[];
  evaluateTeam: EvaluateUserDto[];
  comment?: string;
}

export const useConfirmRateByUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ConfirmRateDto>({
    mutationFn: async (data) => {
      await $api.post("/rate360/confirm-by-user", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.confirmRates],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.ratesMe],
      });
    },
  });
};

export const useConfirmRateByCuratorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ConfirmRateDto>({
    mutationFn: async (data) => {
      await $api.post("/rate360/confirm-by-user", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.confirmRates],
      });
    },
  });
};

export const useGetRatesMe = () =>
  useQuery<{ data: Rate[]; total: number }, Error>({
    queryFn: async () => {
      const { data } = await $api.get<{ data: Rate[]; total: number }>(
        "/rate360/me",
        {
          params: {
            limit: 999,
          },
        },
      );
      return data;
    },
    queryKey: [queryKeys.ratesMe],
  });

export const useGetReport = (id?: string) =>
  useQuery<Rate, Error>({
    queryFn: async () => {
      const { data } = await $api.get<Rate>(`/rate360/${id}/report`);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
    queryKey: [queryKeys.report],
  });
