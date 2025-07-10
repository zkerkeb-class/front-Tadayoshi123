/**
 * Templates de métriques Prometheus pour les dashboards
 * Contient des configurations prêtes à l'emploi pour les graphiques
 */

import { DashboardBlock } from '../types/dashboard';

// Types de métriques courantes
export interface MetricTemplate {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'application' | 'network' | 'custom';
  queries: string[];
  config: Record<string, any>;
  defaultBlock: Omit<DashboardBlock, 'id' | 'position'>;
}

// Templates de métriques système
export const systemMetricsTemplates: MetricTemplate[] = [
  {
    id: 'cpu-usage',
    name: 'Utilisation CPU',
    description: 'Graphique de l\'utilisation CPU par instance',
    category: 'system',
    queries: [
      '100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)',
      'avg by (instance) (irate(node_cpu_seconds_total{mode="system"}[5m])) * 100',
      'avg by (instance) (irate(node_cpu_seconds_total{mode="user"}[5m])) * 100'
    ],
    config: {
      title: 'Utilisation CPU',
      showLegend: true,
      showGrid: true,
      colors: ['#ef4444', '#f59e0b', '#3b82f6'],
      yAxisLabel: 'Pourcentage (%)',
      timeRange: '1h',
      refreshInterval: 30,
      lineWidth: 2,
      smoothCurve: true,
    },
    defaultBlock: {
      type: 'line-chart',
      title: 'Utilisation CPU',
      description: 'Monitoring de l\'utilisation CPU en temps réel',
      category: 'charts',
      config: {
        metricQueries: [],
        title: 'Utilisation CPU',
        showLegend: true,
        showGrid: true,
        colors: ['#ef4444', '#f59e0b', '#3b82f6'],
        yAxisLabel: 'Pourcentage (%)',
        timeRange: '1h',
        refreshInterval: 30,
        lineWidth: 2,
        smoothCurve: true,
      }
    }
  },
  {
    id: 'memory-usage',
    name: 'Utilisation Mémoire',
    description: 'Graphique de l\'utilisation mémoire par instance',
    category: 'system',
    queries: [
      '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100',
      '(node_memory_Buffers_bytes / node_memory_MemTotal_bytes) * 100',
      '(node_memory_Cached_bytes / node_memory_MemTotal_bytes) * 100'
    ],
    config: {
      title: 'Utilisation Mémoire',
      showLegend: true,
      showGrid: true,
      colors: ['#10b981', '#06b6d4', '#8b5cf6'],
      yAxisLabel: 'Pourcentage (%)',
      timeRange: '1h',
      refreshInterval: 30,
    },
    defaultBlock: {
      type: 'line-chart',
      title: 'Utilisation Mémoire',
      description: 'Monitoring de l\'utilisation mémoire',
      category: 'charts',
      config: {
        metricQueries: [],
        title: 'Utilisation Mémoire',
        showLegend: true,
        showGrid: true,
        colors: ['#10b981', '#06b6d4', '#8b5cf6'],
        yAxisLabel: 'Pourcentage (%)',
        timeRange: '1h',
        refreshInterval: 30,
      }
    }
  },
  {
    id: 'disk-usage',
    name: 'Utilisation Disque',
    description: 'Répartition de l\'utilisation disque par filesystem',
    category: 'system',
    queries: [
      '(1 - (node_filesystem_avail_bytes{fstype!="tmpfs"} / node_filesystem_size_bytes{fstype!="tmpfs"})) * 100'
    ],
    config: {
      title: 'Utilisation Disque',
      showLegend: true,
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      refreshInterval: 60,
    },
    defaultBlock: {
      type: 'pie-chart',
      title: 'Utilisation Disque',
      description: 'Répartition de l\'espace disque utilisé',
      category: 'charts',
      config: {
        metricQueries: [],
        title: 'Utilisation Disque',
        showLegend: true,
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
        refreshInterval: 60,
      }
    }
  },
  {
    id: 'network-traffic',
    name: 'Trafic Réseau',
    description: 'Bande passante réseau par interface',
    category: 'network',
    queries: [
      'rate(node_network_receive_bytes_total{device!="lo"}[5m]) * 8',
      'rate(node_network_transmit_bytes_total{device!="lo"}[5m]) * 8'
    ],
    config: {
      title: 'Trafic Réseau',
      showLegend: true,
      showGrid: true,
      colors: ['#06b6d4', '#ec4899'],
      yAxisLabel: 'Bits par seconde',
      timeRange: '1h',
      refreshInterval: 30,
    },
    defaultBlock: {
      type: 'line-chart',
      title: 'Trafic Réseau',
      description: 'Bande passante réseau entrant et sortant',
      category: 'charts',
      config: {
        metricQueries: [],
        title: 'Trafic Réseau',
        showLegend: true,
        showGrid: true,
        colors: ['#06b6d4', '#ec4899'],
        yAxisLabel: 'Bits/s',
        timeRange: '1h',
        refreshInterval: 30,
      }
    }
  }
];

// Templates de métriques applicatives
export const applicationMetricsTemplates: MetricTemplate[] = [
  {
    id: 'http-requests',
    name: 'Requêtes HTTP',
    description: 'Taux de requêtes HTTP par code de statut',
    category: 'application',
    queries: [
      'rate(http_requests_total{code=~"2.."}[5m])',
      'rate(http_requests_total{code=~"4.."}[5m])',
      'rate(http_requests_total{code=~"5.."}[5m])'
    ],
    config: {
      title: 'Requêtes HTTP',
      showLegend: true,
      showGrid: true,
      colors: ['#10b981', '#f59e0b', '#ef4444'],
      yAxisLabel: 'Requêtes/sec',
      timeRange: '1h',
      refreshInterval: 15,
    },
    defaultBlock: {
      type: 'bar-chart',
      title: 'Requêtes HTTP',
      description: 'Taux de requêtes HTTP par code de statut',
      category: 'charts',
      config: {
        metricQueries: [],
        title: 'Requêtes HTTP',
        showLegend: true,
        showGrid: true,
        colors: ['#10b981', '#f59e0b', '#ef4444'],
        yAxisLabel: 'Req/s',
        timeRange: '1h',
        refreshInterval: 15,
      }
    }
  },
  {
    id: 'response-time',
    name: 'Temps de Réponse',
    description: 'Latence des requêtes HTTP (percentiles)',
    category: 'application',
    queries: [
      'histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))',
      'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))',
      'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))'
    ],
    config: {
      title: 'Temps de Réponse',
      showLegend: true,
      showGrid: true,
      colors: ['#3b82f6', '#f59e0b', '#ef4444'],
      yAxisLabel: 'Secondes',
      timeRange: '1h',
      refreshInterval: 30,
      smoothCurve: true,
    },
    defaultBlock: {
      type: 'line-chart',
      title: 'Temps de Réponse',
      description: 'Latence HTTP (P50, P95, P99)',
      category: 'charts',
      config: {
        metricQueries: [],
        title: 'Temps de Réponse',
        showLegend: true,
        showGrid: true,
        colors: ['#3b82f6', '#f59e0b', '#ef4444'],
        yAxisLabel: 'Secondes',
        timeRange: '1h',
        refreshInterval: 30,
        smoothCurve: true,
      }
    }
  },
  {
    id: 'database-connections',
    name: 'Connexions Base de Données',
    description: 'Pool de connexions à la base de données',
    category: 'application',
    queries: [
      'db_connections_active',
      'db_connections_idle',
      'db_connections_total'
    ],
    config: {
      title: 'Connexions DB',
      showLegend: true,
      showGrid: true,
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
      yAxisLabel: 'Connexions',
      timeRange: '1h',
      refreshInterval: 30,
    },
    defaultBlock: {
      type: 'line-chart',
      title: 'Connexions DB',
      description: 'État du pool de connexions',
      category: 'charts',
      config: {
        metricQueries: [],
        title: 'Connexions DB',
        showLegend: true,
        showGrid: true,
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
        yAxisLabel: 'Connexions',
        timeRange: '1h',
        refreshInterval: 30,
      }
    }
  }
];

// Templates de métriques réseau
export const networkMetricsTemplates: MetricTemplate[] = [
  {
    id: 'tcp-connections',
    name: 'Connexions TCP',
    description: 'État des connexions TCP par statut',
    category: 'network',
    queries: [
      'node_netstat_Tcp_CurrEstab',
      'node_netstat_Tcp_ActiveOpens',
      'node_netstat_Tcp_PassiveOpens'
    ],
    config: {
      title: 'Connexions TCP',
      showLegend: true,
      colors: ['#3b82f6', '#10b981', '#f59e0b'],
      refreshInterval: 30,
    },
    defaultBlock: {
      type: 'pie-chart',
      title: 'Connexions TCP',
      description: 'Répartition des connexions TCP',
      category: 'charts',
      config: {
        metricQueries: [],
        title: 'Connexions TCP',
        showLegend: true,
        colors: ['#3b82f6', '#10b981', '#f59e0b'],
        refreshInterval: 30,
      }
    }
  }
];

// Fonction pour récupérer tous les templates
export const getAllMetricsTemplates = (): MetricTemplate[] => {
  return [
    ...systemMetricsTemplates,
    ...applicationMetricsTemplates,
    ...networkMetricsTemplates,
  ];
};

// Fonction pour récupérer les templates par catégorie
export const getMetricsTemplatesByCategory = (category: string): MetricTemplate[] => {
  return getAllMetricsTemplates().filter(template => template.category === category);
};

// Fonction pour créer un bloc avec métriques
export const createBlockFromMetricsTemplate = (
  templateId: string,
  position: { x: number; y: number; w: number; h: number }
): DashboardBlock | null => {
  const template = getAllMetricsTemplates().find(t => t.id === templateId);
  if (!template) return null;

  const id = `${templateId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    ...template.defaultBlock,
    position,
    config: {
      ...template.defaultBlock.config,
      metricQueries: template.queries,
      ...template.config,
    },
  };
};

// Fonction pour appliquer un template de métrique à un bloc existant
export const applyMetricsTemplate = (
  block: DashboardBlock,
  templateId: string
): DashboardBlock => {
  const template = getAllMetricsTemplates().find(t => t.id === templateId);
  if (!template) return block;

  return {
    ...block,
    config: {
      ...block.config,
      metricQueries: template.queries,
      ...template.config,
    },
  };
}; 