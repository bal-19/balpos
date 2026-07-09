import type { ShiftStatus } from "./enums.js";

export interface Shift {
  id: string;
  outletId: string;
  openedBy: string;
  openedByName: string;
  closedBy: string | null;
  closedByName: string | null;
  openingBalance: string;
  closingBalance: string | null;
  expectedBalance: string | null;
  variance: string | null;
  cashSalesSoFar: string;
  status: ShiftStatus;
  notes: string | null;
  openedAt: string;
  closedAt: string | null;
}
