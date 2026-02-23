import { useState } from "react";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ChecklistTemplate() {
  const { checklistLabels, setChecklistLabels } = useProducts();
  const [labels, setLabels] = useState([...checklistLabels]);

  const handleSave = () => {
    setChecklistLabels(labels);
    toast.success("Checklist template updated");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Checklist Template</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manage the 27 checklist item labels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {labels.map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-6">{i + 1}</span>
              <Input
                value={label}
                onChange={(e) => {
                  const next = [...labels];
                  next[i] = e.target.value;
                  setLabels(next);
                }}
              />
            </div>
          ))}
          <Button onClick={handleSave} className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
