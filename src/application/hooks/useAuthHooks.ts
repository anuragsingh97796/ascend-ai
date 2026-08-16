import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/infrastructure/context/AuthContext";

export function useLoginMutation() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: async ({ email, password }: Record<string, string>) => {
      await signIn(email, password);
    },
  });
}

export function useRegisterMutation() {
  const { signUp } = useAuth();

  return useMutation({
    mutationFn: async ({ name, email, password }: Record<string, string>) => {
      await signUp(name, email, password);
    },
  });
}
