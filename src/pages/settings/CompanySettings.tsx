import { useState } from "react";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CompanySettings() {
  const { companyInfo, setCompanyInfo } = useProducts();
  const [name, setName] = useState(companyInfo.name);
  const [logoPreview, setLogoPreview] = useState(companyInfo.logo);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setCompanyInfo({ name, logo: logoPreview });
    toast.success("Company info updated");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Company / Receipt Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company info for receipt header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Company Logo</Label>
            <Input type="file" accept="image/*" onChange={handleLogoChange} className="mt-1" />
            {logoPreview && (
              <img src={logoPreview} alt="Logo" className="mt-2 h-16 object-contain" />
            )}
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
