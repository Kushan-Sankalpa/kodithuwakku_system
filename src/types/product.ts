export interface ChecklistItem {
  partName: string;
  status: "yes" | "no";
  isDamaged: boolean;
  damageNote: string;
}

export interface Product {
  id: string;
  name: string;
  vehicleName: string;
  image: string;
  checklist: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProductStatus = "complete" | "has-damage" | "missing-parts";

export interface Activity {
  id: string;
  type: "created" | "edited" | "deleted";
  productName: string;
  timestamp: Date;
}

export interface CompanyInfo {
  name: string;
  logo: string;
}

export interface StatusLabels {
  complete: string;
  hasDamage: string;
  missingParts: string;
}

export function getProductStatus(product: Product): ProductStatus[] {
  const statuses: ProductStatus[] = [];
  const hasNo = product.checklist.some((c) => c.status === "no");
  const hasDamage = product.checklist.some((c) => c.isDamaged && c.damageNote);
  if (hasNo) statuses.push("missing-parts");
  if (hasDamage) statuses.push("has-damage");
  if (!hasNo && !hasDamage) statuses.push("complete");
  return statuses;
}
