
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numPrice)) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numPrice);
}

export function calculateDiscount(original: number | string, current: number | string): number | null {
    const originalPrice = typeof original === "string" ? parseFloat(original) : original;
    const currentPrice = typeof current === "string" ? parseFloat(current) : current;

    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return null;

    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}
