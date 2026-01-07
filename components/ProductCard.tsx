"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

import { formatPrice, calculateDiscount } from "@/lib/utils";

interface ProductCardProps {
    id: number;
    title: string;
    price: string | number;
    originalPrice?: string | number;
    isBestSeller?: boolean;
    category: string;
    imageColor: string;
    image?: string;
}

const ProductCard = ({ id, title, price, originalPrice, isBestSeller, category, imageColor, image }: ProductCardProps) => {
    const discount = calculateDiscount(originalPrice || 0, price);
    const formattedPrice = formatPrice(price);
    const formattedOriginalPrice = originalPrice ? formatPrice(originalPrice) : null;

    return (
        <Link href={`/product/${id}`} className="block group">
            <div className="relative rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-primary/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,200,255,0.12)]">

                {/* Best Seller Badge */}
                {isBestSeller && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-20 shadow-sm">
                        <Sparkles className="w-2 h-2" />
                        BEST
                    </div>
                )}

                {/* Discount Badge */}
                {discount && (
                    <div className="absolute top-2 right-2 bg-red-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-20">
                        -{discount}%
                    </div>
                )}

                {/* Image Area */}
                <div className={`relative aspect-square ${imageColor} flex items-center justify-center p-4`}>
                    {image && (
                        <Image
                            src={image}
                            alt={title}
                            width={120}
                            height={120}
                            className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-3">
                    {/* Category */}
                    <span className="inline-block text-[9px] font-semibold text-white/40 uppercase tracking-widest mb-0.5">{category}</span>

                    {/* Title */}
                    <h3 className="text-xs font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>

                    {/* Price */}
                    <div className="flex items-end gap-1.5">
                        <span className="text-sm font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">{formattedPrice}</span>
                        {formattedOriginalPrice && (
                            <span className="text-[10px] text-white/25 line-through">{formattedOriginalPrice}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
