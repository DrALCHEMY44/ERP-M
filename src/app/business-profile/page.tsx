"use client"

import * as React from "react"
import { Building2, MapPin, Phone, Mail, Save, Upload, Loader2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useFirestore } from "@/hooks/use-firestore"
import { Business } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { MOCK_USER } from "@/lib/mock-data"

export default function BusinessProfilePage() {
  const { data: businesses, updateRecord, loading } = useFirestore<Business>('businesses');
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const business = businesses[0]; // Multi-tenant hook handles filtering

  const [formData, setFormData] = React.useState<Partial<Business>>({});

  React.useEffect(() => {
    if (business) {
      setFormData(business);
    }
  }, [business]);

  const handleSave = async () => {
    if (!business?.id) return;
    setIsSaving(true);
    try {
      await updateRecord(business.id, formData);
      toast({
        title: "Profile Updated",
        description: "Your business information has been synchronized across the tenant.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save business details. Please check your connection.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Profile</h1>
        <p className="text-sm text-muted-foreground">Master identity management for your Cameroonian SME.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Company Identity</CardTitle>
            <CardDescription>Legal registration and tax identification details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Legal Business Name</Label>
                <Input 
                  id="name" 
                  value={formData.name || ""} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID (NIU - Numero d'Identifiant Unique)</Label>
                <Input 
                  id="taxId" 
                  value={formData.taxId || ""} 
                  onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                  placeholder="M012345678901L"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Industrial Sector</Label>
                <Input 
                  id="sector" 
                  value={formData.sector || ""} 
                  onChange={(e) => setFormData({...formData, sector: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Entity Type (SARL, ETS, etc.)</Label>
                <Input 
                  id="type" 
                  value={formData.type || ""} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Business Mission & Description</Label>
              <Textarea 
                id="description" 
                value={formData.description || ""} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Briefly describe what your SME does..." 
                className="resize-none h-24"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Assets</CardTitle>
            <CardDescription>Appearance on SYCOHADA reports.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="h-40 w-40 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed relative overflow-hidden group">
              {formData.logo ? (
                 <img src={formData.logo} alt="Logo" className="object-cover w-full h-full" />
              ) : (
                <Building2 className="size-16 text-muted-foreground group-hover:scale-110 transition-transform" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="size-8 text-white" />
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase tracking-widest">
              Update Logo
            </Button>
            <div className="space-y-1 text-center">
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Multi-tenant isolation active</p>
              <p className="text-[10px] text-primary flex items-center justify-center gap-1 font-bold">
                <Calendar className="size-3" /> Registered: {new Date(formData.createdAt || "").toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Regional Operations</CardTitle>
            <CardDescription>Primary contacts and headquarters location within Cameroon.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="size-3.5 text-primary" /> Phone Line
                </Label>
                <Input 
                  value={formData.phone || ""} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="size-3.5 text-primary" /> Official Email
                </Label>
                <Input 
                  value={formData.email || ""} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary" /> Administrative Region & City
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    value={formData.city || ""} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="City"
                  />
                  <Input 
                    value={formData.region || ""} 
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    placeholder="Region"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary" /> Street Address / Hub
                </Label>
                <Input 
                  value={formData.location || ""} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Akwa, Boulevard de la Liberté" 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[10px] text-muted-foreground font-bold uppercase">
              Tenant ID: {MOCK_USER.tenantId} • Business ID: {MOCK_USER.businessId}
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest text-xs h-11 px-10 shadow-lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
              Save Profile Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
