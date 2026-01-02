import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useInstitutionQueryHook, useServiceRequestMutation } from "@/hooks/useBillingQueryHook";
import { TFieldResponse } from "@/type/TFieldResponse";
import { TBillRequest } from "@/type/TBillRequest";
import { TBillResponse } from "@/type/TBillResponse";
import FormResponse from "./FormResponse";
import ToastNotification from "./ToastNotification";
import { IBillServiceStatus } from "@/type/TServiceResponse";
import { useBillDetailStore } from "@/store/bill-detail-store";
// import { useBillDetailStore } from "@/store/bill-detail-store";

// ✅ Create dynamic form schema
const createFormSchema = (fields: TFieldResponse[]) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {
        institutionId: z.string().min(1, "Please select an institution"),
    };

    fields.forEach((field) => {
        const fieldName = field.fieldName;
        const isRequired = !!field.isRequired;
        const dataType = (field.dataType || "text").toLowerCase();

        let fieldSchema: z.ZodTypeAny;

        switch (dataType) {
            case "email":
                fieldSchema = z.string().email("Please enter a valid email address");
                break;
            case "number":
                fieldSchema = z.string().regex(/^\d+$/, "Please enter a valid number");
                break;
            case "date":
                fieldSchema = z.string().min(1, "Please select a date");
                break;
            case "textarea":
                fieldSchema = z.string();
                break;
            case "file":
                fieldSchema = z.string().min(1, "Please attach a document"); // base64 string required
                break;
            default:
                fieldSchema = z.string();
        }

        if (!isRequired) {
            fieldSchema = fieldSchema.optional();
        } else if (fieldSchema instanceof z.ZodString) {
            fieldSchema = fieldSchema.min(1, `${field.fieldLabel || field.fieldName} is required`);
        }

        schemaFields[fieldName] = fieldSchema;
    });

    return z.object(schemaFields);
};

type FormData = z.infer<ReturnType<typeof createFormSchema>> & {
    institutionId: string;
    serviceId: number;
    requestCode: string;
};

const ApplicationForm: FC<{ fields: TFieldResponse[]; }> = ({ fields, }) => {
    const { billDetail: { serviceId } } = useBillDetailStore();

    const { institutions } = useInstitutionQueryHook();
    const mutation = useServiceRequestMutation();
    const [submissionResponse, setSubmissionResponse] = useState<TBillResponse | null>(null);
    const [showTrackingPanel, setShowTrackingPanel] = useState(false);
    const [toast, setToast] = useState({
        isVisible: false,
        message: "",
        type: "success" as "success" | "error" | "info"
    });

    const formSchema = createFormSchema(fields);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            institutionId: "",
            serviceId,
            requestCode: ""
        }
    });

    const onSubmit = async (data: FormData) => {
        try {
            // Transform form data to TBillRequest format
            const serviceEntryValue = fields.map((field) => ({
                valueText: String(data[field.fieldName] || ""),
                entryDefinitionId: field.id
            }));

            const request: TBillRequest = {
                requestCode: "",
                serviceId,
                instituteId: parseInt(data.institutionId),
                serviceEntryValue
            };

            const response = await mutation.mutateAsync(request);
            setSubmissionResponse(response);
            setShowTrackingPanel(true);
            reset();
        } catch (error) {
            console.error("Form submission error:", error);
            setToast({
                isVisible: true,
                message: "Error submitting form. Please try again.",
                type: "error"
            });
        }
    };

    return (
        <>
            <div className="mb-10">
                <div className="mb-6">
                    <h3 className="text-2xl font-normal text-gray-900">Apply for this service</h3>
                    <p className="text-gray-600">Please fill in the form below. Required fields are marked.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Institution Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Institution <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="institutionId"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select an institution" />
                                    </SelectTrigger>
                                    {Array.isArray(institutions) && (
                                        <SelectContent>
                                            {institutions.map((institution) => (
                                                <SelectItem key={institution.id} value={String(institution.id)}>
                                                    {institution.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    )}
                                </Select>
                            )}
                        />
                        {errors.institutionId && (
                            <p className="text-red-500 text-sm mt-1">{errors.institutionId.message}</p>
                        )}
                    </div>

                    {/* Dynamic Fields */}
                    {fields.map((f) => {
                        const inputId = `field-${f.id}`;
                        const label = f.fieldLabel || f.fieldName;
                        const type = (f.dataType || "text").toLowerCase();
                        const fieldName = f.fieldName;
                        const isRequired = !!f.isRequired;

                        return (
                            <div key={f.id}>
                                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                                    {label} {isRequired && <span className="text-red-500">*</span>}
                                </label>

                                <Controller
                                    name={fieldName}
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            {type === "textarea" ? (
                                                <textarea
                                                    {...field}
                                                    id={inputId}
                                                    rows={4}
                                                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    placeholder={`Enter ${label.toLowerCase()}`}
                                                />
                                            ) : type === "date" ? (
                                                <input
                                                    {...field}
                                                    id={inputId}
                                                    type="date"
                                                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            ) : type === "number" ? (
                                                <input
                                                    {...field}
                                                    id={inputId}
                                                    type="number"
                                                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    placeholder={`Enter ${label.toLowerCase()}`}
                                                />
                                            ) : type === "email" ? (
                                                <input
                                                    {...field}
                                                    id={inputId}
                                                    type="email"
                                                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    placeholder={`Enter ${label.toLowerCase()}`}
                                                />
                                            ) : type === "file" ? (
                                                <input
                                                    id={inputId}
                                                    type="file"
                                                    accept="*/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                const base64String = reader.result?.toString().split(",")[1] || "";
                                                                field.onChange(base64String);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        } else {
                                                            field.onChange("");
                                                        }
                                                    }}
                                                    className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            ) : (
                                                <input
                                                    {...field}
                                                    id={inputId}
                                                    type="text"
                                                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    placeholder={`Enter ${label.toLowerCase()}`}
                                                />
                                            )}
                                        </>
                                    )}
                                />
                                {errors[fieldName] && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors[fieldName]?.message as string}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || mutation.isPending}
                            className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-5 py-2.5 text-white transition-colors hover:bg-slate-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting || mutation.isPending ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </button>

                        {mutation.isError && (
                            <p className="text-red-500 text-sm mt-2">
                                Error submitting application. Please try again.
                            </p>
                        )}

                        {mutation.isSuccess && !showTrackingPanel && submissionResponse && (
                            <div className="mt-2">
                                <p className="text-green-500 text-sm mb-2">
                                    Application submitted successfully!
                                </p>
                                <button
                                    onClick={() => setShowTrackingPanel(true)}
                                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 
0 8.268 2.943 9.542 7-1.274 4.057-5.064 
7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    <span>View Tracking Details</span>
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Tracking Panel */}
            {showTrackingPanel && submissionResponse && (
                <FormResponse
                    response={submissionResponse}
                    onCopyTrackingNumber={(value) =>
                        setToast({
                            isVisible: true,
                            message: `${value} number copied to clipboard!`,
                            type: "success"
                        })
                    }
                    onClose={() => {
                        setShowTrackingPanel(false);
                        setSubmissionResponse(null);
                    }}
                />
            )}

            {/* Toast Notification */}
            <ToastNotification
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
            />
        </>
    );
};

export default ApplicationForm;
