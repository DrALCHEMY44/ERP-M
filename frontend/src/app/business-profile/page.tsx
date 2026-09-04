"use client"

import * as React from "react"
import Image from "next/image"
import { Building2, MapPin, Phone, Mail, Save, Upload, Loader2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useNeonData } from "@/hooks/use-neon-data"
import { Business } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getBusinessByIdQuery, updateBusinessMutation } from "@/lib/data-service"

export default function BusinessProfilePage() {
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const { data, loading, refetch } = useNeonData({
    query: getBusinessByIdQuery,
    variables: { id: profile?.businessId || "" },
    skip: !profile?.businessId,
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const business = React.useMemo<Business | undefined>(() => {
    const record = data?.business;
    if (!record) return undefined;
    return {
      id: record.id,
      tenantId: record.tenantId,
      name: record.name,
      type: record.entityType || "",
      sector: record.businessType || "",
      location: record.location || "",
      city: record.city || "",
      region: record.region || "",
      phone: record.phone || "",
      email: record.email || "",
      taxId: record.taxId || "",
      description: record.description || "",
      logo: record.logoUrl || "",
      createdAt: record.createdAt,
    };
  }, [data]);

  const [formData, setFormData] = React.useState<Partial<Business>>({});

  React.useEffect(() => {
    if (business) {
      setFormData(business);
    }
  }, [business]);

  React.useEffect(() => {
    if (!business?.logo || !user) {
      setLogoPreviewUrl(null);
      return;
    }
    let objectUrl: string | null = null;
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(business.logo!);
        if (!response.ok) return;
        objectUrl = URL.createObjectURL(await response.blob());
        if (!cancelled) setLogoPreviewUrl(objectUrl);
      } catch {
        // The editable profile remains available even when a previous logo is unavailable.
      }
    })();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [business?.logo, user]);

  const handleSave = async () => {
    if (!business?.id) return;
    setIsSaving(true);
    try {
      await updateBusinessMutation({
        id: business.id,
        name: formData.name,
        location: formData.location,
        businessType: formData.sector,
        entityType: formData.type,
        city: formData.city,
        region: formData.region,
        phone: formData.phone,
        email: formData.email,
        taxId: formData.taxId,
        description: formData.description,
        logoUrl: formData.logo,
      });
      await refetch();
      toast({
        title: "Profile Updated",
        description: "Your business information has been synchronized across the tenant.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save business details. Please check your connection.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Invalid logo", description: "Choose an image no larger than 5 MB." });
      return;
    }
    setIsUploading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      const response = await fetch("/api/files", {
        method: "POST",
        body: payload,
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Logo upload failed");
      setFormData((current) => ({ ...current, logo: body.fileUrl }));
      setLogoPreviewUrl((current) => {
        if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
        return URL.createObjectURL(file);
      });
      toast({ title: "Logo uploaded", description: "Save the profile to make this logo active." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload the logo.",
      });
    } finally {
      setIsUploading(false);
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
                <Label htmlFor="taxId">Tax ID (NIU - Numero d&apos;Identifiant Unique)</Label>
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
              {logoPreviewUrl ? (
                 <Image src={logoPreviewUrl} alt="Business logo" width={160} height={160} unoptimized className="object-cover w-full h-full" />
              ) : (
                <Building2 className="size-16 text-muted-foreground group-hover:scale-110 transition-transform" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="size-8 text-white" />
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs font-bold uppercase tracking-widest"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
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
              Tenant ID: {profile?.tenantId || "Unavailable"} • Business ID: {profile?.businessId || "Unavailable"}
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest text-xs h-11 px-10 shadow-lg"
              onClick={handleSave}
              disabled={isSaving || isUploading || !business}
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
