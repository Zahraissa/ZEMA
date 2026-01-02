export interface TServiceResponse {
    id: number;
    uuid: string;
    serviceCode: string;
    serviceName: string;
    description: string;
    divisionId: number;
    gfsCodeId: number;
    groupId: number;
    serviceGroup: TServiceGroup;
    createdDate: string;
    serviceItemPricing: TServiceItemPricing;
}

export interface TServiceGroup {
    id: number;
    uuid: string;
    groupCode: string;
    groupName: string;
    status: "FIXED" | string;
    description: string;
    createdDate: string;
}

export interface TServiceDetailResponse {
    id: number;
    uuid: string;
    fieldName: string;
    fieldLabel: string;
    dataType: string;
    isRequired: boolean;
    serviceItemId: number;
    createdDate: string;
}

export interface TServiceItemResponse {
    id: number;
    uuid: string;
    fieldName: string;
    fieldLabel: string;
    dataType: string;
    isRequired: boolean;
    serviceItemId: number;
    createdDate: string;
}

export interface TServiceItemPricing {
    id: number | null;
    uuid: string | null;
    unitPrice: number | null;
    billingCycle: "ONE_TIME" | "MONTHLY" | "YEARLY" | string | null;
    effectiveFrom: string | null;
    effectiveTo: string | null;
    status: "ACTIVE" | "INACTIVE" | string | null;
    serviceItemId: number | null;
}

export interface IBillServiceStatus {
    billType: "FIXED" | string | null;
    serviceId: number | null;
    price: string | number | null;
    billedDate: string | null;
    expireDate: string | null;

}
