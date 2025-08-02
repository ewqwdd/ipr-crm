import { useQuery } from "@tanstack/react-query";
import { $api } from "../lib/$api";
import { queryKeys } from "../types/query-keys";
import { type User } from "../types/User";

export const useGetUsers = () =>
  useQuery<{ users: User[]; count: number }, Error>({
    queryKey: [queryKeys],
    queryFn: () =>
      $api
        .get<{ users: User[]; count: number }>("users")
        .then((res) => res.data),
    staleTime: 1000 * 60 * 15,
  });
