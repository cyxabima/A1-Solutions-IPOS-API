import type { PaymentStatus, Accounts, PaymentMethod, SaleType } from "@prisma/client"

export interface salesModel {
    id: string
    customerId: string
    customerName?: string | null
    customerEmail?: string | null
    saleNumber: string
    saleType: SaleType
    saleAmount: number
    paidAmount: number
    profit: number
    balanceAmount: number
    paymentStatus: PaymentStatus
    paymentMethod: PaymentMethod
    transactionCode?: string | null
    transactionAccount?: Accounts | null
    saleItems?: SaleItemInput[] | null
    shopId: string
}
interface SaleItemInput {
    // saleId: string
    productId: string
    qty: number
    salePrice: number
    productName: string
}

export interface CategorizedSales {
    salesPaid: salesModel[];
    salesCredit: salesModel[];
    salesByBankTransfer: salesModel[];
    salesByHandCash: salesModel[];
}
