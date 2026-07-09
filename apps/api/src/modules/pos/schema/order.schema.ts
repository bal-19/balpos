import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  notes: z.string().nullable().optional(),
});

export const createOrderSchema = z.object({
  orderType: z.enum(["DINE_IN", "TAKE_AWAY", "ORDER_ONLINE"]),
  tableId: z.string().min(1).nullable().optional(),
  customerId: z.string().min(1).nullable().optional(),
  customerName: z.string().nullable().optional(),
  promoCode: z.string().nullable().optional(),
  paymentMethod: z.enum(["CASH", "QRIS", "DEBIT_CREDIT", "E_WALLET"]).default("CASH"),
  items: z.array(orderItemSchema).min(1, "Order harus punya minimal 1 item"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
