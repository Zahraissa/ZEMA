import { FC, useState } from "react";
import useCopyTrackingNumber from "@/hooks/useCopyTrackingNumber";
import { TBillResponse } from "@/type/TBillResponse";
import {
    CheckCircle,
    Copy,
    Clock,
    FileText,
    Building,
    Hash,
    Download,
    X,
    User,
    CreditCard,
    DollarSign,
    Check
} from "lucide-react";
import { useBillDetailStore } from "@/store/bill-detail-store";
import { useTrackingBillQueryHook } from "@/hooks/useBillingQueryHook";
import { Button } from "@/components/ui/button";

interface FormResponseProps {
    response: TBillResponse;
    onCopyTrackingNumber: (value?: string) => void;
    onClose: () => void;
}

const FormResponse: FC<FormResponseProps> = ({ response, onCopyTrackingNumber, onClose }) => {
    const { data } = response;
    const {
        billDetail: { billType, price },
    } = useBillDetailStore();
    const { data: billData, isLoading, isError } = useTrackingBillQueryHook(data.requestCode);
    const { copy, error: copyError } = useCopyTrackingNumber();

    const handleCopyTrackingNumber = async () => {
        const res = await copy(data.requestCode);
        if (res.success) {
            onCopyTrackingNumber("Tracking");
        } else {
            console.error("Copy tracking number failed:", res.error ?? copyError);
        }
    };

    const handleCopyControlNumber = async () => {
        const res = await copy(billData ? billData.data.controlNumberDetails.controlNumber : "");
        if (res.success) {
            onCopyTrackingNumber("Control");
        } else {
            console.error("Copy control number failed:", res.error ?? copyError);
        }
    };
    const [isCopying, setCopying] = useState(false);
    const onCopyChange = () => {
        setCopying(prev => !prev);
        setTimeout(() => setCopying(false), 1000);
    };

    const [isCopyingTracking, setCopyingTracking] = useState(false);
    const onCopyTrackingChange = () => {
        setCopyingTracking(prev => !prev);
        setTimeout(() => setCopyingTracking(false), 1000);
    };
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center  p-4 pt-28 z-50  animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/80">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-blue-700 to-blue-800 text-white p-4 rounded-t-xl overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-blue-800/90 to-blue-900"></div>

                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-light mb-1 text-white">Application Submitted Successfully!</h2>
                                <p className="text-blue-200">Your request has been processed successfully</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 flex items-center justify-center group border border-white/20"
                        >
                            <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Tracking Section */}
                    <div className="relative bg-slate-50 rounded-2xl p-8 border-2 border-slate-200 overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/20 rounded-full -ml-12 -mb-12"></div>

                        <div className="relative text-center">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <CreditCard className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-light text-slate-900">Tracking Information</h3>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-4">
                                {billType == "FIXED" ? (
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-sm text-slate-600 font-medium mb-2">
                                                Tracking Number
                                            </p>
                                            <div className="flex items-center justify-center gap-3">
                                                <p className="text-2xl font-mono font-light text-blue-600">
                                                    {data.requestCode}
                                                </p>
                                                <button
                                                    onClick={handleCopyTrackingNumber}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors group hover:bg-slate-100"
                                                >
                                                    {
                                                        !isCopyingTracking ? (
                                                            <Copy onClick={onCopyTrackingChange} className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                                                        ) : (
                                                            <>
                                                                <Check
                                                                    className="w-4 h-4 text-blue-600 group-hover:text-blue-700"
                                                                    aria-hidden="true"
                                                                />
                                                            </>
                                                        )
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-200 pt-4">
                                            <p className="text-sm text-slate-600 font-medium mb-2">
                                                Control Number
                                            </p>
                                            <div className="flex items-center justify-center gap-3">
                                                <p className="text-2xl font-mono font-light text-blue-600 tracking-wider">
                                                    {isLoading ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                                            <span className="text-slate-400">Loading...</span>
                                                        </div>
                                                    ) : billData ? (
                                                        billData.data.controlNumberDetails.controlNumber
                                                    ) : (
                                                        "Not generated"
                                                    )}
                                                </p>
                                                {billData && (
                                                    <button
                                                        onClick={handleCopyControlNumber}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors group hover:bg-slate-100"
                                                    >
                                                        {!isCopying ? (
                                                            <Copy onClick={onCopyChange} className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                                                        ) : (
                                                            <>
                                                                <Check
                                                                    className="w-4 h-4 text-blue-600 group-hover:text-blue-700"
                                                                    aria-hidden="true"
                                                                />
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm text-slate-600 font-medium mb-2">
                                            Tracking Number
                                        </p>
                                        <div className="flex items-center justify-center gap-3">
                                            <p className="text-2xl font-mono font-light text-blue-600">
                                                {data.requestCode}
                                            </p>
                                            <button
                                                onClick={handleCopyTrackingNumber}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors group hover:bg-slate-100"
                                            >
                                                {!isCopyingTracking ? (
                                                    <Copy onClick={onCopyTrackingChange} className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                                                ) : (
                                                    <>
                                                        <Check
                                                            className="w-4 h-4 text-blue-600 group-hover:text-blue-700"
                                                            aria-hidden="true"
                                                        />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="text-center text-slate-600 font-medium mt-4">
                                                <strong><h3 className="text-2xl text-teal-400 font-light mb-2 animate-bounce">Control Number Pending</h3></strong>
                                            <p className="text-slate-500 ">
                                                The control number has not been generated yet. Please check back later.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {billType == "FIXED" && (<>
                                <div className="flex justify-center gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-slate-300">
                                        <Download className="w-4 h-4" />
                                        Download Invoice
                                    </button>
                                </div>
                            </>)}
                        </div>
                    </div>
                    {billType == "FIXED" && (<>
                        {/* Request Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-2xl font-light text-slate-900">Request Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Hash className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Request Number</p>
                                            <p className="font-medium text-slate-900">#{data.id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Building className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Institution</p>
                                            <p className="font-medium text-slate-900">{data.id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Service ID</p>
                                            <p className="font-medium text-slate-900">{data.serviceId}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Status</p>
                                            <p className="font-medium text-blue-600">Submitted</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Information */}
                            {price && (
                                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <DollarSign className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Estimated Amount</p>
                                            <p className="font-medium text-slate-900 text-lg">{formatCurrency(+price)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Response Message */}
                        {data.response && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Response Message
                                </h4>
                                <p className="text-slate-700 leading-relaxed">{data.response}</p>
                            </div>
                        )}

                        {/* Next Steps */}
                        <div className="bg-blue-600 text-white rounded-2xl p-6">
                            <h4 className="font-light text-xl mb-4 flex items-center space-x-2">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center border border-white/20">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <span>What happens next?</span>
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-blue-100">Your application is being reviewed by our team</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-blue-100">You will receive updates via email or SMS</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-blue-100">Use the tracking number above to check status</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-blue-100">Processing typically takes 3–5 business days</span>
                                </li>
                            </ul>
                        </div>
                    </>)}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-8 py-6 rounded-b-3xl flex justify-between items-center border-t border-slate-200">
                    <p className="text-sm text-slate-600 font-medium">
                        Keep this tracking number safe for future reference
                    </p>
                    <div className="flex gap-3">
                        <Button
                            onClick={onClose}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 border border-blue-600"
                        >
                            Close
                        </Button>
                        {billType == "FIXED" && (<>
                            <Button
                                onClick={() => console.log("Download Invoice")}
                                className="bg-white text-blue-600 hover:bg-slate-50 border border-slate-300 px-6 py-2 rounded-xl font-medium transition-all duration-300"
                            >
                                Download Invoice
                            </Button>
                        </>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormResponse;