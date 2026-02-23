import { useState } from "react";
import { useProducts } from "@/context/ProductContext";
import { getProductStatus, Product } from "@/types/product";
import { StatusBadge } from "@/components/StatusBadge";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProductsList() {
  const { products, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.vehicleName.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filter === "all") return true;
    const statuses = getProductStatus(p);
    if (filter === "complete") return statuses.includes("complete");
    if (filter === "has-damage") return statuses.includes("has-damage");
    if (filter === "missing-parts") return statuses.includes("missing-parts");
    return true;
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={() => navigate("/products/add")}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="has-damage">Has Damage</SelectItem>
            <SelectItem value="missing-parts">Missing Parts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={() => navigate(`/products/${p.id}`)}
              onEdit={() => navigate(`/products/${p.id}/edit`)}
              onDelete={() => setDeleteId(p.id)}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
}: {
  product: Product;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statuses = getProductStatus(product);

  return (
    <div className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-sm">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.vehicleName}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {statuses.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
        <div className="flex gap-1 pt-1">
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
