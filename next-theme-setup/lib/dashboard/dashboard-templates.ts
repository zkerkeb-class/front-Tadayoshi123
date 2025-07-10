/**
 * Templates de dashboards
 * Définit des dashboards préconfigurés pour différents cas d'usage
 */

import { nanoid } from "nanoid";
import type { DashboardLayout } from "@/lib/types/dashboard";
import { DashboardTemplate } from "../types/dashboard";

// Fonction pour récupérer les dashboards par catégorie
export const getDashboardsByCategory = (category: string): DashboardLayout[] => {
  if (category === 'all') {
    return Object.values(availableTemplates);
  }
  return Object.values(availableTemplates).filter(template => template.category === category);
};

// Template de dashboard pour infrastructure de base
export const infrastructureBasicTemplate: DashboardLayout = {
  id: nanoid(),
  name: "Infrastructure de Base",
  description: "Dashboard de surveillance des métriques essentielles du système",
  category: "infrastructure",
  blocks: [
    {
      id: `block-${nanoid()}`,
      type: "gauge",
      title: "CPU Usage",
      description: "Utilisation du processeur en temps réel",
      position: { x: 0, y: 0, w: 3, h: 3 },
      config: {
        value: 45,
        max: 100,
        unit: "%",
        thresholds: { warning: 70, critical: 90 },
        color: "#3b82f6"
      },
      category: "metrics"
    },
    {
      id: `block-${nanoid()}`,
      type: "gauge",
      title: "Memory Usage",
      description: "Utilisation de la mémoire RAM",
      position: { x: 3, y: 0, w: 3, h: 3 },
      config: {
        value: 68,
        max: 100,
        unit: "%",
        thresholds: { warning: 80, critical: 95 },
        color: "#10b981"
      },
      category: "metrics"
    },
    {
      id: `block-${nanoid()}`,
      type: "line-chart",
      title: "Network Traffic",
      description: "Trafic réseau entrant et sortant",
      position: { x: 6, y: 0, w: 6, h: 3 },
      config: {
        data: [
          { time: "00:00", incoming: 45, outgoing: 32 },
          { time: "01:00", incoming: 52, outgoing: 28 },
          { time: "02:00", incoming: 48, outgoing: 35 },
          { time: "03:00", incoming: 61, outgoing: 42 },
          { time: "04:00", incoming: 55, outgoing: 38 },
        ],
        xKey: "time",
        yKeys: ["incoming", "outgoing"],
        colors: ["#3b82f6", "#ef4444"]
      },
      category: "charts"
    },
    {
      id: `block-${nanoid()}`,
      type: "bar-chart",
      title: "Disk Usage",
      description: "Utilisation des disques par partition",
      position: { x: 0, y: 3, w: 12, h: 3 },
      config: {
        data: [
          { name: "/", used: 45, available: 55 },
          { name: "/var", used: 78, available: 22 },
          { name: "/home", used: 32, available: 68 },
          { name: "/tmp", used: 12, available: 88 },
        ],
        xKey: "name",
        yKeys: ["used", "available"],
        colors: ["#f59e0b", "#10b981"]
      },
      category: "charts"
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  gridConfig: {
    cols: 12,
    rowHeight: 80,
    gap: 16,
    compactType: "vertical"
  }
};

// Template de dashboard pour infrastructure avancée
export const infrastructureAdvancedTemplate: DashboardLayout = {
  id: nanoid(),
  name: "Infrastructure Avancée",
  description: "Dashboard complet pour la surveillance d'infrastructure",
  category: "infrastructure",
  blocks: [
    {
      id: `block-${nanoid()}`,
      type: "status",
      title: "System Status",
      description: "État général du système",
      position: { x: 0, y: 0, w: 4, h: 2 },
      config: {
        status: "operational",
        message: "Tous les services fonctionnent normalement",
        lastCheck: new Date().toISOString()
      },
      category: "status"
    },
    {
      id: `block-${nanoid()}`,
      type: "gauge",
      title: "CPU",
      description: "Utilisation CPU",
      position: { x: 4, y: 0, w: 2, h: 2 },
      config: {
        value: 45,
        max: 100,
        unit: "%",
        thresholds: { warning: 70, critical: 90 },
        color: "#3b82f6"
      },
      category: "metrics"
    },
    {
      id: `block-${nanoid()}`,
      type: "gauge",
      title: "Memory",
      description: "Utilisation RAM",
      position: { x: 6, y: 0, w: 2, h: 2 },
      config: {
        value: 68,
        max: 100,
        unit: "%",
        thresholds: { warning: 80, critical: 95 },
        color: "#10b981"
      },
      category: "metrics"
    },
    {
      id: `block-${nanoid()}`,
      type: "gauge",
      title: "Disk",
      description: "Utilisation disque",
      position: { x: 8, y: 0, w: 2, h: 2 },
      config: {
        value: 55,
        max: 100,
        unit: "%",
        thresholds: { warning: 80, critical: 95 },
        color: "#f59e0b"
      },
      category: "metrics"
    },
    {
      id: `block-${nanoid()}`,
      type: "gauge",
      title: "Network",
      description: "Utilisation réseau",
      position: { x: 10, y: 0, w: 2, h: 2 },
      config: {
        value: 35,
        max: 100,
        unit: "%",
        thresholds: { warning: 70, critical: 90 },
        color: "#8b5cf6"
      },
      category: "metrics"
    },
    {
      id: `block-${nanoid()}`,
      type: "line-chart",
      title: "Performance Trends",
      description: "Tendances de performance système",
      position: { x: 0, y: 2, w: 8, h: 4 },
      config: {
        data: [
          { time: "00:00", cpu: 45, memory: 68, disk: 55 },
          { time: "04:00", cpu: 52, memory: 71, disk: 56 },
          { time: "08:00", cpu: 65, memory: 75, disk: 58 },
          { time: "12:00", cpu: 78, memory: 82, disk: 61 },
          { time: "16:00", cpu: 71, memory: 79, disk: 59 },
          { time: "20:00", cpu: 58, memory: 73, disk: 57 },
        ],
        xKey: "time",
        yKeys: ["cpu", "memory", "disk"],
        colors: ["#3b82f6", "#10b981", "#f59e0b"]
      },
      category: "charts"
    },
    {
      id: `block-${nanoid()}`,
      type: "alert-list",
      title: "Active Alerts",
      description: "Alertes actives du système",
      position: { x: 8, y: 2, w: 4, h: 4 },
      config: {
        alerts: [
          {
            id: "1",
            severity: "warning",
            message: "High CPU usage on server-01",
            timestamp: new Date(Date.now() - 30000).toISOString()
          },
          {
            id: "2",
            severity: "info",
            message: "Backup completed successfully",
            timestamp: new Date(Date.now() - 120000).toISOString()
          }
        ]
      },
      category: "status"
    },
    {
      id: `block-${nanoid()}`,
      type: "table",
      title: "Server List",
      description: "Liste des serveurs monitorés",
      position: { x: 0, y: 6, w: 12, h: 3 },
      config: {
        data: [
          { server: "web-01", status: "running", cpu: "45%", memory: "68%", uptime: "15d 4h" },
          { server: "web-02", status: "running", cpu: "52%", memory: "71%", uptime: "15d 4h" },
          { server: "db-01", status: "running", cpu: "78%", memory: "82%", uptime: "30d 12h" },
          { server: "cache-01", status: "running", cpu: "23%", memory: "45%", uptime: "8d 16h" },
        ],
        columns: [
          { key: "server", title: "Server" },
          { key: "status", title: "Status" },
          { key: "cpu", title: "CPU" },
          { key: "memory", title: "Memory" },
          { key: "uptime", title: "Uptime" }
        ]
      },
      category: "tables"
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  gridConfig: {
    cols: 12,
    rowHeight: 80,
    gap: 16,
    compactType: "vertical"
  }
};

// Template de dashboard pour monitoring d'application
export const applicationMonitoringTemplate: DashboardLayout = {
  id: nanoid(),
  name: "Application Monitoring",
  description: "Dashboard de surveillance des performances applicatives",
  category: "application",
  blocks: [
    {
      id: `block-${nanoid()}`,
      type: "line-chart",
      title: "Response Time",
      description: "Temps de réponse moyen des requêtes",
      position: { x: 0, y: 0, w: 6, h: 3 },
      config: {
        data: [
          { time: "00:00", response_time: 120 },
          { time: "01:00", response_time: 135 },
          { time: "02:00", response_time: 98 },
          { time: "03:00", response_time: 156 },
          { time: "04:00", response_time: 142 },
        ],
        xKey: "time",
        yKeys: ["response_time"],
        colors: ["#3b82f6"]
      },
      category: "charts"
    },
    {
      id: `block-${nanoid()}`,
      type: "bar-chart",
      title: "Request Rate",
      description: "Taux de requêtes par minute",
      position: { x: 6, y: 0, w: 6, h: 3 },
      config: {
        data: [
          { time: "00:00", requests: 450 },
          { time: "01:00", requests: 523 },
          { time: "02:00", requests: 398 },
          { time: "03:00", requests: 612 },
          { time: "04:00", requests: 478 },
        ],
        xKey: "time",
        yKeys: ["requests"],
        colors: ["#10b981"]
      },
      category: "charts"
    },
    {
      id: `block-${nanoid()}`,
      type: "pie-chart",
      title: "Error Distribution",
      description: "Répartition des erreurs par type",
      position: { x: 0, y: 3, w: 4, h: 3 },
      config: {
        data: [
          { name: "2xx Success", value: 85, color: "#10b981" },
          { name: "4xx Client Error", value: 12, color: "#f59e0b" },
          { name: "5xx Server Error", value: 3, color: "#ef4444" },
        ]
      },
      category: "charts"
    },
    {
      id: `block-${nanoid()}`,
      type: "gauge",
      title: "Availability",
      description: "Disponibilité du service",
      position: { x: 4, y: 3, w: 4, h: 3 },
      config: {
        value: 99.8,
        max: 100,
        unit: "%",
        thresholds: { warning: 99, critical: 95 },
        color: "#10b981"
      },
      category: "metrics"
    },
    {
      id: `block-${nanoid()}`,
      type: "table",
      title: "Top Endpoints",
      description: "Endpoints les plus utilisés",
      position: { x: 8, y: 3, w: 4, h: 3 },
      config: {
        data: [
          { endpoint: "/api/users", requests: 1245, avg_time: "145ms" },
          { endpoint: "/api/orders", requests: 856, avg_time: "234ms" },
          { endpoint: "/api/products", requests: 623, avg_time: "89ms" },
        ],
        columns: [
          { key: "endpoint", title: "Endpoint" },
          { key: "requests", title: "Requests" },
          { key: "avg_time", title: "Avg Time" }
        ]
      },
      category: "tables"
    },
    {
      id: `block-${nanoid()}`,
      type: "alert-list",
      title: "Application Alerts",
      description: "Alertes applicatives",
      position: { x: 0, y: 6, w: 12, h: 2 },
      config: {
        alerts: [
          {
            id: "1",
            severity: "warning",
            message: "High response time on /api/users endpoint",
            timestamp: new Date(Date.now() - 45000).toISOString()
          }
        ]
      },
      category: "status"
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  gridConfig: {
    cols: 12,
    rowHeight: 80,
    gap: 16,
    compactType: "vertical"
  }
};

// Template de dashboard pour métriques business
export const businessMetricsTemplate: DashboardLayout = {
  id: nanoid(),
  name: "Business Metrics",
  description: "Dashboard des KPIs et métriques métier essentielles",
  category: "business",
  blocks: [
    {
      id: `block-${nanoid()}`,
      type: "text",
      title: "Revenue Today",
      description: "Chiffre d'affaires du jour",
      position: { x: 0, y: 0, w: 3, h: 2 },
      config: {
        text: "€25,420",
        fontSize: "2xl",
        color: "#10b981",
        alignment: "center"
      },
      category: "text"
    },
    {
      id: `block-${nanoid()}`,
      type: "text",
      title: "Active Users",
      description: "Utilisateurs actifs",
      position: { x: 3, y: 0, w: 3, h: 2 },
      config: {
        text: "1,247",
        fontSize: "2xl",
        color: "#3b82f6",
        alignment: "center"
      },
      category: "text"
    },
    {
      id: `block-${nanoid()}`,
      type: "text",
      title: "Conversion Rate",
      description: "Taux de conversion",
      position: { x: 6, y: 0, w: 3, h: 2 },
      config: {
        text: "3.2%",
        fontSize: "2xl",
        color: "#f59e0b",
        alignment: "center"
      },
      category: "text"
    },
    {
      id: `block-${nanoid()}`,
      type: "text",
      title: "Orders",
      description: "Commandes du jour",
      position: { x: 9, y: 0, w: 3, h: 2 },
      config: {
        text: "89",
        fontSize: "2xl",
        color: "#8b5cf6",
        alignment: "center"
      },
      category: "text"
    },
    {
      id: `block-${nanoid()}`,
      type: "line-chart",
      title: "Revenue Trend",
      description: "Évolution du chiffre d'affaires",
      position: { x: 0, y: 2, w: 8, h: 4 },
      config: {
        data: [
          { date: "Jan", revenue: 18500, target: 20000 },
          { date: "Feb", revenue: 22300, target: 20000 },
          { date: "Mar", revenue: 19800, target: 20000 },
          { date: "Apr", revenue: 25400, target: 20000 },
          { date: "May", revenue: 21200, target: 20000 },
        ],
        xKey: "date",
        yKeys: ["revenue", "target"],
        colors: ["#10b981", "#ef4444"]
      },
      category: "charts"
    },
    {
      id: `block-${nanoid()}`,
      type: "pie-chart",
      title: "Traffic Sources",
      description: "Sources de trafic",
      position: { x: 8, y: 2, w: 4, h: 4 },
      config: {
        data: [
          { name: "Organic", value: 45, color: "#10b981" },
          { name: "Paid", value: 30, color: "#3b82f6" },
          { name: "Social", value: 15, color: "#f59e0b" },
          { name: "Direct", value: 10, color: "#8b5cf6" },
        ]
      },
      category: "charts"
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  gridConfig: {
    cols: 12,
    rowHeight: 80,
    gap: 16,
    compactType: "vertical"
  }
};

// Template de dashboard pour sécurité
export const securityOverviewTemplate: DashboardLayout = {
  id: nanoid(),
  name: "Security Overview",
  description: "Dashboard de surveillance sécuritaire",
  category: "security",
  blocks: [
    {
      id: `block-${nanoid()}`,
      type: "status",
      title: "Security Status",
      description: "État de sécurité global",
      position: { x: 0, y: 0, w: 6, h: 2 },
      config: {
        status: "warning",
        message: "3 alertes sécurité détectées",
        lastCheck: new Date().toISOString()
      },
      category: "status"
    },
    {
      id: `block-${nanoid()}`,
      type: "gauge",
      title: "Threat Level",
      description: "Niveau de menace",
      position: { x: 6, y: 0, w: 3, h: 2 },
      config: {
        value: 35,
        max: 100,
        unit: "%",
        thresholds: { warning: 50, critical: 80 },
        color: "#f59e0b"
      },
      category: "metrics"
    },
    {
      id: `block-${nanoid()}`,
      type: "gauge",
      title: "Compliance",
      description: "Score de conformité",
      position: { x: 9, y: 0, w: 3, h: 2 },
      config: {
        value: 87,
        max: 100,
        unit: "%",
        thresholds: { warning: 80, critical: 70 },
        color: "#10b981"
      },
      category: "metrics"
    },
    {
      id: `block-${nanoid()}`,
      type: "bar-chart",
      title: "Security Events",
      description: "Événements de sécurité par type",
      position: { x: 0, y: 2, w: 8, h: 3 },
      config: {
        data: [
          { type: "Failed Logins", count: 23 },
          { type: "Malware Detected", count: 5 },
          { type: "Suspicious IPs", count: 12 },
          { type: "Policy Violations", count: 8 },
        ],
        xKey: "type",
        yKeys: ["count"],
        colors: ["#ef4444"]
      },
      category: "charts"
    },
    {
      id: `block-${nanoid()}`,
      type: "alert-list",
      title: "Security Alerts",
      description: "Alertes de sécurité actives",
      position: { x: 8, y: 2, w: 4, h: 3 },
      config: {
        alerts: [
          {
            id: "1",
            severity: "critical",
            message: "Multiple failed login attempts",
            timestamp: new Date(Date.now() - 15000).toISOString()
          },
          {
            id: "2",
            severity: "warning",
            message: "Suspicious IP activity detected",
            timestamp: new Date(Date.now() - 60000).toISOString()
          }
        ]
      },
      category: "status"
    },
    {
      id: `block-${nanoid()}`,
      type: "table",
      title: "Recent Events",
      description: "Événements récents",
      position: { x: 0, y: 5, w: 12, h: 3 },
      config: {
        data: [
          { time: "14:23", event: "Failed login", ip: "192.168.1.100", user: "admin" },
          { time: "14:20", event: "Malware detected", ip: "10.0.1.45", user: "user123" },
          { time: "14:15", event: "Suspicious access", ip: "203.45.67.89", user: "guest" },
        ],
        columns: [
          { key: "time", title: "Time" },
          { key: "event", title: "Event" },
          { key: "ip", title: "IP Address" },
          { key: "user", title: "User" }
        ]
      },
      category: "tables"
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  gridConfig: {
    cols: 12,
    rowHeight: 80,
    gap: 16,
    compactType: "vertical"
  }
};

// Fonction pour obtenir un template par ID
export function getDashboardTemplate(templateId: string): DashboardLayout {
  switch (templateId) {
    case "infrastructure-basic":
      return infrastructureBasicTemplate;
    case "infrastructure-advanced":
      return infrastructureAdvancedTemplate;
    case "application-monitoring":
      return applicationMonitoringTemplate;
    case "business-metrics":
      return businessMetricsTemplate;
    case "security-overview":
      return securityOverviewTemplate;
    default:
      return infrastructureBasicTemplate; // Fallback vers le template de base
  }
}

// Export des templates disponibles
export const availableTemplates = {
  "infrastructure-basic": infrastructureBasicTemplate,
  "infrastructure-advanced": infrastructureAdvancedTemplate,
  "application-monitoring": applicationMonitoringTemplate,
  "business-metrics": businessMetricsTemplate,
  "security-overview": securityOverviewTemplate,
};

export type TemplateId = keyof typeof availableTemplates;

export const dashboardTemplates: DashboardTemplate[] = [
  {
    id: "server-overview",
    name: "Vue d'ensemble Serveur",
    description: "Dashboard complet pour surveiller les métriques serveur",
    category: "infrastructure",
    tags: ["serveur", "infrastructure", "performance"],
    blocks: [
      {
        type: "line-chart",
        title: "Utilisation CPU",
        description: "Évolution de l'utilisation CPU au fil du temps",
        layout: { x: 0, y: 0, w: 6, h: 4 },
        config: { showTitle: true, showLegend: true },
        dataSource: {
          type: "prometheus",
          query: 'avg(node_cpu_seconds_total{mode="idle"}) by (instance)',
          refreshInterval: 60,
        },
      },
      {
        type: "gauge",
        title: "Utilisation Mémoire",
        description: "Pourcentage d'utilisation de la mémoire",
        layout: { x: 6, y: 0, w: 3, h: 4 },
        config: { showTitle: true },
        dataSource: {
          type: "prometheus",
          query: "node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100",
          refreshInterval: 60,
        },
      },
      {
        type: "bar-chart",
        title: "Utilisation Disque",
        description: "Espace disque disponible par partition",
        layout: { x: 9, y: 0, w: 3, h: 4 },
        config: { showTitle: true },
        dataSource: {
          type: "prometheus",
          query: "node_filesystem_avail_bytes / node_filesystem_size_bytes * 100",
          refreshInterval: 60,
        },
      },
      {
        type: "table",
        title: "Processus Système",
        description: "Liste des processus système les plus gourmands",
        layout: { x: 0, y: 4, w: 12, h: 4 },
        config: { showTitle: true },
        dataSource: {
          type: "prometheus",
          query: "process_cpu_seconds_total",
          refreshInterval: 30,
        },
      },
    ],
  },
  {
    id: "application-performance",
    name: "Performance Application",
    description: "Surveillance des performances et de la disponibilité de l'application",
    category: "infrastructure",
    tags: ["application", "performance", "disponibilité"],
    blocks: [
      {
        type: "line-chart",
        title: "Temps de réponse",
        description: "Temps de réponse moyen de l'API",
        layout: { x: 0, y: 0, w: 6, h: 4 },
        config: { showTitle: true, showLegend: true },
        dataSource: {
          type: "prometheus",
          query: "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))",
          refreshInterval: 30,
        },
      },
      {
        type: "pie-chart",
        title: "Codes de statut HTTP",
        description: "Distribution des codes de statut HTTP",
        layout: { x: 6, y: 0, w: 6, h: 4 },
        config: { showTitle: true },
        dataSource: {
          type: "prometheus",
          query: "sum(rate(http_requests_total[5m])) by (status)",
          refreshInterval: 30,
        },
      },
      {
        type: "metric",
        title: "Requêtes par seconde",
        description: "Nombre de requêtes traitées par seconde",
        layout: { x: 0, y: 4, w: 3, h: 2 },
        config: { showTitle: true },
        dataSource: {
          type: "prometheus",
          query: "sum(rate(http_requests_total[5m]))",
          refreshInterval: 10,
        },
      },
      {
        type: "metric",
        title: "Taux d'erreur",
        description: "Pourcentage de requêtes en erreur",
        layout: { x: 3, y: 4, w: 3, h: 2 },
        config: { showTitle: true },
        dataSource: {
          type: "prometheus",
          query: "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) * 100",
          refreshInterval: 10,
        },
      },
      {
        type: "gauge",
        title: "Disponibilité",
        description: "Pourcentage de disponibilité du service",
        layout: { x: 6, y: 4, w: 6, h: 2 },
        config: { showTitle: true },
        dataSource: {
          type: "prometheus",
          query: "avg_over_time(up{job=\"api\"}[24h]) * 100",
          refreshInterval: 60,
        },
      },
    ],
  },
  {
    id: "security-monitoring",
    name: "Surveillance Sécurité",
    description: "Suivi des événements de sécurité et des vulnérabilités",
    category: "security",
    tags: ["sécurité", "alertes", "audit"],
    blocks: [
      {
        type: "table",
        title: "Tentatives de connexion échouées",
        description: "Liste des tentatives de connexion échouées",
        layout: { x: 0, y: 0, w: 12, h: 4 },
        config: { showTitle: true },
        dataSource: {
          type: "prometheus",
          query: "auth_failures_total",
          refreshInterval: 30,
        },
      },
      {
        type: "bar-chart",
        title: "Événements de sécurité par type",
        description: "Distribution des événements de sécurité par type",
        layout: { x: 0, y: 4, w: 6, h: 4 },
        config: { showTitle: true },
        dataSource: {
          type: "prometheus",
          query: "sum(security_events_total) by (type)",
          refreshInterval: 60,
        },
      },
      {
        type: "pie-chart",
        title: "Vulnérabilités par sévérité",
        description: "Distribution des vulnérabilités par niveau de sévérité",
        layout: { x: 6, y: 4, w: 6, h: 4 },
        config: { showTitle: true },
        dataSource: {
          type: "prometheus",
          query: "sum(vulnerabilities_total) by (severity)",
          refreshInterval: 300,
        },
      },
    ],
  },
  {
    id: "user-analytics",
    name: "Analytique Utilisateurs",
    description: "Analyse du comportement et de l'activité des utilisateurs",
    category: "business",
    tags: ["utilisateurs", "analytics", "business"],
    blocks: [
      {
        type: "line-chart",
        title: "Sessions utilisateurs",
        description: "Nombre de sessions utilisateurs actives",
        layout: { x: 0, y: 0, w: 6, h: 4 },
        config: { showTitle: true },
        dataSource: {
          type: "api",
          endpoint: "/api/analytics/sessions",
          refreshInterval: 300,
        },
      },
      {
        type: "pie-chart",
        title: "Répartition des utilisateurs",
        description: "Répartition des utilisateurs par rôle",
        layout: { x: 6, y: 0, w: 6, h: 4 },
        config: { showTitle: true },
        dataSource: {
          type: "api",
          endpoint: "/api/analytics/users/distribution",
          refreshInterval: 300,
        },
      },
      {
        type: "bar-chart",
        title: "Actions utilisateurs",
        description: "Nombre d'actions par type",
        layout: { x: 0, y: 4, w: 12, h: 4 },
        config: { showTitle: true },
        dataSource: {
          type: "api",
          endpoint: "/api/analytics/actions",
          refreshInterval: 60,
        },
      },
    ],
  },
]; 