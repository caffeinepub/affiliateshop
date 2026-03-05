import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Category {
    id: bigint;
    name: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    title: string;
    featured: boolean;
    description: string;
    imageUrl: string;
    category: string;
    affiliateLink: string;
    price: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCategory(name: string): Promise<Category>;
    createProduct(title: string, description: string, imageUrl: string, price: string, category: string, affiliateLink: string, featured: boolean): Promise<Product>;
    deleteCategory(id: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCategory(id: bigint, name: string): Promise<Category>;
    updateProduct(id: bigint, title: string, description: string, imageUrl: string, price: string, category: string, affiliateLink: string, featured: boolean): Promise<Product>;
}
