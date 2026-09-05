"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AuthFrame, AuthMessage } from "@/components/auth/auth-frame"
import { PasswordField } from "@/components/auth/password-field"
import { useToast } from "@/hooks/use-toast"
import { authClient } from "@/lib/auth/client"

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState("")
  const [confirmation, setConfirmation] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [token, setToken] = React.useState<string | null>(null)
  const [linkChecked, setLinkChecked] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()

  React.useEffect(() => {
    const resetToken = new URLSearchParams(window.location.search).get("token")
    setToken(resetToken)
    setLinkChecked(true)
    if (!resetToken) setError("This reset link is incomplete. Return to sign in and request a new password reset email.")
  }, [])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (loading) return
    if (password.length < 8 || password !== confirmation) {
      setError("Use at least 8 characters and make both passwords match.")
      return
    }
    if (!token) {
      setError("This reset link is incomplete. Return to sign in and request a new password reset email.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const result = await authClient.resetPassword({ newPassword: password, token })
      if (result.error) throw new Error(result.error.message)
      toast({ title: "Password updated", description: "You can now sign in with your new password." })
      router.replace("/login")
    } catch (error) {
      setError(error instanceof Error ? error.message : "We couldn't update your password. Request a new reset link and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFrame mode="reset">
      <Link href="/login" className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><ArrowLeft className="size-4" aria-hidden="true" />Back to sign in</Link>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose a new password</h1>
      <p className="mb-8 mt-3 text-sm leading-6 text-slate-600">{"Choose a password you haven't used before. You'll use it the next time you sign in."}</p>
      <form onSubmit={submit} className="space-y-5" aria-busy={loading}>
        {error && <AuthMessage id="reset-error">{error}</AuthMessage>}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-slate-700">New password</Label>
          <PasswordField id="password" name="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby="password-hint" disabled={loading || !token} required />
          <p id="password-hint" className="text-xs leading-5 text-slate-500">Use at least 8 characters.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmation" className="text-sm font-medium text-slate-700">Confirm password</Label>
          <PasswordField id="confirmation" name="passwordConfirmation" visibilityLabel="confirmation password" autoComplete="new-password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={loading || !token} required />
        </div>
        <Button type="submit" className="h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700" disabled={loading || !linkChecked || !token}>{loading ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" />Updating password…</> : <>Update password<ArrowRight className="size-4" aria-hidden="true" /></>}</Button>
      </form>
      <p className="mt-6 text-sm leading-6 text-slate-500">Reset links can only be used once. If yours has expired, request a new one from the sign-in page.</p>
    </AuthFrame>
  )
}
