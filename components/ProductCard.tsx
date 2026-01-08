"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, Loader2, Heart } from "lucide-react";

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
    const [isLoading, setIsLoading] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const router = useRouter();

    const discount = calculateDiscount(originalPrice || 0, price);
    const formattedPrice = formatPrice(price);
    const formattedOriginalPrice = originalPrice ? formatPrice(originalPrice) : null;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoading(true);
        router.push(`/product/${id}`);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div onClick={handleClick} className="block group cursor-pointer">
            <div className={`relative bg-surface border border-border hover:border-white/40 overflow-hidden transition-all duration-300 glow-hover ${isLoading ? 'opacity-70' : ''}`}>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center border transition-all duration-200 ${isWishlisted
                            ? "bg-accent border-accent text-white"
                            : "bg-surface/80 border-border text-white/60 hover:border-white/40 hover:text-white"
                        }`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                {/* Best Seller Badge */}
                {isBestSeller && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary text-background text-[9px] font-bold px-2 py-1 z-20">
                        <Sparkles className="w-2.5 h-2.5" />
                        BEST
                    </div>
                )}

                {/* Discount Badge */}
                {discount && (
                    <div className="absolute top-12 left-3 bg-accent text-white text-[9px] font-bold px-2 py-1 z-20">
                        -{discount}%
                    </div>
                )}

                {/* Image Area - Larger */}
                <div className={`relative aspect-[4/5] ${imageColor} flex items-center justify-center p-6`}>
                    {image && (
                        <Image
                            src={image}
                            alt={title}
                            width={140}
                            height={140}
                            className="object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="px-4 py-2 bg-white/90 text-background text-xs font-bold uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            Lihat Detail
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 border-t border-border">
                    {/* Category */}
                    <span className="inline-block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1">{category}</span>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>

                    {/* Price */}
                    <div className="flex items-end gap-2">
                        <span className="text-lg font-bold text-primary">{formattedPrice}</span>
                        {formattedOriginalPrice && (
                            <span className="text-xs text-white/30 line-through">{formattedOriginalPrice}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
