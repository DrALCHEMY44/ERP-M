import { redirect } from "next/navigation"

export default function HomePage() {
  // In a real app, check auth state here. 
  // For the prototype defense project, we go straight to dashboard.
  redirect("/dashboard")
}
