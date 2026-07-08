import type { ApiSuccessEnvelope, AuthUser } from "@restaurant-pos/types";
import { Button, Input } from "@restaurant-pos/ui";
import { type FormEvent, useState } from "react";
import { apiClient } from "../lib/api-client";
import { setAuthState } from "../lib/auth";

interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

/** Form login polos (tanpa React Hook Form/Zod) — cuma 2 field, tidak perlu ceremony. */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await apiClient.post<ApiSuccessEnvelope<LoginResponse>>("/api/auth/login", {
        email,
        password,
      });
      setAuthState({ user: data.data.user, accessToken: data.data.accessToken });
    } catch {
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-black/10 bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-xl font-semibold text-primary">Kitchen Display</h1>
          <p className="mt-1 text-sm text-black/50">Login staff dapur</p>
        </div>
        <Input
          type="email"
          placeholder="kitchen@balpos.local"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </div>
  );
}
