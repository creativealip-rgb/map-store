"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(orderId: string, status: "pending" | "paid" | "processing" | "completed" | "cancelled") {
    try {
        await db.update(orders)
            .set({ status })
            .where(eq(orders.id, orderId));

        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, error: "Failed to update status" };
    }
}
