"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { AuthFrame, AuthMessage, authInputClass } from "@/components/auth/auth-frame"
import { PasswordField } from "@/components/auth/password-field"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [rememberMe, setRememberMe] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [isResettingPassword, setIsResettingPassword] = React.useState(false)
  const [feedback, setFeedback] = React.useState<{ message: string; variant: "error" | "success" } | null>(null)
  const busy = isLoading || isGoogleLoading || isResettingPassword
  const router = useRouter()
  const { toast } = useToast()
  const { refetchProfile } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || busy) return
    setFeedback(null)

    setIsLoading(true)
    try {
      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      })
      if (result.error) throw new Error(result.error.message)
      await refetchProfile()
      toast({
        title: "Login Successful",
        description: "Welcome back to your business workspace.",
      })
      router.replace("/dashboard")
    } catch (error: any) {
      setFeedback({ variant: "error", message: error.message || "We couldn't sign you in. Check your email and password, then try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setFeedback(null)
    setIsGoogleLoading(true)
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })
      if (result.error) throw new Error(result.error.message)
    } catch (error: any) {
      setFeedback({ variant: "error", message: error.message || "Could not complete sign in. Please try again." })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    const normalizedEmail = email.trim()
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setFeedback({ variant: "error", message: "Enter your work email above, then select Forgot password to receive a reset link." })
      document.getElementById("login-email")?.focus()
      return
    }

    setFeedback(null)
    setIsResettingPassword(true)
    try {
      const result = await authClient.requestPasswordReset({
        email: normalizedEmail.toLowerCase(),
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (result.error) throw new Error(result.error.message)
      setFeedback({ variant: "success", message: "Check your inbox for instructions to reset your password." })
    } catch (error: any) {
      setFeedback({ variant: "error", message: error.message || "Could not send the reset email. Please try again." })
    } finally {
      setIsResettingPassword(false)
    }
  }

  return (
    <AuthFrame>
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold text-blue-700">Welcome to your workspace</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Sign in to pick up where you left off.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-5" aria-busy={isLoading}>
        {feedback && <AuthMessage variant={feedback.variant}>{feedback.message}</AuthMessage>}
        <div className="space-y-2">
          <Label htmlFor="login-email" className="text-sm font-medium text-slate-700">Work Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-4 size-4 text-slate-400" aria-hidden="true" />
            <Input id="login-email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={authInputClass + " pl-11"} disabled={busy} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password" className="text-sm font-medium text-slate-700">Password</Label>
          <PasswordField id="login-password" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} required />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <div className="flex min-h-11 items-center gap-2.5">
            <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} disabled={busy} />
            <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-slate-600">Remember me</Label>
          </div>
          <button type="button" onClick={handlePasswordReset} disabled={busy} className="min-h-11 rounded-lg text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50">{isResettingPassword ? "Sending reset link…" : "Forgot password?"}</button>
        </div>
        <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">
          {isLoading ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" />Signing in…</> : <>Sign in<ArrowRight className="size-4" aria-hidden="true" /></>}
        </Button>
      </form>
      <div className="my-6 flex items-center gap-4" aria-hidden="true"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs text-slate-500">or continue with</span><div className="h-px flex-1 bg-slate-200" /></div>
      <Button type="button" onClick={handleGoogleSignIn} disabled={busy} variant="outline" className="h-12 w-full rounded-xl border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50">
        {isGoogleLoading ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" />Connecting to Google…</> : <><svg className="size-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.01v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.34Z" /><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.24-2.5c-.9.6-2.04.96-3.37.96-2.6 0-4.8-1.76-5.6-4.12H3.05v2.59A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.4 13.91a6 6 0 0 1 0-3.82V7.5H3.05a10 10 0 0 0 0 9l3.35-2.59Z" /><path fill="#EA4335" d="M12 5.97c1.47 0 2.79.5 3.83 1.5l2.87-2.86A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.95 5.5l3.35 2.59A6 6 0 0 1 12 5.97Z" /></svg>Continue with Google</>}
      </Button>
      <p className="mt-6 rounded-xl bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-600">Joining your team? Use the email linked to your business account. Your assigned role determines your access.</p>
      <p className="mt-6 text-center text-sm text-slate-600">New to SmartERP? <Link href="/register" className="font-semibold text-blue-700 hover:underline">Create workspace</Link></p>
    </AuthFrame>
  )
}
