"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, ArrowRight, ArrowLeft, User, Mail, MapPin, Briefcase, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { authClient } from "@/lib/auth/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { AuthFrame, AuthMessage, authInputClass } from "@/components/auth/auth-frame"
import { PasswordField } from "@/components/auth/password-field"

// ─── Constants ───────────────────────────────────────────────────────────────

const BUSINESS_SECTORS = [
  "Retail & Commerce",
  "Agriculture & Agribusiness",
  "Construction & Real Estate",
  "Healthcare & Pharmaceuticals",
  "Education & Training",
  "Technology & Digital Services",
  "Transportation & Logistics",
  "Food & Beverage",
  "Manufacturing & Industry",
  "Financial Services",
  "Hospitality & Tourism",
  "General Services",
]

const CAMEROON_REGIONS = [
  "Littoral Region",
  "Centre Region",
  "West Region",
  "South-West Region",
  "North-West Region",
  "South Region",
  "East Region",
  "Adamawa Region",
  "North Region",
  "Far North Region",
]

const PIPELINE_STAGES = [
  "Creating your account…",
  "Creating your business workspace…",
  "Adding your business details…",
  "Setting up your account access…",
  "Getting your dashboard ready…",
]

interface Step1Data {
  fullName: string
  email: string
  password: string
}

export default function RegisterPage() {
  const { user, profile, refetchProfile } = useAuth()

  // Step control
  const [step, setStep] = React.useState(1)

  // Step 1 fields
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [invitationToken, setInvitationToken] = React.useState("")

  // Password criteria checklist
  const criteria = React.useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    }
  }, [password])

  // Step 1 data snapshot
  const [step1Data, setStep1Data] = React.useState<Step1Data | null>(null)

  // Step 2 fields
  const [businessName, setBusinessName] = React.useState("")
  const [sector, setSector] = React.useState("")
  const [city, setCity] = React.useState("")
  const [region, setRegion] = React.useState("")

  // UI state
  const [isLoading, setIsLoading] = React.useState(false)
  const [pipelineStage, setPipelineStage] = React.useState("")
  const [pipelineProgress, setPipelineProgress] = React.useState(0)
  const [isComplete, setIsComplete] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const previousStep = React.useRef(step)
  React.useEffect(() => {
    if (previousStep.current !== step) {
      headingRef.current?.focus()
      previousStep.current = step
    }
  }, [step])

  const router = useRouter()
  const { toast } = useToast()

  React.useEffect(() => {
    const parameters = new URLSearchParams(window.location.search)
    setInvitationToken(parameters.get("invite") || "")
    const invitedEmail = parameters.get("email")
    if (invitedEmail) setEmail(invitedEmail.toLowerCase())
  }, [])

  // Onboarding continuation for already authenticated users
  React.useEffect(() => {
    if (user && !profile && step === 1) {
      const displayName = user.displayName || ""
      const userEmail = user.email || ""
      const defaultName = displayName || userEmail.split("@")[0] || "User"

      setFullName(displayName)
      setEmail(userEmail)
      setStep1Data({
        fullName: defaultName,
        email: userEmail,
        password: "", // not needed since already logged in
      })
      setStep(2)
    }
  }, [user, profile, step])

  // ─── Step 1: Validation & Advance ────────────────────────────────────────

  const handleStep1Continue = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validate fields locally
    if (!fullName.trim()) newErrors.fullName = "Full name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address"

    // Enforce criteria matching mockup
    if (!criteria.length || !criteria.uppercase || !criteria.number) {
      newErrors.password = "Use at least 8 characters, one uppercase letter and one number."
    }

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setStep1Data({ fullName: fullName.trim(), email: email.trim(), password })
    setStep(2)
  }

  // ─── Step 2: Atomic Setup Transaction Chain ─────────────────────────────

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!step1Data) return

    const newErrors: Record<string, string> = {}
    if (!invitationToken) {
      if (!businessName.trim()) newErrors.businessName = "Business name is required"
      if (!sector) newErrors.sector = "Select a business sector"
      if (!city.trim()) newErrors.city = "City / location is required"
      if (!region) newErrors.region = "Select a region"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})
    setPipelineProgress(0)

    try {
      // ── Stage 1: Auth sign up ────────────
      setPipelineStage(PIPELINE_STAGES[0])
      setPipelineProgress(1)

      if (!user || user.email.toLowerCase() !== step1Data.email.toLowerCase()) {
        const authResult = await authClient.signUp.email({
          email: step1Data.email.toLowerCase(),
          password: step1Data.password,
          name: step1Data.fullName,
        })
        if (authResult.error) {
          if (authResult.error.status === 422 || authResult.error.message?.toLowerCase().includes("already")) {
            setErrors({ form: "An account with this email already exists. Try logging in instead." })
            setIsLoading(false)
            setPipelineStage("")
            return
          }
          throw new Error(authResult.error.message || "Neon Auth registration failed")
        }
      }

      // ── Stages 2-4: trusted server bootstrap ────────────
      setPipelineStage(PIPELINE_STAGES[1])
      setPipelineProgress(2)
      const bootstrapResponse = await fetch("/api/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: step1Data.fullName,
          businessName: invitationToken ? "Invited workspace" : businessName.trim(),
          businessSector: invitationToken ? "Invited workspace" : sector,
          location: invitationToken ? "Invited workspace" : `${city.trim()}, ${region}`,
          region: invitationToken ? "Invited workspace" : region,
          invitationToken: invitationToken || undefined,
        }),
      })
      const bootstrapBody = await bootstrapResponse.json()
      if (!bootstrapResponse.ok) throw new Error(bootstrapBody.error || "Company bootstrap failed")
      setPipelineStage(PIPELINE_STAGES[3])
      setPipelineProgress(4)

      // ── Stage 5: Finalize ────────────
      setPipelineStage(PIPELINE_STAGES[4])
      setPipelineProgress(5)

      await refetchProfile()
      await new Promise((r) => setTimeout(r, 600))

      setIsComplete(true)
      setPipelineStage("")

      toast({
        title: invitationToken ? "Invitation accepted!" : "Workspace Ready!",
        description: invitationToken
          ? "Your account is ready. Redirecting to your dashboard..."
          : `Welcome to ${businessName}. Redirecting to your dashboard...`,
      })

      setTimeout(() => {
        router.replace("/dashboard")
      }, 1800)
    } catch (error: any) {
      console.error("Registration pipeline failed:", error)
      let message = "Failed to set up your workspace. Please try again."
      const errMsg = error.message?.toLowerCase() || ""
      if (errMsg.includes("unique") || errMsg.includes("duplicate") || errMsg.includes("already exists")) {
        message = "This email is already registered. Please use a different email or log in."
      } else if (errMsg.includes("network") || errMsg.includes("fetch")) {
        message = "Network error. Please check your connection and try again."
      } else if (error.message) {
        message = error.message
      }

      setErrors({ form: message })
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: message,
      })
    } finally {
      if (!isComplete) {
        setIsLoading(false)
        setPipelineStage("")
        setPipelineProgress(0)
      }
    }
  }

  return (
    <AuthFrame mode="register">
      {isComplete ? (
        <div className="py-16 text-center" role="status">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-8" aria-hidden="true" /></span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">{invitationToken ? "You're part of the team" : "Your workspace is ready"}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Taking you to your dashboard…</p>
          <Button asChild className="mt-6 h-12 rounded-xl"><Link href="/dashboard">Open dashboard<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
        </div>
      ) : (
        <>
          <ol aria-label="Registration progress" className="mb-8 flex items-center gap-3 text-sm">
            <li aria-current={step === 1 ? "step" : undefined} className={step === 1 ? "flex items-center gap-2 font-semibold text-blue-700" : "flex items-center gap-2 text-slate-600"}>
              <span className={step > 1 ? "grid size-8 place-items-center rounded-full bg-emerald-100 text-emerald-700" : "grid size-8 place-items-center rounded-full bg-blue-600 text-white"}>{step > 1 ? <CheckCircle2 className="size-4" aria-hidden="true" /> : "1"}</span>
              Account
            </li>
            <span className="h-px min-w-4 flex-1 bg-slate-200" aria-hidden="true" />
            <li aria-current={step === 2 ? "step" : undefined} className={step === 2 ? "flex items-center gap-2 font-semibold text-blue-700" : "flex items-center gap-2 text-slate-500"}>
              <span className={step === 2 ? "grid size-8 place-items-center rounded-full bg-blue-600 text-white" : "grid size-8 place-items-center rounded-full bg-slate-200 text-slate-600"}>2</span>
              {invitationToken ? "Invitation" : "Business"}
            </li>
          </ol>
          <div className="mb-7">
            {step === 2 && !user && <button type="button" onClick={() => { setErrors({}); setStep(1) }} disabled={isLoading} className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50"><ArrowLeft className="size-4" aria-hidden="true" />Back to account details</button>}
            <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold tracking-tight outline-none sm:text-4xl">{step === 1 ? "Create your account" : invitationToken ? "Join your workspace" : "Tell us about your business"}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{step === 1 ? "First, the details you'll use to sign in." : invitationToken ? "Confirm your account to accept your team invitation." : "Set up a shared home for your products, sales and team."}</p>
          </div>

          {Object.keys(errors).length > 0 && <div className="mb-5"><AuthMessage>{errors.form || "Please check the highlighted fields below."}</AuthMessage></div>}

          {step === 1 ? (
            <form onSubmit={handleStep1Continue} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="reg-name" className="text-sm font-medium text-slate-700">Full name</Label>
                <div className="relative"><User className="pointer-events-none absolute left-3.5 top-4 size-4 text-slate-400" aria-hidden="true" /><Input id="reg-name" name="name" autoComplete="name" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={authInputClass + " pl-11"} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "reg-name-error" : undefined} required /></div>
                {errors.fullName && <p id="reg-name-error" className="text-sm text-red-700">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-sm font-medium text-slate-700">Email address</Label>
                <div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-4 size-4 text-slate-400" aria-hidden="true" /><Input id="reg-email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={authInputClass + " pl-11"} aria-invalid={!!errors.email} aria-describedby={errors.email ? "reg-email-error" : undefined} required /></div>
                {errors.email && <p id="reg-email-error" className="text-sm text-red-700">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-pass" className="text-sm font-medium text-slate-700">Password</Label>
                <PasswordField id="reg-pass" name="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-requirements reg-pass-error" : "password-requirements"} required />
                {errors.password && <p id="reg-pass-error" className="text-sm text-red-700">{errors.password}</p>}
                <ul id="password-requirements" className="grid gap-1 pt-1 text-xs leading-5">
                  {[[criteria.length, "At least 8 characters"], [criteria.uppercase, "One uppercase letter"], [criteria.number, "One number"]].map(([met, label]) => <li key={String(label)} className={met ? "flex items-center gap-2 text-emerald-700" : "flex items-center gap-2 text-slate-500"}><CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" /><span className="sr-only">{met ? "Met: " : "Required: "}</span>{label}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-confirm" className="text-sm font-medium text-slate-700">Confirm password</Label>
                <PasswordField id="reg-confirm" name="passwordConfirmation" visibilityLabel="confirmation password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword ? "reg-confirm-error" : undefined} required />
                {errors.confirmPassword && <p id="reg-confirm-error" className="text-sm text-red-700">{errors.confirmPassword}</p>}
              </div>
              <Button type="submit" className="h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">Continue<ArrowRight className="size-4" aria-hidden="true" /></Button>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-5" aria-busy={isLoading}>
              {invitationToken ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">{"You're joining as "}<span className="break-words font-semibold">{step1Data?.email}</span>. Your invitation includes your workspace and team role.</div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="biz-name" className="text-sm font-medium text-slate-700">Business name</Label>
                    <div className="relative"><Briefcase className="pointer-events-none absolute left-3.5 top-4 size-4 text-slate-400" aria-hidden="true" /><Input id="biz-name" name="businessName" autoComplete="organization" placeholder="Your business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={authInputClass + " pl-11"} required disabled={isLoading} aria-invalid={!!errors.businessName} aria-describedby={errors.businessName ? "biz-name-error" : undefined} /></div>
                    {errors.businessName && <p id="biz-name-error" className="text-sm text-red-700">{errors.businessName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-sector" className="text-sm font-medium text-slate-700">Business sector</Label>
                    <Select value={sector} onValueChange={setSector} disabled={isLoading}>
                      <SelectTrigger id="biz-sector" className={authInputClass + " text-left [&>span]:truncate"} aria-invalid={!!errors.sector} aria-describedby={errors.sector ? "biz-sector-error" : undefined}><SelectValue placeholder="Select your sector" /></SelectTrigger>
                      <SelectContent>{BUSINESS_SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    {errors.sector && <p id="biz-sector-error" className="text-sm text-red-700">{errors.sector}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-city" className="text-sm font-medium text-slate-700">City / Location</Label>
                    <div className="relative"><MapPin className="pointer-events-none absolute left-3.5 top-4 size-4 text-slate-400" aria-hidden="true" /><Input id="biz-city" name="city" autoComplete="address-level2" placeholder="e.g. Douala" value={city} onChange={(e) => setCity(e.target.value)} className={authInputClass + " pl-11"} required disabled={isLoading} aria-invalid={!!errors.city} aria-describedby={errors.city ? "biz-city-error" : undefined} /></div>
                    {errors.city && <p id="biz-city-error" className="text-sm text-red-700">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-region" className="text-sm font-medium text-slate-700">Region</Label>
                    <Select value={region} onValueChange={setRegion} disabled={isLoading}>
                      <SelectTrigger id="biz-region" className={authInputClass + " text-left"} aria-invalid={!!errors.region} aria-describedby={errors.region ? "biz-region-error" : undefined}><SelectValue placeholder="Select your region" /></SelectTrigger>
                      <SelectContent>{CAMEROON_REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                    {errors.region && <p id="biz-region-error" className="text-sm text-red-700">{errors.region}</p>}
                  </div>
                </>
              )}
              {isLoading && pipelineStage && (
                <div role="status" className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="flex items-center gap-2 text-sm text-blue-900"><Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />{pipelineStage}</p>
                  <div role="progressbar" aria-label="Workspace setup" aria-valuemin={0} aria-valuemax={PIPELINE_STAGES.length} aria-valuenow={pipelineProgress} className="h-1.5 overflow-hidden rounded-full bg-blue-100"><div className="h-full rounded-full bg-blue-600 transition-all motion-reduce:transition-none" style={{ width: `${(pipelineProgress / PIPELINE_STAGES.length) * 100}%` }} /></div>
                  <p className="text-xs leading-5 text-blue-800">Please keep this page open while we finish.</p>
                </div>
              )}
              <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">
                {isLoading ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" />{invitationToken ? "Joining workspace…" : "Creating workspace…"}</> : <>{invitationToken ? "Accept invitation" : "Create workspace"}<ArrowRight className="size-4" aria-hidden="true" /></>}
              </Button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="font-semibold text-blue-700 hover:underline">Sign in</Link></p>
        </>
      )}
    </AuthFrame>
  )
}
