"use server";

import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export type CreateOrderInput = {
    userId?: string;
    guestInfo?: {
        name: string;
        whatsapp: string;
        email: string;
    };
    totalAmount: number;
    paymentMethod: string;
    items: {
        productId: number;
        quantity: number;
        priceAtTime: number;
    }[];
};

export async function createOrderAction(input: CreateOrderInput) {
    try {
        // 1. Create Order
        const [newOrder] = await db.insert(orders).values({
            userId: null, // Force null to avoid FK constraint with local-only users
            guestInfo: input.guestInfo || null,
            totalAmount: input.totalAmount.toString(),
            paymentMethod: input.paymentMethod,
            status: "pending",
        }).returning();

        if (!newOrder) {
            throw new Error("Failed to create order");
        }

        // 2. Create Order Items
        const itemsToInsert = input.items.map((item) => ({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtTime: item.priceAtTime.toString(),
        }));

        await db.insert(orderItems).values(itemsToInsert);

        revalidatePath("/dashboard"); // If dashboard exists

        return { success: true, orderId: newOrder.id };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Failed to create order" };
    }
}
