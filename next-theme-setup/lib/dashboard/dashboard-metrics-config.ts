/**
 * Configurations prédéfinies pour les dashboards de métriques
 * Ces templates peuvent être utilisés pour créer rapidement des dashboards de monitoring
 */

import { DashboardLayout, DashboardBlock } from "@/lib/types/dashboard";

// Template de dashboard pour le monitoring système
export const systemMonitoringDashboard: Omit<DashboardLayout, 'id'> = {
  name: "Monitoring Système",
  description: "Dashboard de monitoring système avec métriques CPU, mémoire, disque et réseau",
  blocks: [
    // En-tête avec texte explicatif
    {
      id: "header-text",
      type: "text",
      title: "Monitoring Système",
      description: "Informations textuelles",
      position: { x: 0, y: 0, w: 12, h: 2 },
      category: "text",
      config: {
        content: "# Dashboard de Monitoring Système\n\nCe dashboard affiche les métriques système principales pour surveiller la santé et les performances de votre infrastructure. Les données sont mises à jour automatiquement toutes les 30 secondes.",
        fontSize: "normal",
        textAlign: "left",
        theme: "accent",
        showBorder: true,
        padding: "normal"
      }
    },
    
    // Graphique d'utilisation CPU
    {
      id: "cpu-usage-chart",
      type: "line-chart",
      title: "Utilisation CPU",
      description: "Pourcentage d'utilisation CPU par instance",
      position: { x: 0, y: 2, w: 8, h: 4 },
      category: "charts",
      config: {
        metricQueries: [
          '100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)',
          'avg by (instance) (irate(node_cpu_seconds_total{mode="system"}[5m])) * 100',
          'avg by (instance) (irate(node_cpu_seconds_total{mode="user"}[5m])) * 100'
        ],
        title: "Utilisation CPU",
        showLegend: true,
        showGrid: true,
        colors: ['#ef4444', '#f59e0b', '#3b82f6'],
        yAxisLabel: "Pourcentage (%)",
        xAxisLabel: "Temps",
        timeRange: "1h",
        refreshInterval: 30,
        lineWidth: 2,
        smoothCurve: true,
        showDataPoints: false
      }
    },
    
    // Métriques CPU en valeur simple
    {
      id: "cpu-metric",
      type: "metric",
      title: "CPU Actuel",
      description: "Utilisation CPU actuelle",
      position: { x: 8, y: 2, w: 2, h: 2 },
      category: "metrics",
      config: {
        metricQueries: ['100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)'],
        title: "CPU",
        unit: "%",
        decimals: 1,
        showTrend: true,
        colorMode: "threshold",
        thresholds: "70,90",
        thresholdColors: ["#10b981", "#f59e0b", "#ef4444"],
        refreshInterval: 30,
        size: "large",
        textAlign: "center"
      }
    },
    
    // Jauge CPU
    {
      id: "cpu-gauge",
      type: "gauge",
      title: "CPU Gauge",
      description: "Jauge d'utilisation CPU",
      position: { x: 10, y: 2, w: 2, h: 2 },
      category: "metrics",
      config: {
        metricQueries: ['100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)'],
        title: "CPU",
        min: 0,
        max: 100,
        unit: "%",
        showValue: true,
        thresholds: "70,90",
        colors: ['#10b981', '#f59e0b', '#ef4444'],
        refreshInterval: 30,
        size: "medium",
        showMinMax: true
      }
    },
    
    // Graphique d'utilisation mémoire
    {
      id: "memory-usage-chart",
      type: "line-chart",
      title: "Utilisation Mémoire",
      description: "Pourcentage d'utilisation mémoire",
      position: { x: 0, y: 6, w: 6, h: 4 },
      category: "charts",
      config: {
        metricQueries: [
          '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100',
          '(node_memory_Buffers_bytes / node_memory_MemTotal_bytes) * 100',
          '(node_memory_Cached_bytes / node_memory_MemTotal_bytes) * 100'
        ],
        title: "Utilisation Mémoire",
        showLegend: true,
        showGrid: true,
        colors: ['#10b981', '#06b6d4', '#8b5cf6'],
        yAxisLabel: "Pourcentage (%)",
        xAxisLabel: "Temps",
        timeRange: "1h",
        refreshInterval: 30,
        lineWidth: 2
      }
    },
    
    // Graphique d'utilisation disque en camembert
    {
      id: "disk-usage-pie",
      type: "pie-chart",
      title: "Utilisation Disque",
      description: "Répartition de l'utilisation disque par filesystem",
      position: { x: 6, y: 6, w: 4, h: 4 },
      category: "charts",
      config: {
        metricQueries: [
          '(1 - (node_filesystem_avail_bytes{fstype!="tmpfs"} / node_filesystem_size_bytes{fstype!="tmpfs"})) * 100'
        ],
        title: "Utilisation Disque",
        showLegend: true,
        showLabels: true,
        showValues: true,
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
        donut: true,
        refreshInterval: 60,
        labelFormat: 'name-percent'
      }
    },
    
    // Métrique disque
    {
      id: "disk-metric",
      type: "metric",
      title: "Disque",
      description: "Espace disque utilisé",
      position: { x: 10, y: 6, w: 2, h: 2 },
      category: "metrics",
      config: {
        metricQueries: ['avg((1 - (node_filesystem_avail_bytes{fstype!="tmpfs"} / node_filesystem_size_bytes{fstype!="tmpfs"})) * 100)'],
        title: "Disque",
        unit: "%",
        decimals: 1,
        showTrend: false,
        colorMode: "threshold",
        thresholds: "70,90",
        thresholdColors: ["#10b981", "#f59e0b", "#ef4444"],
        refreshInterval: 60,
        size: "large",
        textAlign: "center"
      }
    },
    
    // Graphique de trafic réseau
    {
      id: "network-traffic-chart",
      type: "bar-chart",
      title: "Trafic Réseau",
      description: "Bande passante réseau par interface",
      position: { x: 0, y: 10, w: 6, h: 4 },
      category: "charts",
      config: {
        metricQueries: [
          'rate(node_network_receive_bytes_total{device!="lo"}[5m]) * 8 / 1024 / 1024',
          'rate(node_network_transmit_bytes_total{device!="lo"}[5m]) * 8 / 1024 / 1024'
        ],
        title: "Trafic Réseau",
        showLegend: true,
        showGrid: true,
        colors: ['#06b6d4', '#ec4899'],
        yAxisLabel: "Mbps",
        layout: 'vertical',
        stacked: false,
        timeRange: "5m",
        refreshInterval: 30
      }
    },
    
    // Informations système
    {
      id: "system-info",
      type: "text",
      title: "Informations Système",
      description: "Informations sur le système",
      position: { x: 6, y: 10, w: 6, h: 4 },
      category: "text",
      config: {
        content: "## Informations Système\n\n- **OS**: Linux\n- **Version**: 5.15.0\n- **Architecture**: x86_64\n- **Hostname**: server-prod-01\n\n## Ressources Système\n\n- **CPU**: 8 cores\n- **Mémoire**: 32 GB\n- **Disque**: 500 GB\n\n## Maintenance\n\nProchaine maintenance planifiée: **15 juin 2023**",
        fontSize: "normal",
        textAlign: "left"
      }
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isPublic: false,
  tags: ["system", "monitoring", "infrastructure"],
  category: "infrastructure",
  gridConfig: {
    cols: 12,
    rowHeight: 60,
    gap: 16,
    compactType: "vertical"
  }
};

// Template de dashboard pour le monitoring applicatif
export const applicationMonitoringDashboard: Omit<DashboardLayout, 'id'> = {
  name: "Monitoring Applicatif",
  description: "Dashboard de monitoring applicatif avec métriques HTTP, base de données et performances",
  blocks: [
    // En-tête avec texte explicatif
    {
      id: "header-text",
      type: "text",
      title: "Monitoring Applicatif",
      description: "Informations textuelles",
      position: { x: 0, y: 0, w: 12, h: 2 },
      category: "text",
      config: {
        content: "# Dashboard de Monitoring Applicatif\n\nCe dashboard affiche les métriques applicatives principales pour surveiller la santé et les performances de vos services. Les données sont mises à jour automatiquement.",
        fontSize: "normal",
        textAlign: "left",
        theme: "accent",
        showBorder: true,
        padding: "normal"
      }
    },
    
    // Graphique de requêtes HTTP
    {
      id: "http-requests-chart",
      type: "line-chart",
      title: "Requêtes HTTP",
      description: "Taux de requêtes HTTP par seconde",
      position: { x: 0, y: 2, w: 8, h: 4 },
      category: "charts",
      config: {
        metricQueries: [
          'rate(http_requests_total{code=~"2.."}[5m])',
          'rate(http_requests_total{code=~"4.."}[5m])',
          'rate(http_requests_total{code=~"5.."}[5m])'
        ],
        title: "Requêtes HTTP",
        showLegend: true,
        showGrid: true,
        colors: ['#10b981', '#f59e0b', '#ef4444'],
        yAxisLabel: "Requêtes/sec",
        xAxisLabel: "Temps",
        timeRange: "30m",
        refreshInterval: 15,
        lineWidth: 2,
        smoothCurve: false
      }
    },
    
    // Métriques de requêtes HTTP
    {
      id: "http-success-metric",
      type: "metric",
      title: "Succès HTTP",
      description: "Taux de requêtes HTTP réussies",
      position: { x: 8, y: 2, w: 2, h: 2 },
      category: "metrics",
      config: {
        metricQueries: ['sum(rate(http_requests_total{code=~"2.."}[5m]))'],
        title: "Succès",
        unit: "/s",
        decimals: 2,
        showTrend: true,
        colorMode: "fixed",
        color: "#10b981",
        refreshInterval: 15,
        size: "large",
        textAlign: "center"
      }
    },
    
    // Métriques d'erreurs HTTP
    {
      id: "http-error-metric",
      type: "metric",
      title: "Erreurs HTTP",
      description: "Taux de requêtes HTTP en erreur",
      position: { x: 10, y: 2, w: 2, h: 2 },
      category: "metrics",
      config: {
        metricQueries: ['sum(rate(http_requests_total{code=~"5.."}[5m]))'],
        title: "Erreurs",
        unit: "/s",
        decimals: 2,
        showTrend: true,
        colorMode: "threshold",
        thresholds: "0.1,1",
        thresholdColors: ["#10b981", "#f59e0b", "#ef4444"],
        refreshInterval: 15,
        size: "large",
        textAlign: "center"
      }
    },
    
    // Graphique de temps de réponse
    {
      id: "response-time-chart",
      type: "line-chart",
      title: "Temps de Réponse",
      description: "Latence des requêtes HTTP (percentiles)",
      position: { x: 0, y: 6, w: 6, h: 4 },
      category: "charts",
      config: {
        metricQueries: [
          'histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))',
          'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))',
          'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))'
        ],
        title: "Temps de Réponse",
        showLegend: true,
        showGrid: true,
        colors: ['#3b82f6', '#f59e0b', '#ef4444'],
        yAxisLabel: "Secondes",
        xAxisLabel: "Temps",
        timeRange: "30m",
        refreshInterval: 30,
        lineWidth: 2,
        smoothCurve: true
      }
    },
    
    // Graphique de connexions à la base de données
    {
      id: "db-connections-chart",
      type: "line-chart",
      title: "Connexions DB",
      description: "Pool de connexions à la base de données",
      position: { x: 6, y: 6, w: 6, h: 4 },
      category: "charts",
      config: {
        metricQueries: [
          'db_connections_active',
          'db_connections_idle',
          'db_connections_total'
        ],
        title: "Connexions DB",
        showLegend: true,
        showGrid: true,
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
        yAxisLabel: "Connexions",
        xAxisLabel: "Temps",
        timeRange: "1h",
        refreshInterval: 30,
        lineWidth: 2
      }
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isPublic: false,
  tags: ["application", "monitoring", "http", "database"],
  category: "application",
  gridConfig: {
    cols: 12,
    rowHeight: 60,
    gap: 16,
    compactType: "vertical"
  }
};

// Fonction pour créer un nouveau dashboard à partir d'un template
export const createDashboardFromTemplate = (
  template: Omit<DashboardLayout, 'id'>,
  userId?: string
): DashboardLayout => {
  const id = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    ...template,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}; 