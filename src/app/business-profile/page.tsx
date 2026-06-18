"use client"

import * as React from "react"
import { Building2, MapPin, Phone, Mail, Globe, Save, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { MOCK_BUSINESS } from "@/lib/mock-data"

export default function BusinessProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your SME's core information and identity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Update your legal business name and tax information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" defaultValue={MOCK_BUSINESS.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID (NIU)</Label>
                <Input id="taxId" defaultValue={MOCK_BUSINESS.taxId} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input id="sector" defaultValue={MOCK_BUSINESS.sector} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Business Type</Label>
                <Input id="type" defaultValue={MOCK_BUSINESS.type} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea 
                id="description" 
                placeholder="Briefly describe what your SME does..." 
                className="resize-none h-24"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Logo</CardTitle>
            <CardDescription>Displayed on receipts and invoices.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="h-32 w-32 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed relative overflow-hidden group">
              <Building2 className="size-12 text-muted-foreground group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="size-6 text-white" />
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase tracking-widest">
              Upload New Logo
            </Button>
            <p className="text-[10px] text-muted-foreground text-center font-medium">PNG or JPG, max 2MB. Recommended 500x500px.</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Contact & Location</CardTitle>
            <CardDescription>Primary contacts for your business operations in Cameroon.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="size-3.5 text-primary" /> Phone Number
                </Label>
                <Input defaultValue={MOCK_BUSINESS.phone} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="size-3.5 text-primary" /> Email Address
                </Label>
                <Input defaultValue={MOCK_BUSINESS.email} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary" /> City & Region
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input defaultValue={MOCK_BUSINESS.city} />
                  <Input defaultValue={MOCK_BUSINESS.region} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary" /> Specific Location
                </Label>
                <Input defaultValue={MOCK_BUSINESS.location} placeholder="e.g. Akwa, Boulevard de la Liberté" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button className="bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest text-xs h-11 px-8">
              <Save className="size-4 mr-2" /> Save Business Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
