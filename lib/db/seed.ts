
import { Pool } from "pg";
import * as dotenv from "dotenv";
import { categories as initialCategories, products as initialProducts } from "../data";

dotenv.config();

async function main() {
    console.log("🌱 Seeding database (Raw SQL)...");

    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not set");
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Clear existing data (Order matters mostly for FKs, but we deleted constrainst? No we kept them)
        console.log("Cleaning up...");
        await client.query('DELETE FROM order_items');
        await client.query('DELETE FROM orders');
        await client.query('DELETE FROM product_images');
        await client.query('DELETE FROM reviews');
        await client.query('DELETE FROM products');
        await client.query('DELETE FROM categories');

        // Insert categories
        console.log("Inserting categories...");
        for (const cat of initialCategories) {
            await client.query(
                `INSERT INTO categories (id, name, slug, icon) VALUES ($1, $2, $3, $4)`,
                [
                    cat.id,
                    cat.name,
                    cat.name.toLowerCase().replace(/\s+/g, "-"),
                    cat.icon
                ]
            );
        }

        // Insert products
        console.log("Inserting products...");
        for (const product of initialProducts) {
            const price = product.price.replace(/[^0-9.]/g, "");
            const originalPrice = product.originalPrice.replace(/[^0-9.]/g, "");
            const categoryId = product.category.toLowerCase(); // matches category id
            const slug = product.title.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "");
            const features = JSON.stringify(product.features);

            await client.query(
                `INSERT INTO products (
                    name, slug, price, original_price, category_id, is_best_seller, 
                    features, image_color, image, description, stock
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    product.title,
                    slug,
                    price,
                    originalPrice,
                    categoryId,
                    product.isBestSeller,
                    features,
                    product.imageColor,
                    product.image,
                    `Get ${product.title} now at the best price!`,
                    100 // Stock
                ]
            );
        }

        await client.query('COMMIT');
        console.log("✅ Seeding complete!");

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Seeding failed!", err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
        process.exit(0);
    }
}

main();
