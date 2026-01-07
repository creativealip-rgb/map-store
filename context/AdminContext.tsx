"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getProductsAction } from "@/lib/actions/products";

interface AdminContextType {
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    products: any[];
    adminUser: any;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_PASSWORD = "admin123"; // Simple hardcoded password for now

export function AdminProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user has admin role from AuthContext
        if (user?.role === 'admin') {
            setIsAdmin(true);
        }
        setLoading(false);
    }, [user]);

    const login = (email: string, password: string) => {
        // We can add email check here later if needed
        if (password === ADMIN_PASSWORD) {
            setIsAdmin(true);
            // In a real app, we'd set a cookie or token
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAdmin(false);
        router.push("/admin/login");
    };



    // Placeholder for products - in real app, fetch from DB
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (isAdmin) { // Only fetch if admin
                const result = await getProductsAction();
                if (result.success && result.data) {
                    setProducts(result.data);
                }
            }
        };
        fetchProducts();
    }, [isAdmin]);

    const adminUser = user;

    return (
        <AdminContext.Provider value={{ isAdmin, loading, login, logout, products, adminUser }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}
