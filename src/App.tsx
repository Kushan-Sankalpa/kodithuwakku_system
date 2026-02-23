import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProductProvider } from "@/context/ProductContext";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import ProductsList from "@/pages/ProductsList";
import ProductForm from "@/pages/ProductForm";
import ViewProduct from "@/pages/ViewProduct";
import ChecklistTemplate from "@/pages/settings/ChecklistTemplate";
import CompanySettings from "@/pages/settings/CompanySettings";
import StatusLabelSettings from "@/pages/settings/StatusLabelSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ProductsList />} />
              <Route path="/products/add" element={<ProductForm />} />
              <Route path="/products/:id" element={<ViewProduct />} />
              <Route path="/products/:id/edit" element={<ProductForm />} />
              <Route path="/settings/checklist" element={<ChecklistTemplate />} />
              <Route path="/settings/company" element={<CompanySettings />} />
              <Route path="/settings/status-labels" element={<StatusLabelSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
