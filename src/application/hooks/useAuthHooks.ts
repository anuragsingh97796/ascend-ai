import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signIn,
  signUp,
  logout,
  getCurrentUser,
} from "@/application/services/authService";
import { useRouter } from "next/navigation";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: Record<string, string>) => {
      return await signIn(email, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, password }: Record<string, string>) => {
      return await signUp(name, email, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/auth/login");
    },
  });
}
