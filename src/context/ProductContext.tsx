import React, { createContext, useContext, useState, useCallback } from "react";
import { Product, Activity, StatusLabels, CompanyInfo } from "@/types/product";
import { INITIAL_PRODUCTS, INITIAL_ACTIVITIES } from "@/data/mockData";
import { DEFAULT_CHECKLIST_LABELS } from "@/data/checklistLabels";
import { toast } from "sonner";

interface ProductContextType {
  products: Product[];
  activities: Activity[];
  checklistLabels: string[];
  statusLabels: StatusLabels;
  companyInfo: CompanyInfo;
  addProduct: (p: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  updateProduct: (id: string, p: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => void;
  deleteProduct: (id: string) => void;
  setChecklistLabels: (labels: string[]) => void;
  setStatusLabels: (labels: StatusLabels) => void;
  setCompanyInfo: (info: CompanyInfo) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [checklistLabels, setChecklistLabels] = useState<string[]>(DEFAULT_CHECKLIST_LABELS);
  const [statusLabels, setStatusLabels] = useState<StatusLabels>({
    complete: "Complete",
    hasDamage: "Has Damage",
    missingParts: "Missing Parts",
  });
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "Auto Trades Lanka",
    logo: "",
  });

  const addActivity = useCallback((type: Activity["type"], productName: string) => {
    setActivities((prev) => [
      { id: Date.now().toString(), type, productName, timestamp: new Date() },
      ...prev,
    ]);
  }, []);

  const addProduct = useCallback((p: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date();
    const newProduct: Product = { ...p, id: Date.now().toString(), createdAt: now, updatedAt: now };
    setProducts((prev) => [newProduct, ...prev]);
    addActivity("created", p.name);
    toast.success("Product added successfully");
  }, [addActivity]);

  const updateProduct = useCallback((id: string, p: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...p, updatedAt: new Date() } : prod))
    );
    const name = p.name || products.find((pr) => pr.id === id)?.name || "Product";
    addActivity("edited", name);
    toast.success("Product updated successfully");
  }, [addActivity, products]);

  const deleteProduct = useCallback((id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (prod) addActivity("deleted", prod.name);
    toast.success("Product deleted successfully");
  }, [addActivity, products]);

  return (
    <ProductContext.Provider
      value={{
        products, activities, checklistLabels, statusLabels, companyInfo,
        addProduct, updateProduct, deleteProduct,
        setChecklistLabels, setStatusLabels, setCompanyInfo,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
