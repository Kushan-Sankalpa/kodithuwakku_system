import { Product, Activity, ChecklistItem } from "@/types/product";
import { DEFAULT_CHECKLIST_LABELS } from "./checklistLabels";
import productBumper from "@/assets/product-bumper.jpg";
import productHeadlight from "@/assets/product-headlight.jpg";
import productDoor from "@/assets/product-door.jpg";
import productTaillight from "@/assets/product-taillight.jpg";

function makeChecklist(overrides: Partial<Record<number, Partial<ChecklistItem>>> = {}): ChecklistItem[] {
  return DEFAULT_CHECKLIST_LABELS.map((label, i) => ({
    partName: label,
    status: "yes" as const,
    isDamaged: false,
    damageNote: "",
    ...overrides[i],
  }));
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Front Bumper Assembly",
    vehicleName: "Toyota Hilux 2020",
    image: productBumper,
    checklist: makeChecklist(),
    createdAt: new Date("2025-02-20"),
    updatedAt: new Date("2025-02-20"),
  },
  {
    id: "2",
    name: "Headlight Set",
    vehicleName: "Nissan Navara 2019",
    image: productHeadlight,
    checklist: makeChecklist({
      2: { isDamaged: true, damageNote: "Crack on left tail light lens" },
      5: { isDamaged: true, damageNote: "Wiper blade worn out" },
    }),
    createdAt: new Date("2025-02-18"),
    updatedAt: new Date("2025-02-21"),
  },
  {
    id: "3",
    name: "Door Panel Set",
    vehicleName: "Mitsubishi L200 2021",
    image: productDoor,
    checklist: makeChecklist({
      6: { status: "no" },
      13: { status: "no" },
      20: { status: "no" },
    }),
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-02-19"),
  },
  {
    id: "4",
    name: "Tail Light Assembly",
    vehicleName: "Isuzu D-Max 2022",
    image: productTaillight,
    checklist: makeChecklist({
      1: { isDamaged: true, damageNote: "Minor scratch on park light" },
      10: { status: "no" },
    }),
    createdAt: new Date("2025-02-22"),
    updatedAt: new Date("2025-02-23"),
  },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: "a1", type: "created", productName: "Tail Light Assembly", timestamp: new Date("2025-02-22T14:30:00") },
  { id: "a2", type: "edited", productName: "Headlight Set", timestamp: new Date("2025-02-21T10:15:00") },
  { id: "a3", type: "edited", productName: "Front Bumper Assembly", timestamp: new Date("2025-02-20T09:00:00") },
  { id: "a4", type: "edited", productName: "Door Panel Set", timestamp: new Date("2025-02-19T16:45:00") },
  { id: "a5", type: "created", productName: "Headlight Set", timestamp: new Date("2025-02-18T11:00:00") },
  { id: "a6", type: "deleted", productName: "Old Radiator Grill", timestamp: new Date("2025-02-17T08:30:00") },
  { id: "a7", type: "created", productName: "Door Panel Set", timestamp: new Date("2025-02-15T13:20:00") },
];
