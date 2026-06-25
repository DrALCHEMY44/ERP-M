
"use client"

import * as React from "react"
import { 
  Settings, 
  Globe, 
  Wallet, 
  Users, 
  ShieldCheck, 
  Save, 
  Loader2, 
  Plus, 
  Mail, 
  Trash2,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useFirestore } from "@/hooks/use-firestore"
import { useAuth } from "@/hooks/use-auth"
import { useDataConnect } from "@/hooks/use-dataconnect"
import { listUsersByBusinessQuery } from "@/lib/data-service"
import { BusinessSettings, UserProfile } from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const { profile } = useAuth()
  const { data: settingsList, updateRecord, addRecord, loading: settingsLoading } = useFirestore<BusinessSettings>('settings')
  
  const { data: usersData, loading: usersLoading } = useDataConnect({
    query: listUsersByBusinessQuery,
    variables: {
      tenantId: profile?.tenantId || "",
      businessId: profile?.businessId || ""
    },
    skip: !profile
  });

  const users = React.useMemo(() => {
    return (usersData?.users || []).map((u: any) => ({
      uid: u.id,
      email: u.email,
      fullName: u.fullName || u.email.split('@')[0],
      role: u.role,
      tenantId: u.tenantId,
      businessId: u.businessId,
      createdAt: u.createdAt,
      permissions: []
    })) as UserProfile[];
  }, [usersData]);
  
  const [isSaving, setIsSaving] = React.useState(false)
  const settings = settingsList[0] // Should be unique per business

  const [formData, setFormData] = React.useState<Partial<BusinessSettings>>({
    currency: "FCFA",
    timezone: "Africa/Douala",
    fiscalYearStart: "01-01",
    taxRate: 19.25,
    lowStockThreshold: 10,
  })

  React.useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (settings?.id) {
        await updateRecord(settings.id, formData)
      } else {
        await addRecord(formData as Omit<BusinessSettings, 'id'>)
      }
      toast({
        title: "Settings Saved",
        description: "Your business configuration has been updated across the tenant.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "An error occurred while synchronizing settings.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (settingsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Configure your workspace and operational rules.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <div className="overflow-x-auto pb-1">
          <TabsList className="bg-muted/50 p-1 h-12 w-full md:w-auto justify-start border">
            <TabsTrigger value="general" className="text-xs font-bold uppercase tracking-widest px-6 h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Settings className="size-3.5 mr-2" /> General
            </TabsTrigger>
            <TabsTrigger value="localization" className="text-xs font-bold uppercase tracking-widest px-6 h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Globe className="size-3.5 mr-2" /> Localization
            </TabsTrigger>
            <TabsTrigger value="finance" className="text-xs font-bold uppercase tracking-widest px-6 h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Wallet className="size-3.5 mr-2" /> Finance
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs font-bold uppercase tracking-widest px-6 h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="size-3.5 mr-2" /> Team
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs font-bold uppercase tracking-widest px-6 h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <ShieldCheck className="size-3.5 mr-2" /> Security
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Global Thresholds</CardTitle>
              <CardDescription>System-wide defaults for operational triggers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="lowStock">Default Low Stock Level</Label>
                  <div className="flex items-center gap-3">
                    <Input 
                      id="lowStock" 
                      type="number" 
                      value={formData.lowStockThreshold} 
                      onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value)})}
                    />
                    <Badge variant="outline">Units</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Triggers notifications when inventory drops below this value.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Regional Preferences</CardTitle>
              <CardDescription>Currency and time settings for Cameroonian operations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Primary Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(val) => setFormData({...formData, currency: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FCFA">CFA Franc (FCFA)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Business Timezone</Label>
                  <Select 
                    value={formData.timezone} 
                    onValueChange={(val) => setFormData({...formData, timezone: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Douala">Africa/Douala (GMT+1)</SelectItem>
                      <SelectItem value="Africa/Yaounde">Africa/Yaounde (GMT+1)</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Accounting Standards</CardTitle>
              <CardDescription>SYCOHADA financial configurations and tax rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Standard Tax Rate (TVA)</Label>
                  <div className="flex items-center gap-3">
                    <Input 
                      type="number" 
                      step="0.01"
                      value={formData.taxRate} 
                      onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value)})}
                    />
                    <Badge variant="outline">%</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Standard Cameroon TVA: 19.25%</p>
                </div>
                <div className="space-y-2">
                  <Label>Fiscal Year Start</Label>
                  <Input 
                    placeholder="e.g. 01-01" 
                    value={formData.fiscalYearStart}
                    onChange={(e) => setFormData({...formData, fiscalYearStart: e.target.value})}
                  />
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Format: MM-DD (Default SYCOHADA is Jan 1st)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Workspace Members</CardTitle>
                <CardDescription>Manage user roles and tenant invitations.</CardDescription>
              </div>
              <Button size="sm" className="text-[10px] font-bold uppercase tracking-widest">
                <Plus className="size-3 mr-2" /> Invite Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usersLoading ? (
                  <div className="flex justify-center p-4"><Loader2 className="size-6 animate-spin" /></div>
                ) : (
                  users.map((user) => (
                    <div key={user.uid} className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.fullName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">
                          {user.role}
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>System & Data Privacy</CardTitle>
              <CardDescription>Controls for platform integrity and audit logging.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-y-0 p-4 border rounded-xl">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase">Mandatory Two-Factor (2FA)</h4>
                  <p className="text-xs text-muted-foreground font-medium">Require all staff members to use 2FA for workspace access.</p>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between space-y-0 p-4 border rounded-xl bg-emerald-50/20 border-emerald-100">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="size-4" /> Immutable Audit Trail
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium">All record changes are cryptographically signed and archived for 10 years.</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">Locked</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="pt-6 border-t flex items-center justify-between bg-card/50 p-4 rounded-xl border-dashed">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary opacity-50" />
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Tenant: {profile?.tenantId || "Loading..."} • Multi-Tenant Encryption Active
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest text-xs h-11 px-10 shadow-lg"
        >
          {isSaving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
          Save Configuration
        </Button>
      </div>
    </div>
  )
}
