import { useState } from "react";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function StatusLabelSettings() {
  const { statusLabels, setStatusLabels } = useProducts();
  const [labels, setLabels] = useState({ ...statusLabels });

  const handleSave = () => {
    setStatusLabels(labels);
    toast.success("Status labels updated");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Status Labels</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customize status badge text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Complete Label</Label>
            <Input value={labels.complete} onChange={(e) => setLabels({ ...labels, complete: e.target.value })} />
          </div>
          <div>
            <Label>Has Damage Label</Label>
            <Input value={labels.hasDamage} onChange={(e) => setLabels({ ...labels, hasDamage: e.target.value })} />
          </div>
          <div>
            <Label>Missing Parts Label</Label>
            <Input value={labels.missingParts} onChange={(e) => setLabels({ ...labels, missingParts: e.target.value })} />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
