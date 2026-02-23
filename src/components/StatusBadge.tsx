import { useProducts } from "@/context/ProductContext";
import { ProductStatus } from "@/types/product";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProductStatus, string> = {
  complete: "bg-success/10 text-success border-success/20",
  "has-damage": "bg-warning/10 text-warning border-warning/20",
  "missing-parts": "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  const { statusLabels } = useProducts();
  const labelMap: Record<ProductStatus, string> = {
    complete: statusLabels.complete,
    "has-damage": statusLabels.hasDamage,
    "missing-parts": statusLabels.missingParts,
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", statusStyles[status])}>
      {labelMap[status]}
    </span>
  );
}
