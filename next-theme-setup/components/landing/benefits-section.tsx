"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Clock, DollarSign, Users } from "lucide-react"
import { motion } from "framer-motion"

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Uptime",
    value: "99.9%",
    description: "Average uptime achieved by our customers",
    color: "text-green-500",
  },
  {
    icon: Clock,
    title: "Faster Resolution",
    value: "75%",
    description: "Reduction in mean time to resolution",
    color: "text-blue-500",
  },
  {
    icon: DollarSign,
    title: "Cost Savings",
    value: "$50K+",
    description: "Average annual savings per customer",
    color: "text-yellow-500",
  },
  {
    icon: Users,
    title: "Team Efficiency",
    value: "3x",
    description: "Improvement in team productivity",
    color: "text-purple-500",
  },
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 sm:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4">
              Results
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Proven results that drive business success
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join hundreds of companies that have transformed their infrastructure monitoring with SupervIA.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <CardContent className="pt-6">
                    <div className={`mx-auto mb-4 rounded-full p-3 ${benefit.color} bg-current/10 w-fit`}>
                      <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                    </div>
                    <div className="text-3xl font-bold mb-2">{benefit.value}</div>
                    <div className="font-semibold mb-2">{benefit.title}</div>
                    <div className="text-sm text-muted-foreground">{benefit.description}</div>
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
