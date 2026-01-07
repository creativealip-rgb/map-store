"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";

export default function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <AdminProvider>
                <CartProvider>
                    {children}
                    <AuthModal />
                    <CartDrawer />
                </CartProvider>
            </AdminProvider>
        </AuthProvider>
    );
}


