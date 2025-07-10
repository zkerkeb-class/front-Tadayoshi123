"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Shield, Zap, Brain, Activity } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Announcement Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              🚀 New: AI-Powered Predictive Analytics Now Available
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Infrastructure
            </span>{" "}
            Monitoring
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Transform your infrastructure monitoring with intelligent AI insights, predictive analytics, and automated
            responses. Monitor, analyze, and optimize your entire tech stack from a single dashboard.
          </motion.p>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Real-time Monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <span>AI-Driven Insights</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="group">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="group">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">Trusted by 500+ companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Company logos would go here */}
              <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
                TechCorp
              </div>
              <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
                DataFlow
              </div>
              <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
                CloudOps
              </div>
              <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
                DevScale
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Image/Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="container mt-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="relative rounded-xl border bg-card p-2 shadow-2xl">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
              {/* Dashboard Preview */}
              <div className="h-full w-full bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Interactive Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
