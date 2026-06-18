
import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect root to the dashboard inside the (main) layout group
  redirect("/dashboard")
}
