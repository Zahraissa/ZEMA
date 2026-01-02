import { useTrackingBillQueryHook } from "@/hooks/useBillingQueryHook";
import { TServiceResponse } from "@/type/TServiceResponse";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import TrackingDetails from "./TrackingDetails";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { log } from "console";
import { Button } from "@/components/ui/button";
import ToastNotification from "./ToastNotification";
type formData = {
    trackNumber: string
}
const OrderTrack = () => {
    const formSchema = z.object({
        trackNumber: z.string().min(3, "Tracking number must be at least 3 characters"),
    });
    const { reset, handleSubmit, control, formState: { errors, isSubmitting }, } = useForm<formData>({
        defaultValues: {
            trackNumber: ''
        },
        resolver: zodResolver(formSchema)
    });
    const [toast, setToast] = useState({
        isVisible: false,
        message: "",
        type: "success" as "success" | "error" | "info"
    });
    const [trackNumber, setTrackNumber] = useState<string>('');
    const [showTrackingPanel, setShowTrackingPanel] = useState(false);
    const onSubmit = (value: formData) => {
        console.log(value);
        setTrackNumber(value.trackNumber);
        setShowTrackingPanel(true)
        reset();
    }
    useEffect(() => {
        if (trackNumber === '') {
            setShowTrackingPanel(false);
        }
        console.log(trackNumber);

    }, [trackNumber]);

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-normal text-gray-900 mb-2">Track Your Application</h3>
                <p className="text-gray-600 text-sm mb-4">Use your control number or Tracking number to check status.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="relative text-center text-gray-500 text-xs">or</div>
                    <div>
                        <label htmlFor="trackNumber" className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                        <Controller
                            name="trackNumber"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        id="trackNumber"
                                        name="trackNumber"
                                        type="text"
                                        placeholder="e.g. TR2025000123"
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <span className="text-red-500 text-sm mt-2">{errors.trackNumber?.message}</span>
                                </>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-white transition-colors hover:bg-black animate-pulse"
                    >
                        Check Status
                    </Button>
                </form>
            </div>
            {showTrackingPanel && trackNumber != "" && (
                <>
                    <TrackingDetails
                        trackNumber={trackNumber}
                        onCopyControlNumber={(value) =>
                            setToast({
                                isVisible: true,
                                message: `${value} number copied to clipboard!`,
                                type: "success"
                            })
                        }
                        onClose={() => {
                            setTrackNumber('');
                            setShowTrackingPanel(false);
                        }}
                    />
                    <ToastNotification
                        message={toast.message}
                        type={toast.type}
                        isVisible={toast.isVisible}
                        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
                    />
                </>
            )}
        </>
    );
};

export default OrderTrack;