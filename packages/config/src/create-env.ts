import type { z } from "zod";

/**
 * Parses `source` against `schema` and throws a readable, aggregated
 * error instead of Zod's default error shape. Meant to be called once
 * at process/app startup by each app's own `config/env.ts`.
 */
export function createEnv<Schema extends z.ZodTypeAny>(
  schema: Schema,
  source: Record<string, string | undefined> = process.env,
): z.infer<Schema> {
  const result = schema.safeParse(source);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid environment variables:\n${issues}`);
  }

  return result.data;
}
