"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, Loader2, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { authClient } from "@/lib/auth/client"

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState("")
  const [confirmation, setConfirmation] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (password.length < 8 || password !== confirmation) {
      toast({ variant: "destructive", title: "Check your password", description: "Use at least 8 characters and make both entries match." })
      return
    }
    const token = new URLSearchParams(window.location.search).get("token")
    if (!token) {
      toast({ variant: "destructive", title: "Invalid reset link", description: "Request a new password-reset email from the sign-in page." })
      return
    }
    setLoading(true)
    try {
      const result = await authClient.resetPassword({ newPassword: password, token })
      if (result.error) throw new Error(result.error.message)
      toast({ title: "Password updated", description: "You can now sign in with your new password." })
      router.replace("/login")
    } catch (error) {
      toast({ variant: "destructive", title: "Reset failed", description: error instanceof Error ? error.message : "Request a new reset link." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <section className="w-full max-w-sm rounded-3xl bg-[#0d111c] p-8 text-white shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600"><Building2 className="size-5" /></span>
          <div><h1 className="font-bold">Choose a new password</h1><p className="text-xs text-slate-400">This reset link can only be used once.</p></div>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative"><Lock className="absolute left-3 top-3 size-4 text-slate-500" /><Input id="password" type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="pl-10 bg-slate-900 border-slate-700" required /></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmation">Confirm password</Label>
            <Input id="confirmation" type="password" autoComplete="new-password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="bg-slate-900 border-slate-700" required />
          </div>
          <Button className="w-full" disabled={loading}>{loading ? <Loader2 className="size-4 animate-spin" /> : "Update password"}</Button>
        </form>
        <Link href="/login" className="mt-6 block text-center text-xs text-blue-400 hover:underline">Back to sign in</Link>
      </section>
    </main>
  )
}
