import type { PaymentStatus, Accounts, PaymentMethod, SaleType } from "@prisma/client"

export interface salesModel {
    id: string
    customerId: string
    customerName?: string | null
    customerEmail?: string | null
    saleNumber: number
    saleType: SaleType
    saleAmount: number
    paidAmount: number
    balanceAmount: number
    paymentStatus: PaymentStatus
    paymentMethod: PaymentMethod
    transactionCode?: string | null
    transactionAccount?: Accounts | null
    saleItems: SaleItemInput[]
    shopId: string
}
interface SaleItemInput {
    // saleId: string
    productId: string
    qty: number
    salePrice: number
    productName: string
}

