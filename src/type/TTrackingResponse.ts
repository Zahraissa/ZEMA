export type TTrackingResponse = {
    data: {
        requestCode: string;
        createdDate: string | null;
        serviceItem: {
            id: number;
            uuid: string;
            serviceCode: string;
            serviceName: string;
            description: string;
            divisionId: number;
            gfsCodeId: number;
            groupId: number;
            serviceGroup: {
                id: number;
                uuid: string;
                groupCode: string;
                groupName: string;
                description: string;
                createdDate: string | null;
            };
            createdDate: string | null;
        };
        serviceEntryValueResponseDto: {
            id: number;
            uuid: string;
            valueText: string;
            entryDefinitionId: number;
            serviceEntryDefinition: {
                id: number;
                uuid: string;
                fieldName: string;
                fieldLabel: string;
                dataType: string;
                isRequired: boolean;
                serviceItemId: number;
                createdDate: string | null;
            };
            createdDate: string | null;
        }[];
        controlNumberDetails: {
            billAmount: number;
            billEqvAmount: number;
            controlNumber: string;
            requestedDate: string;
            miscAmount: number;
            payerName: string;
            billDescription: string;
            payerPhone: string;
            paymentStatus: string;
            gepg_status: string;
            createdDate: string | null;
        };
    };
    status: number;
    page: number;
    size: number;
};
