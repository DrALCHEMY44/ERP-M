
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

      // 2. Create Firestore Profile
      // Check if this is the admin email
      const isAdminEmail = email.toLowerCase() === 'admin@smarterp.ai';
      
      const tenantId = isAdminEmail ? 'system_root' : `tenant_${Math.random().toString(36).substr(2, 6)}`
      const businessId = isAdminEmail ? 'platform_master' : `biz_${Math.random().toString(36).substr(2, 6)}`
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        tenantId: tenantId,
        businessId: businessId,
        role: isAdminEmail ? "Platform Super Admin" : "Business Owner",
        permissions: ["*"],
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
