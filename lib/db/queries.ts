
import { db } from "./index";
import { products, categories, productImages, orders } from "./schema";
import { eq, desc } from "drizzle-orm";

export async function getCategories() {
    return await db.select().from(categories);
}

export async function getProducts() {
    const data = await db.select().from(products).orderBy(desc(products.isBestSeller));
    return data.map(p => ({
        ...p,
        title: p.name,
        category: p.categoryId,
        // features: p.features as string[], // Cast if needed
    }));
}


export async function getProductById(id: number) {
    return await db.query.products.findFirst({
        where: eq(products.id, id),
    });
}

export async function getProductBySlug(slug: string) {
    return await db.query.products.findFirst({
        where: eq(products.slug, slug),
    });
}

export async function getAllOrders() {
    return await db.query.orders.findMany({
        orderBy: desc(orders.createdAt),
        with: {
            items: {
                with: {
                    product: true,
                },
            },
            user: true, // If we want user info
        },
    });
}
