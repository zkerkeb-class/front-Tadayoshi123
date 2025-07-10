/**
 * Templates de blocs pour le dashboard
 * Définit tous les types de blocs disponibles avec leurs configurations par défaut
 */

import { BlockTemplate, BlockType, BlockCategory } from '../types/dashboard';

// Fonction pour récupérer les blocs par catégorie
export const getBlocksByCategory = (category: BlockCategory | 'all'): BlockTemplate[] => {
  if (category === 'all') {
    return blockTemplates;
  }
  return blockTemplates.filter(template => template.category === category);
};

// Fonction pour récupérer un template de bloc par son ID
export const getBlockTemplate = (type: BlockType): BlockTemplate | undefined => {
  return blockTemplates.find(template => template.id === type);
};

// Liste des templates de blocs disponibles
export const blockTemplates: BlockTemplate[] = [
  // CHARTS
  {
    id: 'line-chart',
    name: 'Line Chart',
    description: 'Affiche des données sous forme de lignes pour visualiser les tendances au fil du temps',
    type: 'line-chart',
    category: 'charts',
    icon: 'LineChart',
    defaultSize: { w: 6, h: 4 },
    configSchema: {
      title: {
        type: 'string',
        label: 'Titre',
        default: 'Line Chart',
        category: 'General',
      },
      showLegend: {
        type: 'boolean',
        label: 'Afficher la légende',
        default: true,
        category: 'Display',
      },
      showGrid: {
        type: 'boolean',
        label: 'Afficher la grille',
        default: true,
        category: 'Display',
      },
      colors: {
        type: 'color',
        label: 'Couleurs',
        default: ['#3b82f6', '#10b981', '#f59e0b'],
        category: 'Style',
      },
      yAxisLabel: {
        type: 'string',
        label: 'Label axe Y',
        default: '',
        category: 'Axes',
      },
      xAxisLabel: {
        type: 'string',
        label: 'Label axe X',
        default: '',
        category: 'Axes',
      },
      dataPoints: {
        type: 'number',
        label: 'Nombre de points',
        default: 20,
        min: 5,
        max: 100,
        step: 1,
        category: 'Data',
      },
      lineWidth: {
        type: 'number',
        label: 'Épaisseur des lignes',
        default: 2,
        min: 1,
        max: 10,
        step: 1,
        category: 'Style',
      },
      smoothCurve: {
        type: 'boolean',
        label: 'Courbes lissées',
        default: false,
        category: 'Style',
      },
    },
    defaultConfig: {
      title: 'Line Chart',
      showLegend: true,
      showGrid: true,
      colors: ['#3b82f6', '#10b981', '#f59e0b'],
      dataPoints: 20,
      lineWidth: 2,
      smoothCurve: false,
    },
  },
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    description: 'Affiche des données sous forme de barres pour comparer des valeurs',
    type: 'bar-chart',
    category: 'charts',
    icon: 'BarChart',
    defaultSize: { w: 6, h: 4 },
    configSchema: {
      title: {
        type: 'string',
        label: 'Titre',
        default: 'Bar Chart',
        category: 'General',
      },
      showLegend: {
        type: 'boolean',
        label: 'Afficher la légende',
        default: true,
        category: 'Display',
      },
      showGrid: {
        type: 'boolean',
        label: 'Afficher la grille',
        default: true,
        category: 'Display',
      },
      colors: {
        type: 'color',
        label: 'Couleurs',
        default: ['#3b82f6', '#10b981', '#f59e0b'],
        category: 'Style',
      },
      layout: {
        type: 'select',
        label: 'Orientation',
        default: 'vertical',
        options: [
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' },
        ],
        category: 'Layout',
      },
      dataPoints: {
        type: 'number',
        label: 'Nombre de points',
        default: 10,
        min: 3,
        max: 50,
        step: 1,
        category: 'Data',
      },
      stacked: {
        type: 'boolean',
        label: 'Barres empilées',
        default: false,
        category: 'Layout',
      },
    },
    defaultConfig: {
      title: 'Bar Chart',
      showLegend: true,
      showGrid: true,
      colors: ['#3b82f6', '#10b981', '#f59e0b'],
      layout: 'vertical',
      dataPoints: 10,
      stacked: false,
    },
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    description: 'Affiche des données sous forme de camembert pour visualiser des proportions',
    type: 'pie-chart',
    category: 'charts',
    icon: 'PieChart',
    defaultSize: { w: 4, h: 4 },
    configSchema: {
      title: {
        type: 'string',
        label: 'Titre',
        default: 'Pie Chart',
        category: 'General',
      },
      showLegend: {
        type: 'boolean',
        label: 'Afficher la légende',
        default: true,
        category: 'Display',
      },
      showLabels: {
        type: 'boolean',
        label: 'Afficher les étiquettes',
        default: true,
        category: 'Display',
      },
      showValues: {
        type: 'boolean',
        label: 'Afficher les valeurs',
        default: true,
        category: 'Display',
      },
      colors: {
        type: 'color',
        label: 'Couleurs',
        default: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
        category: 'Style',
      },
      donut: {
        type: 'boolean',
        label: 'Afficher en donut',
        default: false,
        category: 'Style',
      },
      dataPoints: {
        type: 'number',
        label: 'Nombre de segments',
        default: 5,
        min: 2,
        max: 10,
        step: 1,
        category: 'Data',
      },
    },
    defaultConfig: {
      title: 'Pie Chart',
      showLegend: true,
      showLabels: true,
      showValues: true,
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      donut: false,
      dataPoints: 5,
    },
  },

  // METRICS
  {
    id: 'gauge',
    name: 'Gauge',
    description: 'Affiche une valeur unique sous forme de jauge',
    type: 'gauge',
    category: 'metrics',
    icon: 'Gauge',
    defaultSize: { w: 3, h: 3 },
    configSchema: {
      title: {
        type: 'string',
        label: 'Titre',
        default: 'Gauge',
        category: 'General',
      },
      min: {
        type: 'number',
        label: 'Valeur minimum',
        default: 0,
        category: 'Scale',
      },
      max: {
        type: 'number',
        label: 'Valeur maximum',
        default: 100,
        category: 'Scale',
      },
      value: {
        type: 'number',
        label: 'Valeur',
        default: 75,
        category: 'Data',
      },
      unit: {
        type: 'string',
        label: 'Unité',
        default: '%',
        category: 'Display',
      },
      showValue: {
        type: 'boolean',
        label: 'Afficher la valeur',
        default: true,
        category: 'Display',
      },
      thresholds: {
        type: 'string',
        label: 'Seuils (format: "warning,critical")',
        default: '70,90',
        category: 'Thresholds',
      },
      colors: {
        type: 'color',
        label: 'Couleurs',
        default: ['#10b981', '#f59e0b', '#ef4444'],
        category: 'Style',
      },
    },
    defaultConfig: {
      title: 'Gauge',
      min: 0,
      max: 100,
      value: 75,
      unit: '%',
      showValue: true,
      thresholds: '70,90',
      colors: ['#10b981', '#f59e0b', '#ef4444'],
    },
  },
  {
    id: 'metric',
    name: 'Metric',
    description: 'Affiche une valeur métrique simple avec titre et tendance',
    type: 'metric',
    category: 'metrics',
    icon: 'Activity',
    defaultSize: { w: 2, h: 2 },
    configSchema: {
      title: {
        type: 'string',
        label: 'Titre',
        default: 'Metric',
        category: 'General',
      },
      value: {
        type: 'string',
        label: 'Valeur',
        default: '75',
        category: 'Data',
      },
      unit: {
        type: 'string',
        label: 'Unité',
        default: '%',
        category: 'Display',
      },
      prefix: {
        type: 'string',
        label: 'Préfixe',
        default: '',
        category: 'Display',
      },
      decimals: {
        type: 'number',
        label: 'Décimales',
        default: 0,
        min: 0,
        max: 5,
        step: 1,
        category: 'Display',
      },
      showTrend: {
        type: 'boolean',
        label: 'Afficher la tendance',
        default: true,
        category: 'Display',
      },
      trendValue: {
        type: 'number',
        label: 'Valeur de tendance',
        default: 5,
        category: 'Data',
      },
      colorMode: {
        type: 'select',
        label: 'Mode de couleur',
        default: 'value',
        options: [
          { label: 'Par valeur', value: 'value' },
          { label: 'Par tendance', value: 'trend' },
          { label: 'Fixe', value: 'fixed' },
        ],
        category: 'Style',
      },
      color: {
        type: 'color',
        label: 'Couleur',
        default: '#3b82f6',
        category: 'Style',
      },
    },
    defaultConfig: {
      title: 'Metric',
      value: '75',
      unit: '%',
      prefix: '',
      decimals: 0,
      showTrend: true,
      trendValue: 5,
      colorMode: 'value',
      color: '#3b82f6',
    },
  },

  // TABLES
  {
    id: 'table',
    name: 'Table',
    description: 'Affiche des données sous forme de tableau avec colonnes personnalisables',
    type: 'table',
    category: 'tables',
    icon: 'Table',
    defaultSize: { w: 6, h: 4 },
    configSchema: {
      title: {
        type: 'string',
        label: 'Titre',
        default: 'Table',
        category: 'General',
      },
      columns: {
        type: 'string',
        label: 'Colonnes (séparées par des virgules)',
        default: 'Name,Value,Status',
        category: 'Columns',
      },
      pageSize: {
        type: 'number',
        label: 'Lignes par page',
        default: 10,
        min: 5,
        max: 50,
        step: 5,
        category: 'Pagination',
      },
      showPagination: {
        type: 'boolean',
        label: 'Afficher la pagination',
        default: true,
        category: 'Pagination',
      },
      sortable: {
        type: 'boolean',
        label: 'Colonnes triables',
        default: true,
        category: 'Features',
      },
      filterable: {
        type: 'boolean',
        label: 'Filtrable',
        default: true,
        category: 'Features',
      },
      striped: {
        type: 'boolean',
        label: 'Lignes alternées',
        default: true,
        category: 'Style',
      },
      bordered: {
        type: 'boolean',
        label: 'Bordures',
        default: true,
        category: 'Style',
      },
    },
    defaultConfig: {
      title: 'Table',
      columns: 'Name,Value,Status',
      pageSize: 10,
      showPagination: true,
      sortable: true,
      filterable: true,
      striped: true,
      bordered: true,
    },
  },

  // STATUS
  {
    id: 'status',
    name: 'Status',
    description: 'Affiche le statut d\'un service ou d\'un composant',
    type: 'status',
    category: 'status',
    icon: 'CheckCircle',
    defaultSize: { w: 2, h: 1 },
    configSchema: {
      title: {
        type: 'string',
        label: 'Titre',
        default: 'Service Status',
        category: 'General',
      },
      status: {
        type: 'select',
        label: 'Statut',
        default: 'healthy',
        options: [
          { label: 'Healthy', value: 'healthy' },
          { label: 'Warning', value: 'warning' },
          { label: 'Critical', value: 'critical' },
          { label: 'Unknown', value: 'unknown' },
        ],
        category: 'Status',
      },
      showIcon: {
        type: 'boolean',
        label: 'Afficher l\'icône',
        default: true,
        category: 'Display',
      },
      showText: {
        type: 'boolean',
        label: 'Afficher le texte',
        default: true,
        category: 'Display',
      },
      showTimestamp: {
        type: 'boolean',
        label: 'Afficher l\'horodatage',
        default: true,
        category: 'Display',
      },
    },
    defaultConfig: {
      title: 'Service Status',
      status: 'healthy',
      showIcon: true,
      showText: true,
      showTimestamp: true,
    },
  },

  // TEXT
  {
    id: 'text',
    name: 'Text',
    description: 'Bloc de texte simple avec support Markdown',
    type: 'text',
    category: 'text',
    icon: 'Text',
    defaultSize: { w: 4, h: 2 },
    configSchema: {
      title: {
        type: 'string',
        label: 'Titre',
        default: 'Text',
        category: 'General',
      },
      content: {
        type: 'string',
        label: 'Contenu (Markdown supporté)',
        default: 'Entrez votre texte ici...',
        category: 'Content',
      },
      fontSize: {
        type: 'select',
        label: 'Taille de police',
        default: 'normal',
        options: [
          { label: 'Petit', value: 'small' },
          { label: 'Normal', value: 'normal' },
          { label: 'Grand', value: 'large' },
        ],
        category: 'Style',
      },
      textAlign: {
        type: 'select',
        label: 'Alignement',
        default: 'left',
        options: [
          { label: 'Gauche', value: 'left' },
          { label: 'Centre', value: 'center' },
          { label: 'Droite', value: 'right' },
        ],
        category: 'Style',
      },
    },
    defaultConfig: {
      title: 'Text',
      content: 'Entrez votre texte ici...',
      fontSize: 'normal',
      textAlign: 'left',
    },
  },

  // ALERTS
  {
    id: 'alert-list',
    name: 'Alert List',
    description: 'Liste des alertes actives avec filtrage par sévérité',
    type: 'alert-list',
    category: 'status',
    icon: 'AlertTriangle',
    defaultSize: { w: 6, h: 4 },
    configSchema: {
      title: {
        type: 'string',
        label: 'Titre',
        default: 'Active Alerts',
        category: 'General',
      },
      maxItems: {
        type: 'number',
        label: 'Nombre maximum d\'alertes',
        default: 10,
        min: 1,
        max: 50,
        step: 1,
        category: 'Display',
      },
      showSeverity: {
        type: 'boolean',
        label: 'Afficher la sévérité',
        default: true,
        category: 'Display',
      },
      showTimestamp: {
        type: 'boolean',
        label: 'Afficher l\'horodatage',
        default: true,
        category: 'Display',
      },
      showSource: {
        type: 'boolean',
        label: 'Afficher la source',
        default: true,
        category: 'Display',
      },
      severityFilter: {
        type: 'string',
        label: 'Filtre de sévérité (séparées par des virgules)',
        default: 'critical,warning,info',
        category: 'Filter',
      },
      refreshInterval: {
        type: 'number',
        label: 'Intervalle de rafraîchissement (secondes)',
        default: 30,
        min: 5,
        max: 300,
        step: 5,
        category: 'Data',
      },
    },
    defaultConfig: {
      title: 'Active Alerts',
      maxItems: 10,
      showSeverity: true,
      showTimestamp: true,
      showSource: true,
      severityFilter: 'critical,warning,info',
      refreshInterval: 30,
    },
  },
]; 