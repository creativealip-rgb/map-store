"use server";

import { getProducts } from "@/lib/db/queries";

export async function getProductsAction() {
    try {
        const products = await getProducts();
        return { success: true, data: products };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { success: false, error: "Failed to fetch products" };
    }
}
