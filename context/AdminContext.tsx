"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getProductsAction, addProductAction, updateProductAction, deleteProductAction } from "@/lib/actions/products";

interface AdminContextType {
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    products: any[];
    adminUser: any;
    addProduct: (data: any) => Promise<void>;
    updateProduct: (id: number, data: any) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    refreshProducts: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_PASSWORD = "admin123"; // Simple hardcoded password for now

export function AdminProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);

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

    const refreshProducts = async () => {
        const result = await getProductsAction();
        if (result.success && result.data) {
            setProducts(result.data);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            refreshProducts();
        }
    }, [isAdmin]);

    const addProduct = async (data: any) => {
        const result = await addProductAction({
            name: data.title,
            price: data.price,
            originalPrice: data.originalPrice,
            categoryId: 1, // Default category, can be improved
            features: data.features,
            imageColor: data.imageColor,
            isBestSeller: data.isBestSeller,
            image: data.image,
        });
        if (result.success) {
            await refreshProducts();
        }
    };

    const updateProduct = async (id: number, data: any) => {
        const result = await updateProductAction(id, {
            name: data.title,
            price: data.price,
            originalPrice: data.originalPrice,
            features: data.features,
            imageColor: data.imageColor,
            isBestSeller: data.isBestSeller,
        });
        if (result.success) {
            await refreshProducts();
        }
    };

    const deleteProduct = async (id: number) => {
        const result = await deleteProductAction(id);
        if (result.success) {
            await refreshProducts();
        }
    };

    const adminUser = user;

    return (
        <AdminContext.Provider value={{
            isAdmin,
            loading,
            login,
            logout,
            products,
            adminUser,
            addProduct,
            updateProduct,
            deleteProduct,
            refreshProducts
        }}>
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
