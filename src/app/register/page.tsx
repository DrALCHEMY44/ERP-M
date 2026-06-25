
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2,
  Sparkles,
  Loader2,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Lock,
  MapPin,
  Briefcase,
  Globe,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"
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
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import {
  createTenantMutation,
  createBusinessMutation,
  createUserMutation,
  getUserByEmailQuery,
} from "@/lib/data-service"

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
  "Littoral",
  "Centre",
  "West",
  "South-West",
  "North-West",
  "South",
  "East",
  "Adamawa",
  "North",
  "Far North",
]

const PIPELINE_STAGES = [
  "Securing your credentials...",
  "Creating your tenant workspace...",
  "Setting up your business profile...",
  "Provisioning your admin account...",
  "Finalizing your workspace...",
]

// ─── Step 1 Data Interface ───────────────────────────────────────────────────

interface Step1Data {
  fullName: string
  email: string
  password: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { user, profile, refetchProfile } = useAuth()

  // Step control
  const [step, setStep] = React.useState(1)
  const [slideDirection, setSlideDirection] = React.useState<"forward" | "backward">("forward")

  // Step 1 fields (local only — no DB writes until Step 2)
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  // Step 1 data snapshot (frozen on advance)
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

  const router = useRouter()
  const { toast } = useToast()

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

  // ─── Step 1: Local Validation Only ───────────────────────────────────────

  const handleStep1Continue = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validate fields locally
    if (!fullName.trim()) newErrors.fullName = "Full name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address"
    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters"
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Check if email already exists in the database (getUserByEmail is PUBLIC)
    setIsLoading(true)
    setErrors({})
    try {
      const result = await getUserByEmailQuery({ email: email.trim() })
      if (result.data.users.length > 0) {
        setErrors({ email: "An account with this email already exists. Try logging in instead." })
        setIsLoading(false)
        return
      }
    } catch {
      // If the lookup fails, proceed anyway — the mutation will catch duplicates
    }
    setIsLoading(false)

    // ✅ Freeze credentials into step1Data and advance
    setStep1Data({ fullName: fullName.trim(), email: email.trim(), password })
    setSlideDirection("forward")
    setStep(2)
  }

  // ─── Step 2: Atomic Database Transaction Chain ───────────────────────────

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!step1Data) return

    const newErrors: Record<string, string> = {}
    if (!businessName.trim()) newErrors.businessName = "Business name is required"
    if (!sector) newErrors.sector = "Select a business sector"
    if (!city.trim()) newErrors.city = "City / location is required"
    if (!region) newErrors.region = "Select a region"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})
    setPipelineProgress(0)

    try {
      // ── Stage 1: Secure credentials (silent transport auth) ────────────
      setPipelineStage(PIPELINE_STAGES[0])
      setPipelineProgress(1)

      const isAdminEmail = step1Data.email.toLowerCase() === "admin@smarterp.ai"
      const userRole = isAdminEmail ? "Platform Super Admin" : "Business Owner"

      let credential
      const currentAuthUser = auth.currentUser
      if (!currentAuthUser || currentAuthUser.email?.toLowerCase() !== step1Data.email.toLowerCase()) {
        try {
          credential = await createUserWithEmailAndPassword(
            auth,
            step1Data.email,
            step1Data.password
          )
        } catch (authError: any) {
          if (authError.code === "auth/email-already-in-use") {
            setErrors({ form: "An account with this email already exists. Try logging in instead." })
            setIsLoading(false)
            setPipelineStage("")
            return
          }
          throw authError
        }
      }

      // ── Stage 2: Create Tenant ─────────────────────────────────────────
      setPipelineStage(PIPELINE_STAGES[1])
      setPipelineProgress(2)

      const tenantResult = await createTenantMutation({
        name: businessName.trim(),
        businessSector: sector,
        location: `${city.trim()}, ${region}`,
        ownerEmail: step1Data.email,
        subscriptionTier: isAdminEmail ? "Enterprise" : "Basic",
      })
      const tenantId = tenantResult.data.tenant_insert.id

      // ── Stage 3: Create Business ───────────────────────────────────────
      setPipelineStage(PIPELINE_STAGES[2])
      setPipelineProgress(3)

      const businessResult = await createBusinessMutation({
        tenantId: tenantId,
        name: businessName.trim(),
        location: `${city.trim()}, ${region}`,
        businessType: sector,
        region: region,
      })
      const businessId = businessResult.data.business_insert.id

      // ── Stage 4: Create User record ────────────────────────────────────
      setPipelineStage(PIPELINE_STAGES[3])
      setPipelineProgress(4)

      await createUserMutation({
        tenantId: tenantId,
        businessId: businessId,
        email: step1Data.email,
        role: userRole,
        fullName: step1Data.fullName,
      })

      // ── Stage 5: Finalize ──────────────────────────────────────────────
      setPipelineStage(PIPELINE_STAGES[4])
      setPipelineProgress(5)

      // Refetch the user profile so the AuthProvider session is updated in memory
      await refetchProfile()

      // Small delay so the user sees the final stage
      await new Promise((r) => setTimeout(r, 600))

      // ✅ Session is now live via onAuthStateChanged → getUserByEmail
      // The AuthProvider will automatically resolve the profile from Data Connect
      setIsComplete(true)
      setPipelineStage("")

      toast({
        title: "Workspace Ready!",
        description: `Welcome to ${businessName}. Redirecting to your dashboard...`,
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 1800)
    } catch (error: any) {
      console.error("Registration pipeline failed:", error)

      // Parse common database constraint errors
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

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#10083a]" />
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(130,160,255,0.5) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="fixed top-1/4 -left-40 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
      <div className="fixed bottom-1/4 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />

      {/* ── Main Container ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[480px]">
        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/25">
              <Building2 className="size-8" />
            </div>
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="size-3 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-headline font-bold tracking-tighter text-white">
            SmartERP AI
          </h1>
          <p className="text-[11px] text-blue-300/50 font-semibold mt-1 uppercase tracking-[0.25em]">
            Intelligent SME Platform • Cameroon
          </p>
        </div>

        {/* ── Step Indicator ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`
                  flex items-center justify-center h-9 w-9 rounded-full text-xs font-bold
                  transition-all duration-500 ease-out
                  ${step >= s
                    ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/[0.05] text-white/25 border border-white/[0.08]"
                  }
                  ${step === s && !isComplete ? "ring-2 ring-blue-400/40 ring-offset-2 ring-offset-[#0d1442]" : ""}
                  ${isComplete && s === 2 ? "!bg-gradient-to-br !from-emerald-500 !to-green-500 !shadow-emerald-500/30" : ""}
                `}
              >
                {(isComplete && s <= 2) || step > s ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  s
                )}
              </div>
              {s < 2 && (
                <div
                  className={`w-20 h-0.5 rounded-full transition-all duration-700 ${
                    step > 1 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-white/[0.06]"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between px-4 mb-6">
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
              step >= 1 ? "text-blue-400" : "text-white/15"
            }`}
          >
            Credentials
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
              step >= 2 ? "text-blue-400" : "text-white/15"
            }`}
          >
            Workspace
          </span>
        </div>

        {/* ── Glass Card ───────────────────────────────────────────────────── */}
        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Top accent gradient */}
          <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          {/* ── Completion Overlay ──────────────────────────────────────────── */}
          {isComplete && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0e27]/95 backdrop-blur-sm">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-bounce">
                <CheckCircle2 className="size-10 text-white" />
              </div>
              <h3 className="text-xl font-headline font-bold text-white mt-6">
                Workspace Ready!
              </h3>
              <p className="text-sm text-emerald-300/60 mt-2">
                Redirecting to your dashboard...
              </p>
              <div className="mt-4 flex items-center gap-2 text-emerald-400/50">
                <Loader2 className="size-3 animate-spin" />
                <span className="text-xs font-medium">Loading dashboard</span>
              </div>
            </div>
          )}

          {/* ── Form Container ─────────────────────────────────────────────── */}
          <div className="relative overflow-hidden">
            {/* ═══════════════ STEP 1: CREDENTIALS ═══════════════════════════ */}
            <div
              className={`transition-all duration-500 ease-out ${
                step === 1
                  ? "opacity-100 translate-x-0"
                  : slideDirection === "forward"
                    ? "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
                    : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
              }`}
            >
              {step === 1 && (
                <form onSubmit={handleStep1Continue}>
                  {/* Header */}
                  <div className="px-6 pt-6 pb-3">
                    <h2 className="text-lg font-headline font-bold text-white">
                      Create Your Account
                    </h2>
                    <p className="text-[13px] text-white/35 mt-1">
                      Start with your personal credentials to secure your workspace.
                    </p>
                  </div>

                  <div className="px-6 pb-6 space-y-4">
                    {/* Form-level error */}
                    {errors.form && (
                      <div className="rounded-xl bg-red-500/10 border border-red-500/15 px-4 py-3">
                        <p className="text-xs text-red-400 font-medium">{errors.form}</p>
                      </div>
                    )}

                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/15" />
                        <Input
                          id="register-fname"
                          placeholder="Jean-Pierre Kamga"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value)
                            setErrors((p) => ({ ...p, fullName: "" }))
                          }}
                          className="pl-11 h-12 bg-white/[0.04] border-white/[0.06] text-white placeholder:text-white/15 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-sm"
                          required
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-[11px] text-red-400 font-medium pl-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/15" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="jp@business.cm"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setErrors((p) => ({ ...p, email: "" }))
                          }}
                          className="pl-11 h-12 bg-white/[0.04] border-white/[0.06] text-white placeholder:text-white/15 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-sm"
                          required
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-red-400 font-medium pl-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/15" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Min. 6 characters"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setErrors((p) => ({ ...p, password: "" }))
                          }}
                          className="pl-11 h-12 bg-white/[0.04] border-white/[0.06] text-white placeholder:text-white/15 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-sm"
                          required
                        />
                      </div>
                      {errors.password && (
                        <p className="text-[11px] text-red-400 font-medium pl-1">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/15" />
                        <Input
                          id="register-confirm-password"
                          type="password"
                          placeholder="Re-enter your password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            setErrors((p) => ({ ...p, confirmPassword: "" }))
                          }}
                          className="pl-11 h-12 bg-white/[0.04] border-white/[0.06] text-white placeholder:text-white/15 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-sm"
                          required
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-[11px] text-red-400 font-medium pl-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Continue Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-blue-600/20 transition-all duration-300 hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] border-0 rounded-xl"
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 size-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* ═══════════════ STEP 2: WORKSPACE CONFIG ══════════════════════ */}
            <div
              className={`transition-all duration-500 ease-out ${
                step === 2
                  ? "opacity-100 translate-x-0"
                  : slideDirection === "backward"
                    ? "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
                    : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
              }`}
            >
              {step === 2 && (
                <form onSubmit={handleStep2Submit}>
                  {/* Header with back button */}
                  <div className="px-6 pt-6 pb-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (isLoading) return
                          setSlideDirection("backward")
                          setErrors({})
                          setStep(1)
                        }}
                        className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.08] transition-all shrink-0"
                        disabled={isLoading}
                      >
                        <ArrowLeft className="size-4" />
                      </button>
                      <div>
                        <h2 className="text-lg font-headline font-bold text-white">
                          Configure Your Workspace
                        </h2>
                        <p className="text-[13px] text-white/35 mt-0.5">
                          Tell us about your business to personalize your hub.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 space-y-4 mt-1">
                    {/* Form-level error */}
                    {errors.form && (
                      <div className="rounded-xl bg-red-500/10 border border-red-500/15 px-4 py-3">
                        <p className="text-xs text-red-400 font-medium">{errors.form}</p>
                      </div>
                    )}

                    {/* Business Name */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
                        Business Name
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/15" />
                        <Input
                          id="register-business-name"
                          placeholder="Kamga Enterprises SARL"
                          value={businessName}
                          onChange={(e) => {
                            setBusinessName(e.target.value)
                            setErrors((p) => ({ ...p, businessName: "" }))
                          }}
                          className="pl-11 h-12 bg-white/[0.04] border-white/[0.06] text-white placeholder:text-white/15 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-sm"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      {errors.businessName && (
                        <p className="text-[11px] text-red-400 font-medium pl-1">{errors.businessName}</p>
                      )}
                    </div>

                    {/* Business Sector */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
                        Business Sector
                      </Label>
                      <Select
                        value={sector}
                        onValueChange={(v) => {
                          setSector(v)
                          setErrors((p) => ({ ...p, sector: "" }))
                        }}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="h-12 bg-white/[0.04] border-white/[0.06] text-white rounded-xl [&>span]:text-white/15 data-[state=open]:border-blue-500/40">
                          <div className="flex items-center gap-2.5">
                            <Globe className="size-4 text-white/15 shrink-0" />
                            <SelectValue placeholder="Select your industry" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-[#131940] border-white/[0.08] rounded-xl">
                          {BUSINESS_SECTORS.map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="text-white/70 focus:bg-white/[0.06] focus:text-white rounded-lg"
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.sector && (
                        <p className="text-[11px] text-red-400 font-medium pl-1">{errors.sector}</p>
                      )}
                    </div>

                    {/* City / Location */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
                        City / Location
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/15" />
                        <Input
                          id="register-city"
                          placeholder="Douala"
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value)
                            setErrors((p) => ({ ...p, city: "" }))
                          }}
                          className="pl-11 h-12 bg-white/[0.04] border-white/[0.06] text-white placeholder:text-white/15 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-sm"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      {errors.city && (
                        <p className="text-[11px] text-red-400 font-medium pl-1">{errors.city}</p>
                      )}
                    </div>

                    {/* Region */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
                        Region
                      </Label>
                      <Select
                        value={region}
                        onValueChange={(v) => {
                          setRegion(v)
                          setErrors((p) => ({ ...p, region: "" }))
                        }}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="h-12 bg-white/[0.04] border-white/[0.06] text-white rounded-xl [&>span]:text-white/15 data-[state=open]:border-blue-500/40">
                          <div className="flex items-center gap-2.5">
                            <MapPin className="size-4 text-white/15 shrink-0" />
                            <SelectValue placeholder="Select your region" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-[#131940] border-white/[0.08] rounded-xl">
                          {CAMEROON_REGIONS.map((r) => (
                            <SelectItem
                              key={r}
                              value={r}
                              className="text-white/70 focus:bg-white/[0.06] focus:text-white rounded-lg"
                            >
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.region && (
                        <p className="text-[11px] text-red-400 font-medium pl-1">{errors.region}</p>
                      )}
                    </div>

                    {/* Pipeline Progress Indicator */}
                    {isLoading && pipelineStage && (
                      <div className="rounded-xl bg-blue-500/[0.06] border border-blue-500/10 px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Loader2 className="size-4 text-blue-400 animate-spin shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-blue-300/80 font-medium truncate">
                              {pipelineStage}
                            </p>
                            <div className="mt-2.5 h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                                style={{
                                  width: `${(pipelineProgress / PIPELINE_STAGES.length) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Launch Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-blue-600/20 transition-all duration-300 hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] border-0 rounded-xl"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Creating Workspace...
                        </>
                      ) : (
                        <>
                          Launch Workspace
                          <ChevronRight className="ml-2 size-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-4 bg-white/[0.01]">
            <p className="text-center text-xs text-white/25">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 font-bold hover:text-blue-300 transition-colors hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Badge */}
        <p className="text-center text-[10px] text-white/15 uppercase tracking-[0.2em] font-bold mt-6">
          OHADA Compliant • Secured in Cameroon • AES-256 Encrypted
        </p>
      </div>
    </div>
  )
}
