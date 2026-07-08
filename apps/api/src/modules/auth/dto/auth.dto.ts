import type { AuthUser } from "@restaurant-pos/types";

export interface LoginResponseDto {
  user: AuthUser;
  accessToken: string;
}

export type MeResponseDto = AuthUser;
