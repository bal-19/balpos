import { AuthLayout } from "../../../layouts/AuthLayout";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
