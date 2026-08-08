"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { refetchProfile } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      await refetchProfile()
      toast({
        title: "Login Successful",
        description: "Welcome back to your business workspace.",
      })
      window.location.href = "/dashboard"
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      await refetchProfile()
      toast({
        title: "Google Sign-In Successful",
        description: "Successfully authenticated with Google.",
      })
      window.location.href = "/dashboard"
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-In Failed",
        description: error.message || "Could not complete sign in.",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#f8fafc] text-foreground p-6 font-sans">
      {/* Top Header Row */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="size-4" />
          </div>
          <span className="font-bold tracking-tight text-slate-800 text-lg">SmartERP</span>
        </div>
      </div>

      {/* Main card section */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-[390px] bg-[#0d111c] border border-slate-800/60 rounded-3xl p-8 shadow-2xl shadow-slate-950/20 text-white">
          <div className="space-y-1 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-xs text-slate-400">Sign in to continue to your workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Work Email */}
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Work Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-11 bg-[#161f30] border-slate-800/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Password
                </Label>
                <Link href="#" className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-11 bg-[#161f30] border-slate-800/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="border-slate-700 bg-[#161f30] data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label
                htmlFor="remember"
                className="text-xs font-semibold text-slate-400 select-none cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* Continue Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-blue-600/10 transition-all rounded-xl border-0 flex items-center justify-center gap-1 mt-6"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800/85"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0d111c] px-3 text-[10px] font-bold text-slate-500">or</span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            variant="outline"
            className="w-full h-11 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isGoogleLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <svg className="size-4 mr-1" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.52 0-6.37-2.85-6.37-6.37 0-3.52 2.85-6.37 6.37-6.37 1.637 0 3.125.617 4.262 1.628l3.037-3.037C19.347 2.68 15.93 1.5 12.24 1.5 6.423 1.5 1.71 6.213 1.71 12s4.713 10.5 10.53 10.5c6.12 0 10.457-4.303 10.457-10.63 0-.61-.06-1.125-.17-1.585H12.24z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <div className="text-center text-xs text-slate-400 mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500 font-bold hover:underline">
              Create workspace
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer Row */}
      <div className="w-full text-center py-4 border-t border-slate-200">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          OHADA Compliant • Secured in Cameroon • AES-256 Encrypted
        </p>
      </div>
    </div>
  )
}
