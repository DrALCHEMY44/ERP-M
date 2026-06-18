"use client"

import * as React from "react"
import Link from "next/link"
import { Building2, Sparkles, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-t-4 border-primary hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Sparkles className="size-4" />
              </div>
              <CardTitle className="text-sm">Create Business</CardTitle>
              <CardDescription className="text-[10px]">Start a new multi-tenant workspace for your SME.</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0">
              <Button size="sm" className="w-full text-[10px] font-bold uppercase" asChild>
                <Link href="/create-business">Select</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-t-4 border-emerald-500 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-4">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <ShieldCheck className="size-4" />
              </div>
              <CardTitle className="text-sm">Join Existing</CardTitle>
              <CardDescription className="text-[10px]">Use an invitation code from your manager.</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0">
              <Button size="sm" variant="outline" className="w-full text-[10px] font-bold uppercase" asChild>
                <Link href="/join-business">Join</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Individual Sign Up</CardTitle>
            <CardDescription>First, create your personal admin account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fname">Full Name</Label>
                <Input id="fname" placeholder="Jean-Pierre" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jp@business.cm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full font-bold uppercase tracking-widest">
              Continue Registration
            </Button>
          </CardContent>
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
