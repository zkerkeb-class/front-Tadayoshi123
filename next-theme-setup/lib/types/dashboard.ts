/**
 * Types pour le système de dashboard
 * Architecture orientée vers la flexibilité et la facilité d'extension
 */

// Position et taille d'un élément dans la grille
export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
}

// Types de sources de données supportées
export type DataSourceType = 'prometheus' | 'grafana' | 'api' | 'static' | 'mock';

// Configuration de source de données
export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  url?: string;
  config: Record<string, any>;
}

// Cible de requête (ex: requête Prometheus)
export interface QueryTarget {
  datasource: string;
  expr: string;
  interval?: string;
  legendFormat?: string;
  refId: string;
}

// Types de blocs disponibles
export type DashboardBlockType = 
  | 'line-chart' 
  | 'bar-chart' 
  | 'pie-chart' 
  | 'gauge' 
  | 'metric' 
  | 'text' 
  | 'table'
  | 'status'
  | 'heatmap'
  | 'alert-list';

// Catégories de blocs
export type BlockCategory = 
  | 'charts' 
  | 'metrics' 
  | 'tables' 
  | 'text' 
  | 'status'
  | 'alerts';

// Layout pour les blocs
export interface DashboardBlockLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Source de données pour les blocs
export interface DashboardBlockDataSource {
  type: 'static' | 'api' | 'prometheus';
  endpoint?: string;
  query?: string;
  data?: any;
  refreshInterval?: number;
}

// Configuration des blocs
export interface DashboardBlockConfig {
  showTitle?: boolean;
  showLegend?: boolean;
  height?: number;
  chartType?: string;
  [key: string]: any;
}

// Style des blocs
export interface BlockStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
}

// Bloc de dashboard
export interface DashboardBlock {
  id: string;
  type: DashboardBlockType;
  title?: string;
  description?: string;
  position?: { x: number; y: number; w: number; h: number };
  layout?: DashboardBlockLayout;
  config?: DashboardBlockConfig;
  dataSource?: DashboardBlockDataSource;
  style?: BlockStyle;
  category?: BlockCategory;
}

// Template de bloc
export interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  type: DashboardBlockType;
  category: BlockCategory;
  icon: string;
  defaultConfig: Record<string, any>;
}

// Configuration de la grille du dashboard
export interface GridConfig {
  cols: number;
  rowHeight: number;
  gap: number;
  compactType: 'vertical' | 'horizontal' | null;
}

// Layout complet du dashboard
export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  blocks: DashboardBlock[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isPublic?: boolean;
  tags?: string[];
  category?: string;
  gridConfig: GridConfig;
  metadata?: Record<string, any>;
}

// Dashboard complet
export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  blocks: DashboardBlock[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isPublic?: boolean;
  tags?: string[];
}

// Message IA
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

// Suggestion IA
export interface AiSuggestion {
  id: string;
  prompt: string;
  blocks: DashboardBlock[];
  createdAt: string;
}

// Suggestion de blocs IA
export interface AIBlockSuggestion {
  blocks: Omit<DashboardBlock, 'id'>[];
  explanation: string;
}

// État du mode d'édition
export type EditorMode = 'edit' | 'view' | 'ai';

// Configuration d'un module (ensemble de blocs)
export interface DashboardModule {
  id: string;
  name: string;
  description: string;
  blocks: DashboardBlock[];
  category: string;
  tags: string[];
}

// Template de dashboard (pour la sélection de templates)
export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'infrastructure' | 'business' | 'analytics' | 'security';
  tags: string[];
  blocks: Omit<DashboardBlock, 'id'>[];
}

/**
 * Utilisateur de l'application
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  roles: ('USER' | 'ADMIN' | 'MODERATOR')[];
  dashboards?: Dashboard[];
  createdAt: string;
  updatedAt: string;
} 

/**
 * Représente une alerte générée par le système de monitoring.
 */
export interface Alert {
  id: string;
  service: string;
  alertName: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  value: number | string;
  threshold: number | string;
  firstTriggeredAt: string;
  lastTriggeredAt: string;
  count: number;
} 