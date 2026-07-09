import { z } from "zod";

export const openShiftSchema = z.object({
    openingBalance: z
        .string()
        .regex(
            /^\d+(\.\d{1,2})?$/,
            "Kas awal harus berupa angka, contoh 500000",
        )
        .refine(
            (val) => Number.parseFloat(val) >= 0,
            "Kas awal tidak boleh negatif",
        ),
});

export const closeShiftSchema = z.object({
    closingBalance: z
        .string()
        .regex(
            /^\d+(\.\d{1,2})?$/,
            "Kas akhir harus berupa angka, contoh 750000",
        )
        .refine(
            (val) => Number.parseFloat(val) >= 0,
            "Kas akhir tidak boleh negatif",
        ),
    notes: z
        .string()
        .max(500, "Catatan maksimal 500 karakter")
        .nullable()
        .optional(),
});

export type OpenShiftInput = z.infer<typeof openShiftSchema>;
export type CloseShiftInput = z.infer<typeof closeShiftSchema>;
