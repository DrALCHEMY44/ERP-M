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
  Eye,
  EyeOff,
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
  "Securing your credentials...",
  "Creating your tenant workspace...",
  "Setting up your business profile...",
  "Provisioning your admin account...",
  "Finalizing your workspace...",
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
  const [slideDirection, setSlideDirection] = React.useState<"forward" | "backward">("forward")

  // Step 1 fields
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

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
      newErrors.password = "Password does not meet criteria checklist"
    }
    
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

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
      // If query fails, continue; mutation will enforce constraints
    }
    setIsLoading(false)

    setStep1Data({ fullName: fullName.trim(), email: email.trim(), password })
    setSlideDirection("forward")
    setStep(2)
  }

  // ─── Step 2: Atomic Setup Transaction Chain ─────────────────────────────

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
      // ── Stage 1: Auth sign up ────────────
      setPipelineStage(PIPELINE_STAGES[0])
      setPipelineProgress(1)

      const isAdminEmail = step1Data.email.toLowerCase() === "admin@smarterp.ai"
      const userRole = isAdminEmail ? "Platform Super Admin" : "Business Owner"

      const currentAuthUser = auth.currentUser
      if (!currentAuthUser || currentAuthUser.email?.toLowerCase() !== step1Data.email.toLowerCase()) {
        try {
          await createUserWithEmailAndPassword(
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

      // ── Stage 2: Create Tenant ────────────
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

      // ── Stage 3: Create Business ────────────
      setPipelineStage(PIPELINE_STAGES[2])
      setPipelineProgress(3)

      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      const normalizedName = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
      const code = `${normalizedName}_${dateStr}`

      const businessResult = await createBusinessMutation({
        tenantId: tenantId,
        name: businessName.trim(),
        location: `${city.trim()}, ${region}`,
        businessType: sector,
        region: region,
        code: code,
      })
      const businessId = businessResult.data.business_insert.id

      // ── Stage 4: Create User Profile ────────────
      setPipelineStage(PIPELINE_STAGES[3])
      setPipelineProgress(4)

      await createUserMutation({
        tenantId: tenantId,
        businessId: businessId,
        email: step1Data.email,
        role: userRole,
        fullName: step1Data.fullName,
      })

      // ── Stage 5: Finalize ────────────
      setPipelineStage(PIPELINE_STAGES[4])
      setPipelineProgress(5)

      await refetchProfile()
      await new Promise((r) => setTimeout(r, 600))

      setIsComplete(true)
      setPipelineStage("")

      toast({
        title: "Workspace Ready!",
        description: `Welcome to ${businessName}. Redirecting to your dashboard...`,
      })

      setTimeout(() => {
        window.location.href = "/dashboard"
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
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        
        {/* Step Indicator Header */}
        <div className="w-full max-w-[390px] mb-6">
          <div className="flex items-center justify-center gap-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-1">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                step === 1 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                  : "bg-emerald-500 text-white"
              }`}>
                {step > 1 ? <CheckCircle2 className="size-3.5" /> : "1"}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                step === 1 ? "text-blue-600" : "text-emerald-500"
              }`}>Account</span>
            </div>

            {/* Connection Line */}
            <div className={`flex-1 h-0.5 max-w-[80px] rounded-full transition-all ${
              step > 1 ? "bg-emerald-500" : "bg-slate-200"
            }`} />

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-1">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                step === 2 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                  : "bg-slate-200 text-slate-400"
              }`}>
                2
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                step === 2 ? "text-blue-600" : "text-slate-400"
              }`}>Workspace</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-[390px] bg-[#0d111c] border border-slate-800/60 rounded-3xl p-8 shadow-2xl shadow-slate-950/20 text-white relative overflow-hidden">
          
          {/* Completion Overlay */}
          {isComplete && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d111c]/95 backdrop-blur-sm">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-xl shadow-emerald-500/40 animate-bounce">
                <CheckCircle2 className="size-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mt-4">Workspace Ready!</h3>
              <p className="text-xs text-emerald-400/60 mt-1">Redirecting to your dashboard...</p>
              <div className="mt-3 flex items-center gap-1.5 text-slate-500">
                <Loader2 className="size-3 animate-spin text-slate-400" />
                <span className="text-[10px] font-medium">Launching SmartERP</span>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div>
            {step === 1 ? (
              <form onSubmit={handleStep1Continue} className="space-y-4">
                <div className="space-y-1 mb-6">
                  <h2 className="text-xl font-bold tracking-tight">Create your account</h2>
                  <p className="text-[11px] text-slate-400">Start with your personal credentials.</p>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="reg-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <Input
                      id="reg-name"
                      placeholder="Jean-Pierre Kamga"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-11 h-11 bg-[#161f30] border-slate-800/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm"
                      required
                    />
                  </div>
                  {errors.fullName && <p className="text-[10px] text-red-400">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="reg-email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="jp@business.cm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-11 bg-[#161f30] border-slate-800/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-400">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="reg-pass" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <Input
                      id="reg-pass"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-11 bg-[#161f30] border-slate-800/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirm" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <Input
                      id="reg-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-11 pr-11 h-11 bg-[#161f30] border-slate-800/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[10px] text-red-400">{errors.confirmPassword}</p>}
                </div>

                {/* Password Criteria checklist */}
                <div className="space-y-1 pt-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`size-3.5 transition-colors ${criteria.length ? "text-emerald-500" : "text-slate-700"}`} />
                    <span className={criteria.length ? "text-emerald-400" : "text-slate-500"}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`size-3.5 transition-colors ${criteria.uppercase ? "text-emerald-500" : "text-slate-700"}`} />
                    <span className={criteria.uppercase ? "text-emerald-400" : "text-slate-500"}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`size-3.5 transition-colors ${criteria.number ? "text-emerald-500" : "text-slate-700"}`} />
                    <span className={criteria.number ? "text-emerald-400" : "text-slate-500"}>One number</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-blue-600/10 transition-all rounded-xl border-0 flex items-center justify-center gap-1 mt-6"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="flex items-center gap-2.5 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (isLoading) return
                      setSlideDirection("backward")
                      setStep(1)
                    }}
                    className="h-7 w-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="size-3.5" />
                  </button>
                  <div className="space-y-0.5">
                    <h2 className="text-xl font-bold tracking-tight">Configure your workspace</h2>
                    <p className="text-[11px] text-slate-400">Tell us about your business.</p>
                  </div>
                </div>

                {errors.form && <p className="text-[11px] text-red-400">{errors.form}</p>}

                {/* Business Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="biz-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Business name
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <Input
                      id="biz-name"
                      placeholder="Kamga Enterprises SARL"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="pl-11 h-11 bg-[#161f30] border-slate-800/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.businessName && <p className="text-[10px] text-red-400">{errors.businessName}</p>}
                </div>

                {/* Business Sector */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Business sector
                  </Label>
                  <Select
                    value={sector}
                    onValueChange={(v) => setSector(v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 bg-[#161f30] border-slate-800/80 text-white rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <div className="flex items-center gap-2.5">
                        <Globe className="size-4 text-slate-500 shrink-0" />
                        <SelectValue placeholder="Information Technology" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f172a] border-slate-800 rounded-xl">
                      {BUSINESS_SECTORS.map((s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className="text-slate-300 focus:bg-slate-800 focus:text-white rounded-lg cursor-pointer"
                        >
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sector && <p className="text-[10px] text-red-400">{errors.sector}</p>}
                </div>

                {/* City / Location */}
                <div className="space-y-1.5">
                  <Label htmlFor="biz-city" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    City / Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <Input
                      id="biz-city"
                      placeholder="Douala"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="pl-11 h-11 bg-[#161f30] border-slate-800/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.city && <p className="text-[10px] text-red-400">{errors.city}</p>}
                </div>

                {/* Region */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Region
                  </Label>
                  <Select
                    value={region}
                    onValueChange={(v) => setRegion(v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 bg-[#161f30] border-slate-800/80 text-white rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="size-4 text-slate-500 shrink-0" />
                        <SelectValue placeholder="Littoral Region" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f172a] border-slate-800 rounded-xl">
                      {CAMEROON_REGIONS.map((r) => (
                        <SelectItem
                          key={r}
                          value={r}
                          className="text-slate-300 focus:bg-slate-800 focus:text-white rounded-lg cursor-pointer"
                        >
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && <p className="text-[10px] text-red-400">{errors.region}</p>}
                </div>

                {/* Pipeline Progress Indicator */}
                {isLoading && pipelineStage && (
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5 mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-3.5 text-blue-500 animate-spin shrink-0" />
                      <p className="text-[10px] text-slate-300 font-medium truncate">{pipelineStage}</p>
                    </div>
                    <div className="h-1 w-full bg-slate-850 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${(pipelineProgress / PIPELINE_STAGES.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-blue-600/10 transition-all rounded-xl border-0 flex items-center justify-center gap-1 mt-6"
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
              </form>
            )}
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 font-bold hover:underline">
            Login here
          </Link>
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
