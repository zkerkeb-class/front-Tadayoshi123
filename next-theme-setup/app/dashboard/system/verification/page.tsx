import type { Metadata } from "next"
import ServiceVerificationDashboard from "@/components/service-verification-dashboard"

export const metadata: Metadata = {
  title: "Service Verification | SupervIA",
  description: "Monitor and verify the health of all integrated services",
}

export default function ServiceVerificationPage() {
  return (
    <div className="container mx-auto py-6">
      <ServiceVerificationDashboard autoRefresh={true} refreshInterval={60000} />
    </div>
  )
}
