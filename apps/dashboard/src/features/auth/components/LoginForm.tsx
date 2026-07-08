import type { ApiErrorEnvelope } from "@restaurant-pos/types";
import { Button, Input } from "@restaurant-pos/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin";
import { loginFormSchema, type LoginFormValues } from "../types/auth.types";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });
  const loginMutation = useLogin();

  const errorMessage = isAxiosError<ApiErrorEnvelope>(loginMutation.error)
    ? (loginMutation.error.response?.data.message ?? "Gagal login")
    : loginMutation.error
      ? "Gagal login"
      : null;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
      <div>
        <h1 className="text-xl font-semibold text-primary">Masuk</h1>
        <p className="mt-1 text-sm text-black/50">Restaurant POS & CRM</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input id="email" type="email" placeholder="owner@balpos.local" {...register("email")} />
        {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" disabled={loginMutation.isPending} className="mt-2 w-full">
        {loginMutation.isPending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
