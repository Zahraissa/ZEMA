import { FC, useState } from "react";
import {
    CheckCircle,
    Clock,
    FileText,
    Building,
    Hash,
    DollarSign,
    User,
    Phone,
    CreditCard,
    Calendar,
    X,
    AlertCircle,
    Info,
    Download,
    Share2,
    Copy,
    Check
} from "lucide-react";
import { useTrackingBillQueryHook } from "@/hooks/useBillingQueryHook";
import { Button } from "@/components/ui/button";
import useCopyTrackingNumber from "@/hooks/useCopyTrackingNumber";

interface TrackingDetailProps {
    trackNumber: string;
    onCopyControlNumber: (value?: string) => void;
    onClose: () => void;
}

const TrackingDetails: FC<TrackingDetailProps> = ({ trackNumber, onCopyControlNumber, onClose }) => {
    const { data, isLoading, isError } = useTrackingBillQueryHook(trackNumber);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getPaymentStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('paid') || statusLower.includes('success')) {
            return 'bg-green-600/70 text-white/70 animate-bounce duration-400';
        }
        if (statusLower.includes('pending')) {
            return 'bg-blue-500/70 text-white';
        }
        if (statusLower.includes('failed') || statusLower.includes('rejected')) {
            return 'bg-red-500/70 text-white';
        }
        return 'bg-slate-500/70 text-white';
    };
    const { copy, error: copyError } = useCopyTrackingNumber();
    const handleCopyControlNumber = async () => {
        const res = await copy(data?.data?.controlNumberDetails?.controlNumber ?? "");
        if (res.success) {
            onCopyControlNumber("Control");
        } else {
            console.error("Copy control number failed:", res.error ?? copyError);
        }
    };
    const [isCopying, setCopying] = useState(false);
    const onCopyChange = () => {
        setCopying(prev => !prev);
        setTimeout(() => setCopying(false), 1000);
    };
    return (
        <div className="fixed inset-0  backdrop-blur-sm flex items-center pt-14 justify-center p-4 z-50 animate-in fade-in duration-200">
            {isLoading ? (
                <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center space-y-4 border border-slate-200/80">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin "></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <p className="text-slate-600 font-medium">Loading tracking details...</p>
                </div>
            ) : (
                <>
                    {!isError ? (
                        <>
                            {data?.data?.controlNumberDetails !== null ? (
                                <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/80">
                                    {/* Header */}
                                    <div className="relative bg-gradient-to-br from-blue-500/70 to-blue-600/70 text-white p-3  rounded-t-xl overflow-y-hidden">
                                        {/* Background pattern */}
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/70 via-blue-800/90 to-blue-900/70"></div>

                                        {/* Grid overlay */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

                                        <div className="relative flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                                                    <CheckCircle className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <h2 className="text-3xl font-light mb-1 text-white">Tracking Information</h2>
                                                    <p className="text-blue-200">Request details and payment information</p>
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
                                        {/* Control Number Section */}
                                        <div className="relative bg-slate-50 rounded-2xl p-8 border-2 border-slate-200 overflow-hidden backdrop-blur-sm">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -mr-16 -mt-16"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/20 rounded-full -ml-12 -mb-12"></div>

                                            <div className="relative text-center">
                                                <div className="flex items-center justify-center space-x-2 mb-4">
                                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                                        <CreditCard className="h-5 w-5 text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-light text-slate-900">Control Number</h3>
                                                </div>
                                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-4">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <p className="text-2xl font-mono font-light text-blue-600">
                                                            {data.data.controlNumberDetails.controlNumber}
                                                        </p>
                                                        <button
                                                            onClick={handleCopyControlNumber}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors group hover:bg-slate-100"
                                                        >
                                                            {!isCopying ? (
                                                                <Copy onClick={onCopyChange} className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                                                            ) : (
                                                                <>
                                                                    <Check
                                                                        className="w-4 h-4 text-green-600 group-hover:text-green-700"
                                                                        aria-hidden="true"
                                                                    />
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex justify-center gap-3">
                                                    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-slate-300">
                                                        <Download className="w-4 h-4" />
                                                        Download Invoice
                                                    </button>

                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Status Badge */}
                                        <div className="flex justify-center">
                                            <div className={`${getPaymentStatusColor(data?.data?.controlNumberDetails.paymentStatus)} px-8 py-2 rounded-2xl font-medium text-lg shadow-lg flex items-center gap-2 border border-blue-600/30`}>
                                                <Clock className="w-5 h-5" />
                                                <span>Status: {data?.data?.controlNumberDetails.paymentStatus}</span>
                                            </div>
                                        </div>

                                        {/* Service Information */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                                    <Building className="h-5 w-5 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-light text-slate-900">Service Information</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <FileText className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-600 mb-1">Service Name</p>
                                                            <p className="font-medium text-slate-900">{data?.data?.serviceItem.serviceName}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <Hash className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-600 mb-1">Service Code</p>
                                                            <p className="font-medium text-slate-900">{data?.data?.serviceItem.serviceCode}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <Building className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-600 mb-1">Service Group</p>
                                                            <p className="font-medium text-slate-900">{data?.data?.serviceItem.serviceGroup.groupName}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <Hash className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-600 mb-1">Request Code</p>
                                                            <p className="font-medium text-slate-900">{data?.data?.requestCode}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {data?.data?.serviceItem.description && (
                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                    <p className="text-sm text-slate-600 mb-2 font-medium">Description</p>
                                                    <p className="text-slate-900 leading-relaxed">{data?.data?.serviceItem.description}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Payment Details */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                                    <DollarSign className="h-5 w-5 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-light text-slate-900">Payment Details</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <DollarSign className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-600 mb-1">Bill Amount</p>
                                                            <p className="font-medium text-slate-900 text-lg">{formatCurrency(data?.data?.controlNumberDetails.billAmount)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <DollarSign className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-600 mb-1">Equivalent Amount</p>
                                                            <p className="font-medium text-slate-900 text-lg">{formatCurrency(data?.data?.controlNumberDetails.billEqvAmount)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <Calendar className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-600 mb-1">Requested Date</p>
                                                            <p className="font-medium text-slate-900 text-sm">{formatDate(data?.data?.controlNumberDetails.requestedDate)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <User className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-600 mb-1">Payer Name</p>
                                                            <p className="font-medium text-slate-900">{data?.data?.controlNumberDetails.payerName}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 md:col-span-2">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <Phone className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-600 mb-1">Payer Phone</p>
                                                            <p className="font-medium text-slate-900">{data?.data?.controlNumberDetails.payerPhone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {data?.data?.controlNumberDetails.billDescription && (
                                                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
                                                    <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                                                        <FileText className="w-5 h-5" />
                                                        Bill Description
                                                    </h4>
                                                    <p className="text-slate-700 leading-relaxed">{data?.data?.controlNumberDetails.billDescription}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Service Entry Values */}
                                        {data?.data?.serviceEntryValueResponseDto && data?.data?.serviceEntryValueResponseDto.length > 0 && (
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-white" />
                                                    </div>
                                                    <h3 className="text-2xl font-light text-slate-900">Submitted Information</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {data?.data?.serviceEntryValueResponseDto.map((entry) => (
                                                        <div key={entry.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                                            <p className="text-sm text-slate-600 mb-2 font-medium">
                                                                {entry.serviceEntryDefinition.fieldLabel}
                                                            </p>
                                                            {entry.serviceEntryDefinition.dataType !== 'file' && (
                                                                <p className="font-medium text-slate-900">{entry.valueText}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Payment Instructions */}
                                        {data?.data?.controlNumberDetails.paymentStatus.toLowerCase() !== 'paid' && (
                                            <div className="bg-blue-600 text-white rounded-2xl p-6">
                                                <h4 className="font-light text-xl mb-4 flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center border border-white/20">
                                                        <Info className="h-5 w-5" />
                                                    </div>
                                                    <span>Payment Instructions</span>
                                                </h4>
                                                <ul className="space-y-3">
                                                    <li className="flex items-start space-x-3">
                                                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-blue-100">Use the control number above to make payment through any authorized channel</span>
                                                    </li>
                                                    <li className="flex items-start space-x-3">
                                                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-blue-100">Payment can be made via mobile money, bank transfer, or agent</span>
                                                    </li>
                                                    <li className="flex items-start space-x-3">
                                                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-blue-100">You will receive a confirmation SMS once payment is processed</span>
                                                    </li>
                                                    <li className="flex items-start space-x-3">
                                                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-blue-100">Keep the control number safe for future reference</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="bg-slate-50 px-8 py-6 rounded-b-3xl flex justify-between items-center border-t border-slate-200">
                                        <p className="text-sm text-slate-600 font-medium">
                                            Created: {formatDate(data?.data?.createdDate)}
                                        </p>
                                        <Button
                                            onClick={onClose}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 border border-blue-600"
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-200/80">
                                    <div className="flex flex-col items-center space-y-6">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                                            <Info className="h-10 w-10 text-blue-600" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-2xl font-light text-slate-900 mb-2">Control Number Pending</h3>
                                            <p className="text-slate-600">
                                                The control number has not been generated yet. Please check back later.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={onClose}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 border border-blue-600"
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-200/80">
                            <div className="flex flex-col items-center space-y-6">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                                    <AlertCircle className="h-10 w-10 text-red-600" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-light text-slate-900 mb-2">Invalid Tracking Number</h3>
                                    <p className="text-slate-600">
                                        The tracking number you entered could not be found. Please verify and try again.
                                    </p>
                                </div>
                                <Button
                                    onClick={onClose}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 border border-blue-600"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TrackingDetails;