
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Login Successful",
        description: "Welcome back to your business workspace.",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Invalid credentials. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg mb-4">
            <Building2 className="size-8" />
          </div>
          <h1 className="text-3xl font-headline font-bold tracking-tighter">SmartERP AI</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mt-1">SME Hub • Douala</p>
        </div>

        <Card className="border-t-4 border-primary shadow-xl">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Enter your credentials to access your business workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="jean.pierre@business.cm" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" type="button" className="px-0 h-auto text-xs">Forgot password?</Button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full font-bold uppercase tracking-widest" disabled={isLoading}>
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Login"} <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col gap-4 border-t pt-4 bg-muted/10">
            <div className="text-center text-xs text-muted-foreground">
              New to SmartERP?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          OHADA Compliant • Secured in Cameroon
        </p>
      </div>
    </div>
  )
}
