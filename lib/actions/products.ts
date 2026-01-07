"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getProducts } from "@/lib/db/queries";

export async function getProductsAction() {
    try {
        const productList = await getProducts();
        return { success: true, data: productList };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { success: false, error: "Failed to fetch products" };
    }
}

export async function addProductAction(productData: {
    name: string;
    price: string;
    originalPrice?: string;
    categoryId?: string;
    features: string[];
    imageColor: string;
    isBestSeller: boolean;
    image?: string;
}) {
    try {
        const slug = productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        // Extract numeric value from price string (e.g., "Rp 35.000" -> "35000")
        const priceValue = productData.price.replace(/[^\d]/g, '') || '0';
        const originalPriceValue = productData.originalPrice ? productData.originalPrice.replace(/[^\d]/g, '') : null;

        const [newProduct] = await db.insert(products).values({
            name: productData.name,
            slug,
            price: priceValue,
            originalPrice: originalPriceValue,
            categoryId: productData.categoryId || null,
            features: productData.features,
            imageColor: productData.imageColor,
            isBestSeller: productData.isBestSeller,
            image: productData.image || '/products/default.png',
            description: '',
        }).returning();

        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true, data: newProduct };
    } catch (error) {
        console.error("Error adding product:", error);
        return { success: false, error: "Failed to add product" };
    }
}

export async function updateProductAction(id: number, productData: {
    name?: string;
    price?: string;
    originalPrice?: string;
    categoryId?: string;
    features?: string[];
    imageColor?: string;
    isBestSeller?: boolean;
}) {
    try {
        const updateData: any = {};

        if (productData.name) {
            updateData.name = productData.name;
            updateData.slug = productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (productData.price) {
            updateData.price = productData.price.replace(/[^\d.]/g, '');
        }
        if (productData.originalPrice) {
            updateData.originalPrice = productData.originalPrice.replace(/[^\d.]/g, '');
        }
        if (productData.categoryId !== undefined) {
            updateData.categoryId = productData.categoryId;
        }
        if (productData.features) {
            updateData.features = productData.features;
        }
        if (productData.imageColor) {
            updateData.imageColor = productData.imageColor;
        }
        if (productData.isBestSeller !== undefined) {
            updateData.isBestSeller = productData.isBestSeller;
        }

        const [updated] = await db.update(products)
            .set(updateData)
            .where(eq(products.id, id))
            .returning();

        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true, data: updated };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, error: "Failed to update product" };
    }
}

export async function deleteProductAction(id: number) {
    try {
        await db.delete(products).where(eq(products.id, id));

        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false, error: "Failed to delete product" };
    }
}
