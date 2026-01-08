"use client";

import { useState } from "react";
import { X } from "lucide-react";

const PromoBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border-b border-border overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300d4ff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-center gap-4 relative z-10">
                <div className="flex items-center gap-3 text-center">
                    <span className="hidden sm:inline-block px-2 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-wider">
                        Hot Deal
                    </span>
                    <p className="text-sm md:text-base text-white">
                        <span className="font-bold text-primary">Diskon 15%</span> untuk Bundling Paket Hari Ini!
                        <span className="hidden md:inline text-white/60"> • Gunakan kode: </span>
                        <span className="hidden md:inline font-mono bg-surface px-2 py-0.5 text-primary border border-border">MAPSTORE15</span>
                    </p>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Dismiss banner"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default PromoBanner;
