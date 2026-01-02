export type TBillResponse = {
    data: {
        id: number;
        uuid: string;
        requestCode: string;
        serviceId: number;
        instituteId: number;
        serviceEntryValue: string;
        response: string;
    };
    status: number;
    page: number;
    size: number;   
}
