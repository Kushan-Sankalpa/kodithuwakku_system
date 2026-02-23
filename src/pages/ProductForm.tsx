import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { ChecklistItem } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, CheckCheck, XCircle, Eraser } from "lucide-react";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, checklistLabels, addProduct, updateProduct } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existing = id ? products.find((p) => p.id === id) : null;
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name || "");
  const [vehicleName, setVehicleName] = useState(existing?.vehicleName || "");
  const [imagePreview, setImagePreview] = useState(existing?.image || "");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    existing?.checklist ||
      checklistLabels.map((label) => ({
        partName: label,
        status: "yes",
        isDamaged: false,
        damageNote: "",
      }))
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateItem = (index: number, update: Partial<ChecklistItem>) => {
    setChecklist((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, ...update };
        if (update.status === "no") {
          updated.isDamaged = false;
          updated.damageNote = "";
        }
        if (update.isDamaged === false) {
          updated.damageNote = "";
        }
        return updated;
      })
    );
  };

  const markAll = (status: "yes" | "no") => {
    setChecklist((prev) =>
      prev.map((item) => ({
        ...item,
        status,
        isDamaged: status === "no" ? false : item.isDamaged,
        damageNote: status === "no" ? "" : item.damageNote,
      }))
    );
  };

  const clearDamageNotes = () => {
    setChecklist((prev) =>
      prev.map((item) => ({ ...item, isDamaged: false, damageNote: "" }))
    );
  };

  const handleSave = (goBack: boolean) => {
    if (!name.trim() || !vehicleName.trim() || !imagePreview) return;
    if (isEdit && existing) {
      updateProduct(existing.id, { name, vehicleName, image: imagePreview, checklist });
    } else {
      addProduct({ name, vehicleName, image: imagePreview, checklist });
    }
    if (goBack) navigate("/products");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">{isEdit ? "Edit Product" : "Add Product"}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" />
          </div>
          <div>
            <Label htmlFor="vehicle">Vehicle Name / Model *</Label>
            <Input id="vehicle" value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} placeholder="e.g. Toyota Hilux 2020" />
          </div>
        </div>
        <div>
          <Label>Product Image *</Label>
          <div
            className="mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors aspect-[4/3] flex items-center justify-center overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
            ) : (
              <div className="text-muted-foreground">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Click to upload image</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-semibold">Parts Checklist</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => markAll("yes")}>
              <CheckCheck className="mr-1 h-4 w-4" /> Mark All Yes
            </Button>
            <Button variant="outline" size="sm" onClick={() => markAll("no")}>
              <XCircle className="mr-1 h-4 w-4" /> Mark All No
            </Button>
            <Button variant="outline" size="sm" onClick={clearDamageNotes}>
              <Eraser className="mr-1 h-4 w-4" /> Clear Notes
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium w-8">#</th>
                  <th className="text-left px-4 py-3 font-medium">Part Name</th>
                  <th className="text-center px-4 py-3 font-medium w-32">Status</th>
                  <th className="text-center px-4 py-3 font-medium w-24">Damaged</th>
                  <th className="text-left px-4 py-3 font-medium w-56">Damage Note</th>
                </tr>
              </thead>
              <tbody>
                {checklist.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2 font-medium">{item.partName}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center gap-1">
                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            item.status === "yes"
                              ? "bg-success text-success-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                          onClick={() => updateItem(i, { status: "yes" })}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            item.status === "no"
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                          onClick={() => updateItem(i, { status: "no" })}
                        >
                          No
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {item.status === "yes" && (
                        <Switch
                          checked={item.isDamaged}
                          onCheckedChange={(v) => updateItem(i, { isDamaged: v })}
                        />
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {item.status === "yes" && item.isDamaged && (
                        <Input
                          value={item.damageNote}
                          onChange={(e) => updateItem(i, { damageNote: e.target.value })}
                          placeholder="Describe damage..."
                          className="h-8 text-xs"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pb-8">
        <Button
          onClick={() => handleSave(false)}
          disabled={!name.trim() || !vehicleName.trim() || !imagePreview}
        >
          Save
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleSave(true)}
          disabled={!name.trim() || !vehicleName.trim() || !imagePreview}
        >
          Save & Back to List
        </Button>
        <Button variant="ghost" onClick={() => navigate("/products")}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
