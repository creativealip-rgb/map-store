"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, generateId } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    loginWithGoogle: () => Promise<void>;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    authMode: "login" | "register";
    setAuthMode: (mode: "login" | "register") => void;
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    whatsapp: string;
}

interface StoredUser extends User {
    password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "map_store_users";
const CURRENT_USER_KEY = "map_store_current_user";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");

    // Load user from localStorage OR Supabase session on mount
    useEffect(() => {
        const supabase = createClient();

        // Check localStorage first
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Listen for Supabase auth state changes (for OAuth)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    const supabaseUser = session.user;
                    const newUser: User = {
                        id: supabaseUser.id,
                        email: supabaseUser.email || '',
                        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
                        whatsapp: supabaseUser.user_metadata?.phone || '',
                        role: 'user',
                        createdAt: supabaseUser.created_at,
                    };
                    setUser(newUser);
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
                    setAuthModalOpen(false);
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    localStorage.removeItem(CURRENT_USER_KEY);
                }
            }
        );

        setIsLoading(false);

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Get all stored users
    const getStoredUsers = (): StoredUser[] => {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    };

    // Save users to localStorage
    const saveUsers = (users: StoredUser[]) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    };

    // Register new user
    const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        const users = getStoredUsers();

        // Check if email already exists
        if (users.find((u) => u.email === data.email)) {
            return { success: false, error: "Email sudah terdaftar" };
        }

        const newUser: StoredUser = {
            id: generateId(),
            email: data.email,
            password: data.password, // In production, this should be hashed
            name: data.name,
            whatsapp: data.whatsapp,
            role: 'user',
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        saveUsers(users);

        // Auto login after register
        const { password, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        setAuthModalOpen(false);

        return { success: true };
    };

    // Login user
    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const users = getStoredUsers();
        const foundUser = users.find((u) => u.email === email && u.password === password);

        if (!foundUser) {
            return { success: false, error: "Email atau password salah" };
        }

        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        setAuthModalOpen(false);

        return { success: true };
    };

    // Login with Google via Supabase
    const loginWithGoogle = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    // Logout user
    const logout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                loginWithGoogle,
                isAuthModalOpen,
                setAuthModalOpen,
                authMode,
                setAuthMode,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
