import { Button } from "@restaurant-pos/ui";
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { AlertCircle, CheckCircle, DoorOpen, DoorClosed } from "lucide-react";
import { useState } from "react";
import { useCurrentShift } from "../hooks/useShift";
import { CloseShiftDialog } from "./CloseShiftDialog";
import { OpenShiftDialog } from "./OpenShiftDialog";

export function ShiftStatusBar() {
    const { data: shift, isLoading } = useCurrentShift();
    const [openShiftDialog, setOpenShiftDialog] = useState(false);
    const [closeShiftDialog, setCloseShiftDialog] = useState(false);

    if (isLoading) {
        return (
            <div className="rounded-lg border border-black/10 bg-white p-4">
                <p className="text-sm text-black/40">Memuat status shift...</p>
            </div>
        );
    }

    if (!shift) {
        return (
            <>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-amber-600" size={20} />
                            <div>
                                <p className="text-sm font-semibold text-amber-900">Shift Belum Dibuka</p>
                                <p className="text-xs text-amber-700">Buka shift terlebih dahulu sebelum membuat order</p>
                            </div>
                        </div>
                        <Button size="sm" onClick={() => setOpenShiftDialog(true)}>
                            <DoorOpen size={16} className="mr-2" />
                            Buka Shift
                        </Button>
                    </div>
                </div>
                <OpenShiftDialog open={openShiftDialog} onOpenChange={setOpenShiftDialog} />
            </>
        );
    }

    return (
        <>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-emerald-600" size={20} />
                        <div>
                            <p className="text-sm font-semibold text-emerald-900">Shift Sedang Berjalan</p>
                            <div className="mt-1 flex gap-4 text-xs text-emerald-700">
                                <span>
                                    Kas Awal: <strong>{formatCurrencyIDR(shift.openingBalance)}</strong>
                                </span>
                                <span>
                                    Penjualan Cash: <strong>{formatCurrencyIDR(shift.cashSalesSoFar)}</strong>
                                </span>
                                <span>
                                    Kasir: <strong>{shift.openedByName}</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setCloseShiftDialog(true)}>
                        <DoorClosed size={16} className="mr-2" />
                        Tutup Shift
                    </Button>
                </div>
            </div>
            <CloseShiftDialog open={closeShiftDialog} onOpenChange={setCloseShiftDialog} />
        </>
    );
}
