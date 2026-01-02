import { IBillServiceStatus } from '@/type/TServiceResponse'
import { create } from 'zustand'

type BillDetailStore = {
    billDetail: IBillServiceStatus
    setBillDetail: (billDetail: IBillServiceStatus) => void
}

export const useBillDetailStore = create<BillDetailStore>()((set) => ({
    billDetail: {} as IBillServiceStatus,
    setBillDetail: (billDetail: IBillServiceStatus) => set({ billDetail }),
}))