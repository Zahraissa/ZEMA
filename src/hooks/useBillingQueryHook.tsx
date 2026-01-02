import { getInstitutions, getFieldByServiceId, getServices, postServiceRequest, trackBillRequest } from "@/services/billing-service";
import { TFieldResponse } from "@/type/TFieldResponse";
import { TInstitutionResponse } from "@/type/TInstitutionResponse";
import { TServiceResponse } from "@/type/TServiceResponse";
import { TBillRequest } from "@/type/TBillRequest";
import { TBillResponse } from "@/type/TBillResponse";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TTrackingResponse } from "@/type/TTrackingResponse";

export const useInstitutionQueryHook = () => {
    const { data, isLoading: isLoadingInstitutions, error: errorInstitutions } = useQuery<TInstitutionResponse[] | unknown>({
        queryKey: ['institutions'],
        queryFn: getInstitutions,
        select: (raw) => {
            if (Array.isArray(raw)) return raw as TInstitutionResponse[];
            // @ts-expect-error runtime normalization
            if (Array.isArray(raw?.data)) return raw.data as TInstitutionResponse[];
            // @ts-expect-error runtime normalization
            if (Array.isArray(raw?.results)) return raw.results as TInstitutionResponse[];
            // @ts-expect-error runtime normalization
            if (Array.isArray(raw?.items)) return raw.items as TInstitutionResponse[];
            return [] as TInstitutionResponse[];
        },
    });
    const institutions = (data as TInstitutionResponse[]) ?? [];
    return { institutions, isLoadingInstitutions, errorInstitutions };
}

export const useServiceQueryHook = () => {
    const { data: services, isLoading: isLoadingServices, error: errorServices } = useQuery<TServiceResponse[]>({
        queryKey: ['services'],
        queryFn: getServices,
        select: (data) => {
            const normalize = (raw: unknown): TServiceResponse[] => {
                if (Array.isArray(raw)) return raw as TServiceResponse[];
                // @ts-expect-error runtime normalization
                if (Array.isArray(raw?.data)) return raw.data as TServiceResponse[];
                // @ts-expect-error runtime normalization
                if (Array.isArray(raw?.results)) return raw.results as TServiceResponse[];
                // @ts-expect-error runtime normalization
                if (Array.isArray(raw?.items)) return raw.items as TServiceResponse[];
                return [];
            };
            return normalize(data);
        },
    });
    return { services: services ?? [], isLoadingServices, errorServices };
}


export const useFieldByServiceIdQueryHook = (id?: number) => {
    const { data: field, isLoading: isLoadingField, error: errorField } = useQuery<TFieldResponse[]>({
        queryKey: ['field', id ?? 'unknown'],
        queryFn: () => getFieldByServiceId(id as number),
        enabled: !!id,
    });
    return { field, isLoadingField, errorField };
}

export const useTrackingBillQueryHook = (trackNumber?: string) => {
    const { data, isLoading, error, isError } = useQuery<TTrackingResponse>({
        queryKey: [trackNumber],
        queryFn: () => trackBillRequest(trackNumber),
        enabled: !!trackNumber,
    });
    return { data, isLoading, error, isError };
}

export const useIntitutionsQueryHook = () => {
    const { data, isLoading: isLoadingInstitutions, error: errorInstitutions } = useQuery<TInstitutionResponse[] | unknown>({
        queryKey: ['institutions'],
        queryFn: getInstitutions,
        select: (raw) => {
            if (Array.isArray(raw)) return raw as TInstitutionResponse[];
            // @ts-expect-error runtime normalization
            if (Array.isArray(raw?.data)) return raw.data as TInstitutionResponse[];
            // @ts-expect-error runtime normalization
            if (Array.isArray(raw?.results)) return raw.results as TInstitutionResponse[];
            // @ts-expect-error runtime normalization
            if (Array.isArray(raw?.items)) return raw.items as TInstitutionResponse[];
            return [] as TInstitutionResponse[];
        },
    });
    const institutions = (data as TInstitutionResponse[]) ?? [];
    return { institutions, isLoadingInstitutions, errorInstitutions };
}

export const useServiceRequestMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: TBillRequest) => postServiceRequest(request),
        onSuccess: (data: TBillResponse) => {
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
        },
        onError: (error) => {
            console.error('Failed to submit service request:', error);
        },
    });
}
