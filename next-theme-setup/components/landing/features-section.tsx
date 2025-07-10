"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, BarChart3, Bell, Settings, Users, Cloud, Lock, Smartphone } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analytics",
    description:
      "Advanced machine learning algorithms analyze patterns and predict potential issues before they occur.",
    badge: "AI",
    color: "text-blue-500",
  },
  {
    icon: Shield,
    title: "Real-time Monitoring",
    description: "Monitor your entire infrastructure 24/7 with instant alerts and comprehensive dashboards.",
    badge: "Live",
    color: "text-green-500",
  },
  {
    icon: BarChart3,
    title: "Custom Dashboards",
    description: "Create personalized dashboards with drag-and-drop widgets tailored to your specific needs.",
    badge: "Custom",
    color: "text-purple-500",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Intelligent alerting system that reduces noise and focuses on what matters most.",
    badge: "Smart",
    color: "text-orange-500",
  },
  {
    icon: Cloud,
    title: "Multi-Cloud Support",
    description: "Monitor resources across AWS, Azure, GCP, and on-premises infrastructure from one platform.",
    badge: "Multi-Cloud",
    color: "text-cyan-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share insights, collaborate on incidents, and maintain team visibility across all operations.",
    badge: "Team",
    color: "text-pink-500",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade security with SOC 2 compliance, encryption at rest and in transit.",
    badge: "Secure",
    color: "text-red-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Access your monitoring data anywhere with our responsive web app and mobile notifications.",
    badge: "Mobile",
    color: "text-indigo-500",
  },
  {
    icon: Settings,
    title: "Easy Integration",
    description: "Connect with 100+ tools and services through our extensive API and webhook support.",
    badge: "API",
    color: "text-yellow-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to monitor your infrastructure
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive monitoring solution with AI-powered insights, real-time alerts, and enterprise-grade
              security.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="relative h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`rounded-lg p-2 ${feature.color} bg-current/10`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
