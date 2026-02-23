import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { getProductStatus } from "@/types/product";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, Download, Printer, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, companyInfo } = useProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Product not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  const statuses = getProductStatus(product);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Product Details</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Export <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download PDF</DropdownMenuItem>
            <DropdownMenuItem><Printer className="mr-2 h-4 w-4" /> Print</DropdownMenuItem>
            <DropdownMenuItem><FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-card border rounded-lg p-6">
        {companyInfo.name && (
          <div className="text-center mb-6 pb-4 border-b">
            <h3 className="text-lg font-bold">{companyInfo.name}</h3>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="text-muted-foreground">{product.vehicleName}</p>
            <div className="flex gap-2 mt-3">
              {statuses.map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-medium w-8">#</th>
                <th className="text-left px-4 py-3 font-medium">Part Name</th>
                <th className="text-center px-4 py-3 font-medium w-24">Status</th>
                <th className="text-center px-4 py-3 font-medium w-28">Damage</th>
                <th className="text-left px-4 py-3 font-medium">Damage Note</th>
              </tr>
            </thead>
            <tbody>
              {product.checklist.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2.5 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-2.5 font-medium">{item.partName}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={item.status === "yes" ? "text-success font-medium" : "text-destructive font-medium"}>
                      {item.status === "yes" ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {item.status === "yes" ? (
                      <span className={item.isDamaged ? "text-warning font-medium" : "text-muted-foreground"}>
                        {item.isDamaged ? "Damaged" : "Ok"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {item.isDamaged && item.damageNote ? item.damageNote : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
