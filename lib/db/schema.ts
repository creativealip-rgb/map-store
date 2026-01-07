import { pgTable, serial, text, integer, decimal, boolean, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Better Auth Tables ---

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: text('role', { enum: ['admin', 'customer'] }).default('customer'),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
});

export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
});

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
});

export const verifications = pgTable("verifications", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
});

// --- Application Tables ---

export const categories = pgTable('categories', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(), // We might not need this if name/id is enough, but keeping for now or mapping ID to slug
    icon: text('icon'),
    description: text('description'),
});

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').unique().notNull(), // We can derive this
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
    stock: integer('stock').default(0),
    categoryId: text('category_id').references(() => categories.id),
    isBestSeller: boolean('is_best_seller').default(false),
    features: jsonb('features').default([]).notNull(),
    imageColor: text('image_color'),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const productImages = pgTable('product_images', {
    id: serial('id').primaryKey(),
    productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    alt: text('alt'),
    isPrimary: boolean('is_primary').default(false),
});

export const orders = pgTable('orders', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()), // Using text UUID for consistency with user IDs if needed, or stick to UUID type. Let's use text to be safe with BetterAuth user IDs potentially
    userId: text('user_id').references(() => users.id),
    guestInfo: jsonb('guest_info'),
    status: text('status', { enum: ['pending', 'paid', 'processing', 'completed', 'cancelled'] }).default('pending'),
    totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
    paymentMethod: text('payment_method'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
    id: serial('id').primaryKey(),
    orderId: text('order_id').references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id').references(() => products.id),
    quantity: integer('quantity').notNull(),
    priceAtTime: decimal('price_at_time', { precision: 10, scale: 2 }).notNull(),
});

export const faqs = pgTable('faqs', {
    id: serial('id').primaryKey(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    order: integer('order').default(0),
    isVisible: boolean('is_visible').default(true),
});

export const reviews = pgTable('reviews', {
    id: serial('id').primaryKey(),
    productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id),
    userName: text('user_name'),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const settings = pgTable('settings', {
    id: serial('id').primaryKey(),
    key: text('key').unique().notNull(),
    value: text('value'),
});

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    accounts: many(accounts),
    orders: many(orders),
    reviews: many(reviews),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    images: many(productImages),
    reviews: many(reviews),
    orderItems: many(orderItems),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    products: many(products),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));
