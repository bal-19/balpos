import type { PointHistoryType } from "./enums.js";

export interface MembershipTier {
  id: string;
  outletId: string;
  name: string;
  minPoint: number;
  discountPercent: string;
}

export interface Customer {
  id: string;
  outletId: string;
  name: string;
  phone: string | null;
  email: string | null;
  membershipTierId: string | null;
  membershipTierName: string | null;
  pointBalance: number;
  createdAt: string;
}

export interface PointHistory {
  id: string;
  customerId: string;
  type: PointHistoryType;
  points: number;
  note: string | null;
  orderId: string | null;
  createdAt: string;
}
