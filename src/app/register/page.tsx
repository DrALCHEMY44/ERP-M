
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, Sparkles, ShieldCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { createTenantMutation, createBusinessMutation, createUserMutation } from "@/lib/data-service"

export default function RegisterPage() {
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !fullName) return

    setIsLoading(true)
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // 2. Determine Role and Context
      const isAdminEmail = email.toLowerCase() === 'admin@smarterp.ai';
      const userRole = isAdminEmail ? "Platform Super Admin" : "Business Owner"
      
      // 3. Create Tenant in SQL Connect
      const tenantResult = await createTenantMutation({
        name: isAdminEmail ? "Platform Infrastructure" : `${fullName}'s SME`,
        businessSector: "General Services",
        location: "Douala, Cameroon",
        ownerEmail: email,
        subscriptionTier: isAdminEmail ? "Enterprise" : "Basic",
      });
      const tenantId = tenantResult.data.tenant_insert.id;

      // 4. Create Business in SQL Connect
      const businessResult = await createBusinessMutation({
        tenantId: tenantId,
        name: isAdminEmail ? "Platform Infrastructure" : `${fullName}'s SME`,
        location: "Douala, Cameroon",
      });
      const businessId = businessResult.data.business_insert.id;

      // 5. Create User in SQL Connect
      await createUserMutation({
        tenantId: tenantId,
        businessId: businessId,
        email: email,
        role: userRole,
        fullName: fullName,
      });

      // 6. Create Firestore Profile (for backward compatibility)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        tenantId: tenantId,
        businessId: businessId,
        role: userRole,
        permissions: ["*"],
        createdAt: new Date().toISOString(),
      })

      // 7. Create Tenant Document for platform visibility in Firestore
      await setDoc(doc(db, "tenants", tenantId), {
        id: tenantId,
        name: isAdminEmail ? "Platform Infrastructure" : `${fullName}'s SME`,
        plan: isAdminEmail ? "Enterprise" : "Basic",
        status: "Active",
        createdAt: new Date().toISOString(),
      })

      toast({
        title: isAdminEmail ? "Super Admin Account Created" : "Account Created",
        description: "Welcome to SmartERP AI. Setting up your workspace...",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not create account. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg mb-4">
            <Building2 className="size-8" />
          </div>
          <h1 className="text-3xl font-headline font-bold tracking-tighter text-foreground">Join SmartERP AI</h1>
          <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">
            The Future of Cameroonian SME Management
          </p>
        </div>

        <Card className="shadow-xl">
          <form onSubmit={handleRegister}>
            <CardHeader>
              <CardTitle>Business Owner Registration</CardTitle>
              <CardDescription>Start managing your SME with AI intelligence today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fname">Full Name</Label>
                <Input 
                  id="fname" 
                  placeholder="Jean-Pierre Kamga" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="jp@business.cm" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full font-bold uppercase tracking-widest" disabled={isLoading}>
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Continue Registration"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex justify-center border-t py-4 bg-muted/10">
            <div className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Login here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
