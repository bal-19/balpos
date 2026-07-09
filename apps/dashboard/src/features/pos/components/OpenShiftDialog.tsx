import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label } from "@restaurant-pos/ui";
import { useState } from "react";
import { useOpenShift } from "../hooks/useShift";

interface OpenShiftDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OpenShiftDialog({ open, onOpenChange }: OpenShiftDialogProps) {
    const [openingBalance, setOpeningBalance] = useState("");
    const openShift = useOpenShift();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        openShift.mutate(
            { openingBalance },
            {
                onSuccess: () => {
                    setOpeningBalance("");
                    onOpenChange(false);
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Buka Sesi Kasir</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="openingBalance">Kas Awal</Label>
                        <Input
                            id="openingBalance"
                            type="text"
                            placeholder="500000"
                            value={openingBalance}
                            onChange={(e) => setOpeningBalance(e.target.value)}
                            required
                            pattern="^\d+(\.\d{1,2})?$"
                            title="Masukkan angka valid, contoh: 500000 atau 500000.50"
                        />
                        <p className="mt-1 text-xs text-black/60">Masukkan jumlah uang tunai di kasir saat memulai shift</p>
                    </div>

                    {openShift.isError && (
                        <p className="text-sm text-red-600">
                            {openShift.error instanceof Error ? openShift.error.message : "Gagal membuka shift"}
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={openShift.isPending || !openingBalance}>
                            {openShift.isPending ? "Memproses..." : "Buka Shift"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
