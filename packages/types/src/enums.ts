export const ORDER_TYPES = ["DINE_IN", "TAKE_AWAY", "ORDER_ONLINE"] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

export const ORDER_STATUSES = ["OPEN", "COMPLETED", "CANCELLED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["CASH", "QRIS", "DEBIT_CREDIT", "E_WALLET"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const KITCHEN_ITEM_STATUSES = ["NEW", "PREPARING", "READY"] as const;
export type KitchenItemStatus = (typeof KITCHEN_ITEM_STATUSES)[number];

export const STOCK_MOVEMENT_TYPES = ["IN", "OUT", "ADJUSTMENT"] as const;
export type StockMovementType = (typeof STOCK_MOVEMENT_TYPES)[number];

export const PURCHASE_ORDER_STATUSES = ["DRAFT", "ORDERED", "RECEIVED", "CANCELLED"] as const;
export type PurchaseOrderStatus = (typeof PURCHASE_ORDER_STATUSES)[number];

export const PROMOTION_TYPES = ["VOUCHER", "DISCOUNT", "HAPPY_HOUR", "BUY_X_GET_Y"] as const;
export type PromotionType = (typeof PROMOTION_TYPES)[number];

export const DISCOUNT_TYPES = ["PERCENTAGE", "FIXED_AMOUNT"] as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[number];

export const RESERVATION_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SEATED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const TABLE_STATUSES = ["AVAILABLE", "OCCUPIED", "RESERVED"] as const;
export type TableStatus = (typeof TABLE_STATUSES)[number];

export const POINT_HISTORY_TYPES = ["EARN", "REDEEM", "ADJUSTMENT"] as const;
export type PointHistoryType = (typeof POINT_HISTORY_TYPES)[number];

export const REPORT_TYPES = ["SALES_SUMMARY", "ITEMS_PERFORMANCE", "TRANSACTIONS"] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

export const REPORT_FILTERS = ["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"] as const;
export type ReportFilter = (typeof REPORT_FILTERS)[number];

export const EXPORT_FILE_TYPES = ["PDF", "EXCEL"] as const;
export type ExportFileType = (typeof EXPORT_FILE_TYPES)[number];

export const EXPORT_JOB_STATUSES = ["PENDING", "PROCESSING", "COMPLETED", "FAILED"] as const;
export type ExportJobStatus = (typeof EXPORT_JOB_STATUSES)[number];

export const AI_INSIGHT_TYPES = [
  "BEST_SELLING_MENU",
  "BUSIEST_HOURS",
  "RESTOCK_PREDICTION",
  "DECLINING_PRODUCTS",
  "SALES_SUMMARY",
  "BUSINESS_IMPROVEMENT",
] as const;
export type AiInsightType = (typeof AI_INSIGHT_TYPES)[number];

export const AI_INSIGHT_SOURCES = ["GEMINI", "LOCAL"] as const;
export type AiInsightSource = (typeof AI_INSIGHT_SOURCES)[number];

export const SHIFT_STATUSES = ["OPEN", "CLOSED"] as const;
export type ShiftStatus = (typeof SHIFT_STATUSES)[number];
