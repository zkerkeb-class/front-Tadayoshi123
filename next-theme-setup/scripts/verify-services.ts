#!/usr/bin/env tsx
/**
 * CLI Service Verification Tool
 * Run service verification from command line
 */

import { serviceVerifier } from "../lib/services/service-verifier"

interface CliOptions {
  format: "json" | "table" | "summary"
  output?: string
  verbose: boolean
  watch: boolean
  interval: number
}

class ServiceVerificationCLI {
  private options: CliOptions

  constructor(options: Partial<CliOptions> = {}) {
    this.options = {
      format: "table",
      verbose: false,
      watch: false,
      interval: 60000,
      ...options,
    }
  }

  async run(): Promise<void> {
    console.log("🔍 Starting SupervIA Service Verification...\n")

    if (this.options.watch) {
      await this.runWatchMode()
    } else {
      await this.runSingleCheck()
    }
  }

  private async runSingleCheck(): Promise<void> {
    const report = await serviceVerifier.verifyAllServices()
    this.displayReport(report)

    if (this.options.output) {
      await this.saveReport(report, this.options.output)
    }

    // Exit with appropriate code
    process.exit(report.overall === "healthy" ? 0 : 1)
  }

  private async runWatchMode(): Promise<void> {
    console.log(`👀 Watch mode enabled - checking every ${this.options.interval / 1000}s\n`)

    const runCheck = async () => {
      console.clear()
      console.log(`🔍 Service Verification - ${new Date().toLocaleString()}\n`)

      const report = await serviceVerifier.verifyAllServices()
      this.displayReport(report)

      console.log(`\n⏰ Next check in ${this.options.interval / 1000} seconds...`)
    }

    // Initial check
    await runCheck()

    // Set up interval
    setInterval(runCheck, this.options.interval)
  }

  private displayReport(report: any): void {
    switch (this.options.format) {
      case "json":
        console.log(JSON.stringify(report, null, 2))
        break
      case "summary":
        this.displaySummary(report)
        break
      default:
        this.displayTable(report)
        break
    }
  }

  private displaySummary(report: any): void {
    const statusIcon = this.getStatusIcon(report.overall)
    console.log(`${statusIcon} Overall Status: ${report.overall.toUpperCase()}`)
    console.log(`📊 Services: ${report.summary.healthy}/${report.summary.total} healthy`)
    console.log(`⏱️  Duration: ${report.duration}ms`)

    if (report.recommendations.length > 0) {
      console.log("\n💡 Recommendations:")
      report.recommendations.forEach((rec: string) => {
        console.log(`   • ${rec}`)
      })
    }
  }

  private displayTable(report: any): void {
    console.log("📋 Service Status Report")
    console.log("=".repeat(80))

    // Header
    const header = "Service".padEnd(15) + "Status".padEnd(12) + "Response".padEnd(12) + "Endpoint".padEnd(40)
    console.log(header)
    console.log("-".repeat(80))

    // Services
    report.services.forEach((service: any) => {
      const icon = this.getStatusIcon(service.status)
      const row =
        `${service.serviceName.toUpperCase()}`.padEnd(15) +
        `${icon} ${service.status}`.padEnd(12) +
        `${service.responseTime}ms`.padEnd(12) +
        service.endpoint.substring(0, 35)

      console.log(row)

      if (this.options.verbose && service.error) {
        console.log(`   ❌ Error: ${service.error}`)
      }
    })

    console.log("-".repeat(80))

    // Summary
    const statusIcon = this.getStatusIcon(report.overall)
    console.log(
      `${statusIcon} Overall: ${report.overall.toUpperCase()} | ` +
        `Healthy: ${report.summary.healthy}/${report.summary.total} | ` +
        `Duration: ${report.duration}ms`,
    )

    if (report.recommendations.length > 0) {
      console.log("\n💡 Recommendations:")
      report.recommendations.forEach((rec: string) => {
        console.log(`   • ${rec}`)
      })
    }
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case "healthy":
        return "✅"
      case "degraded":
        return "⚠️"
      case "unhealthy":
        return "❌"
      case "unreachable":
        return "🔌"
      case "critical":
        return "🚨"
      case "failed":
        return "💥"
      default:
        return "❓"
    }
  }

  private async saveReport(report: any, filename: string): Promise<void> {
    const fs = await import("fs/promises")
    const content = this.options.format === "json" ? JSON.stringify(report, null, 2) : this.formatReportAsText(report)

    await fs.writeFile(filename, content)
    console.log(`\n💾 Report saved to: ${filename}`)
  }

  private formatReportAsText(report: any): string {
    let output = `SupervIA Service Verification Report\n`
    output += `Generated: ${report.timestamp}\n`
    output += `Overall Status: ${report.overall.toUpperCase()}\n`
    output += `Duration: ${report.duration}ms\n\n`

    output += `Summary:\n`
    output += `- Total Services: ${report.summary.total}\n`
    output += `- Healthy: ${report.summary.healthy}\n`
    output += `- Degraded: ${report.summary.degraded}\n`
    output += `- Unhealthy: ${report.summary.unhealthy}\n`
    output += `- Unreachable: ${report.summary.unreachable}\n\n`

    output += `Service Details:\n`
    report.services.forEach((service: any) => {
      output += `- ${service.serviceName.toUpperCase()}: ${service.status} (${service.responseTime}ms)\n`
      if (service.error) {
        output += `  Error: ${service.error}\n`
      }
    })

    if (report.recommendations.length > 0) {
      output += `\nRecommendations:\n`
      report.recommendations.forEach((rec: string) => {
        output += `- ${rec}\n`
      })
    }

    return output
  }
}

// CLI argument parsing
const args = process.argv.slice(2)
const options: Partial<CliOptions> = {}

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "--format":
    case "-f":
      options.format = args[++i] as "json" | "table" | "summary"
      break
    case "--output":
    case "-o":
      options.output = args[++i]
      break
    case "--verbose":
    case "-v":
      options.verbose = true
      break
    case "--watch":
    case "-w":
      options.watch = true
      break
    case "--interval":
    case "-i":
      options.interval = Number.parseInt(args[++i]) * 1000
      break
    case "--help":
    case "-h":
      console.log(`
SupervIA Service Verification CLI

Usage: tsx scripts/verify-services.ts [options]

Options:
  -f, --format <type>     Output format: json, table, summary (default: table)
  -o, --output <file>     Save report to file
  -v, --verbose           Show detailed error information
  -w, --watch             Watch mode - continuous monitoring
  -i, --interval <sec>    Watch mode interval in seconds (default: 60)
  -h, --help              Show this help message

Examples:
  tsx scripts/verify-services.ts                    # Basic verification
  tsx scripts/verify-services.ts -f json -o report.json  # JSON output to file
  tsx scripts/verify-services.ts -w -i 30           # Watch mode every 30 seconds
  tsx scripts/verify-services.ts -v                 # Verbose output
      `)
      process.exit(0)
  }
}

// Run the CLI
const cli = new ServiceVerificationCLI(options)
cli.run().catch((error) => {
  console.error("❌ Verification failed:", error.message)
  process.exit(1)
})
