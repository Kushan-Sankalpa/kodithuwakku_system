import { useProducts } from "@/context/ProductContext";
import { getProductStatus } from "@/types/product";
import { StatusBadge } from "@/components/StatusBadge";
import { Package, AlertTriangle, XCircle, Clock, Activity, Plus, PenLine, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { products, activities, statusLabels } = useProducts();

  const totalProducts = products.length;
  const withDamage = products.filter((p) => getProductStatus(p).includes("has-damage")).length;
  const withMissing = products.filter((p) => getProductStatus(p).includes("missing-parts")).length;
  const recentlyAdded = products.filter(
    (p) => Date.now() - p.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;
  const recentlyUpdated = products.filter(
    (p) => p.updatedAt.getTime() !== p.createdAt.getTime() && Date.now() - p.updatedAt.getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;

  const cards = [
    { title: "Total Products", value: totalProducts, icon: Package, color: "text-primary" },
    { title: statusLabels.hasDamage, value: withDamage, icon: AlertTriangle, color: "text-warning" },
    { title: statusLabels.missingParts, value: withMissing, icon: XCircle, color: "text-destructive" },
    { title: "Recently Added", value: recentlyAdded, icon: Clock, color: "text-success" },
    { title: "Recently Updated", value: recentlyUpdated, icon: Activity, color: "text-muted-foreground" },
  ];

  const activityIcons = {
    created: <Plus className="h-4 w-4 text-success" />,
    edited: <PenLine className="h-4 w-4 text-primary" />,
    deleted: <Trash2 className="h-4 w-4 text-destructive" />,
  };

  const activityLabels = {
    created: "Added",
    edited: "Edited",
    deleted: "Deleted",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
                <card.icon className={`h-8 w-8 ${card.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.slice(0, 10).map((a) => (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {activityIcons[a.type]}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activityLabels[a.type]}</span>{" "}
                    <span className="text-muted-foreground">product</span>{" "}
                    <span className="font-medium">{a.productName}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(a.timestamp, "MMM d, h:mm a")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
