import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { login } from "../services/auth.service";
import type { LoginFormValues } from "../types/auth.types";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (values: LoginFormValues) => login(values.email, values.password),
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      navigate({ to: "/" });
    },
  });
}
