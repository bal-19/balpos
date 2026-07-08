import type { JwtAccessPayload } from "../../modules/auth/types/auth.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtAccessPayload;
    }
  }
}

export {};
