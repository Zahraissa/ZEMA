export type TBillRequest = {
    "requestCode": string,
    "serviceId": number,
    "instituteId": number,
    "serviceEntryValue": { "valueText": string, "entryDefinitionId": number }[]
}