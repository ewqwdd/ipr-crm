import { useQuery } from "@tanstack/react-query";
import { type Task, type Ipr } from "../types/Ipr";
import { queryKeys } from "../types/query-keys";
import { $api } from "../lib/$api";

export const useGetIprMe = () =>
  useQuery<Ipr[], Error>({
    queryKey: [queryKeys.iprMe],
    queryFn: async () => {
      const { data } = await $api.get<{ data: Ipr[] }>("/ipr/user");
      return data.data;
    },
    staleTime: 1000 * 60 * 15,
  });

export const useGetIprById = (id?: string) =>
  useQuery<Ipr, Error>({
    queryKey: [queryKeys.iprMe, id],
    queryFn: async () => {
      const { data } = await $api.get<Ipr>(`/ipr/user/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
  });

export const useGetUserBoard = () =>
  useQuery<Task[], Error>({
    queryKey: [queryKeys.userBoard],
    queryFn: async () => {
      const { data } = await $api.get<Task[]>("/ipr/task/board");
      return data;
    },
  });
