import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import generateId from "@/utils/generateId";
import { NextFunction, Request, Response } from "express";
import { salesModel } from "@/utils/types";


const createSales = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {
        customerId,
        customerName,
        customerEmail,
        saleNumber,
        saleType,
        saleAmount,
        paidAmount,
        balanceAmount = 0,
        paymentStatus = "PAID",
        paymentMethod,
        transactionCode,
        transactionAccount,
        shopId,
        saleItems
    }: salesModel = req.body;


    const saleId = await db.$transaction(async (transaction) => {


        // updating customer if have balance amount
        // checking is the customer is eligible
        // 1. Check if customer exits
        const customerExits = await transaction.customer.findUnique({ where: { id: customerId } })
        if (!customerExits)
            return next(new ApiError(404, "Customer Not Found", "Not Found"))

        // 2. Check is balance amount
        if (balanceAmount && balanceAmount > 0) {

            //3. check if customer eligible fort credit
            if (customerExits.maxCreditLimit && customerExits.maxCreditLimit > balanceAmount)
                return next(new ApiError(403, `Customer is not Eligible for this Credits of ${balanceAmount}`, "Not Allowed"))

            //4. then Update customer
            const updatedCustomer = await transaction.customer.update(
                {
                    where: { id: customerId },
                    data: {
                        unpaidCreditAmount: {
                            increment: balanceAmount
                        },
                        maxCreditLimit: {
                            decrement: balanceAmount
                        }
                    }
                });
            if (!updatedCustomer)
                return next(new ApiError(500, "Failed to update Customer", "Failed Updating"))
        }

        // 5. Now create an empty sale
        const sale = await transaction.sale.create({
            data: {
                customerId,
                customerName,
                customerEmail,
                paymentMethod,
                saleAmount,
                saleNumber: generateId(), saleType,
                shopId, balanceAmount, paidAmount, paymentStatus,
                transactionCode, transactionAccount
            }
        })
        //6. add all item to sale and update the stocks
        if (saleItems && saleItems.length > 0) {
            for (const item of saleItems) {
                // update the stock quantity
                const updatedProduct = await transaction.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQty: {
                            decrement: item.qty
                        }
                    }
                });

                // check if updated
                if (!updatedProduct) {
                    return next(new ApiError(500, "Failed to update Product qty", "UPDATE FAILED"))
                }

                // create sale Item
                const saleItem = await transaction.saleItem.create({
                    data: {
                        saleId: sale.id,
                        productId: item.productId,
                        qty: item.qty,
                        productName: item.productName,
                        salePrice: item.salePrice
                    }
                });
                if (!saleItem) return next(new ApiError(500, "Failed to create Sale", "FAILED CREATION"))
            }
        }
        return sale.id
    });

    const sale = await db.sale.findUnique({
        where: { id: saleId as string },
        include: {
            saleItems: true
        }
    });

    res.status(200).json(new ApiResponse(201, "Sales Created SuccessFully", sale))

});


const getSaleById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { saleId } = req.params

    const sale = await db.sale.findFirst({
        where: {
            id: saleId
        }, include: {
            saleItems: true
        }
    })

    if (!sale) {
        return next(new ApiError(404, "Sale Does not Exits", "Not Found"))
    }

    res.status(200).json(new ApiResponse(200, "Sale Get SuccessFully", sale))
})


const getSales = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {


    const sales = await db.sale.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.status(200).json(new ApiResponse(200, "Sale Get SuccessFully", sales))
})




const addItemToSale = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const saleId = req.params.saleId;
    const { productId, qty, salePrice, productName } = req.body;

    await db.$transaction(async (transaction) => {
        // 1. Check if sale exists
        const sale = await transaction.sale.findUnique({ where: { id: saleId } });
        if (!sale) {
            return next(new ApiError(404, "Sale not found", "Not Found"));
        }

        // 2. Check if product exists and has enough stock
        const product = await transaction.product.findUnique({ where: { id: productId } });
        if (!product) {
            return next(new ApiError(404, "Product not found", "Not Found"));
        }

        if (product.stockQty < qty) {
            return next(new ApiError(400, "Insufficient stock", "Bad Request"));
        }

        // 3. Create sale item
        const saleItem = await transaction.saleItem.create({
            data: {
                saleId,
                productId,
                qty,
                salePrice,
                productName: productName || product.name
            }
        });

        // 4. Update stock quantity
        await transaction.product.update({
            where: { id: productId },
            data: {
                stockQty: {
                    decrement: qty
                }
            }
        });

        // 5. Update sale totals
        const itemTotal = qty * salePrice;
        await transaction.sale.update({
            where: { id: saleId },
            data: {
                saleAmount: {
                    increment: itemTotal
                },
                balanceAmount: {
                    increment: itemTotal
                },
                paymentStatus: "CREDIT"
            }
        });

        res.status(201).json(new ApiResponse(201, "Sale item added successfully", saleItem));
    });
});



export { createSales, getSaleById, addItemToSale, getSales }
