import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, Textarea } from "@restaurant-pos/ui";
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { useState } from "react";
import { useCloseShift, useCurrentShift } from "../hooks/useShift";

interface CloseShiftDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CloseShiftDialog({ open, onOpenChange }: CloseShiftDialogProps) {
    const { data: currentShift } = useCurrentShift();
    const [closingBalance, setClosingBalance] = useState("");
    const [notes, setNotes] = useState("");
    const closeShift = useCloseShift();

    const openingBalance = Number.parseFloat(currentShift?.openingBalance ?? "0");
    const cashSales = Number.parseFloat(currentShift?.cashSalesSoFar ?? "0");
    const expectedBalance = openingBalance + cashSales;
    const closingBalanceNum = Number.parseFloat(closingBalance || "0");
    const variance = closingBalanceNum - expectedBalance;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        closeShift.mutate(
            { closingBalance, notes: notes || null },
            {
                onSuccess: () => {
                    setClosingBalance("");
                    setNotes("");
                    onOpenChange(false);
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Tutup Sesi Kasir</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="rounded-lg border border-black/10 bg-black/5 p-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-black/60">Kas Awal:</span>
                            <span className="font-medium">{formatCurrencyIDR(currentShift?.openingBalance ?? "0")}</span>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <span className="text-black/60">Penjualan Cash:</span>
                            <span className="font-medium">{formatCurrencyIDR(currentShift?.cashSalesSoFar ?? "0")}</span>
                        </div>
                        <div className="mt-3 flex justify-between border-t border-black/10 pt-3">
                            <span className="font-semibold">Kas Seharusnya:</span>
                            <span className="font-semibold">{formatCurrencyIDR(expectedBalance)}</span>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="closingBalance">Kas Akhir (Uang di Kasir)</Label>
                        <Input
                            id="closingBalance"
                            type="text"
                            placeholder="1750000"
                            value={closingBalance}
                            onChange={(e) => setClosingBalance(e.target.value)}
                            required
                            pattern="^\d+(\.\d{1,2})?$"
                            title="Masukkan angka valid, contoh: 1750000"
                        />
                        <p className="mt-1 text-xs text-black/60">Hitung seluruh uang tunai di kasir saat ini</p>
                    </div>

                    {closingBalance && (
                        <div
                            className={`rounded-lg border p-3 text-sm ${variance === 0
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                    : variance > 0
                                        ? "border-blue-200 bg-blue-50 text-blue-800"
                                        : "border-red-200 bg-red-50 text-red-800"
                                }`}
                        >
                            <div className="flex justify-between font-semibold">
                                <span>Selisih:</span>
                                <span>
                                    {variance === 0
                                        ? "Pas (Tidak ada selisih)"
                                        : variance > 0
                                            ? `+${formatCurrencyIDR(variance)} (Lebih)`
                                            : `${formatCurrencyIDR(variance)} (Kurang)`}
                                </span>
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="notes">Catatan (Opsional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Kelebihan dari uang kembalian yang tidak diambil pelanggan..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            maxLength={500}
                        />
                        <p className="mt-1 text-xs text-black/60">Jelaskan alasan jika ada selisih kas</p>
                    </div>

                    {closeShift.isError && (
                        <p className="text-sm text-red-600">
                            {closeShift.error instanceof Error ? closeShift.error.message : "Gagal menutup shift"}
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={closeShift.isPending || !closingBalance}>
                            {closeShift.isPending ? "Memproses..." : "Tutup Shift"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
