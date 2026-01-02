/* eslint-disable @typescript-eslint/no-explicit-any */
import { TInstitutionResponse } from '@/type/TInstitutionResponse';
import { TServiceResponse } from '@/type/TServiceResponse';
import { TBillRequest } from '@/type/TBillRequest';
import { TBillResponse } from '@/type/TBillResponse';
import axios from 'axios';

const BillingAPI = axios.create({
    baseURL: 'http://10.0.205.54:7092/api/v1/publics/',
    headers: {
        'Content-Type': 'application/json',
    },
});

const getInstitutions = async (): Promise<TInstitutionResponse[]> => {
    const response = await BillingAPI.get<TInstitutionResponse[]>('institution');
    return response.data;
}
export { getInstitutions };

const getServices = async (): Promise<TServiceResponse[]> => {
    const response = await BillingAPI.get<TServiceResponse[]>('services');
    return response.data;
}
export { getServices };

const getFieldByServiceId = async (id: number): Promise<any> => {
    const response = await BillingAPI.get<any>(`service-entry/${id}`);
    return response.data.data;
}
export { getFieldByServiceId };

const postServiceRequest = async (request: TBillRequest): Promise<TBillResponse> => {
    const response = await BillingAPI.post<TBillResponse>('service-request', request);
    return response.data;
}
export { postServiceRequest };

const trackBillRequest = async (trackNumber: string): Promise<any>=>{
    const response = await BillingAPI.get<any>(`get-with-tres-code/${trackNumber}`);
    return response.data
}
export { trackBillRequest }