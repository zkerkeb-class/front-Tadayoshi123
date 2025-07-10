"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Activity, BarChart, LineChart, PieChart, Table, Gauge, 
  Network, HardDrive, Cpu, MemoryStick, Shield, Users, 
  TrendingUp, DollarSign, AlertTriangle, CheckCircle, X 
} from "lucide-react";

import type { DashboardLayout } from "@/lib/types/dashboard";
import { getDashboardTemplate } from "@/lib/dashboard/dashboard-templates";

// Interface pour un template de dashboard
interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: "infrastructure" | "application" | "business" | "security";
  preview: string;
  complexity: "simple" | "medium" | "advanced";
  blocks: number;
  icon: string;
  layout: DashboardLayout;
}

// Templates prédéfinis
const dashboardTemplates: DashboardTemplate[] = [
  {
    id: "infrastructure-basic",
    name: "Infrastructure de Base",
    description: "Surveillance des métriques essentielles du système",
    category: "infrastructure",
    preview: "CPU, Mémoire, Disque, Réseau",
    complexity: "simple",
    blocks: 4,
    icon: "Cpu",
    layout: getDashboardTemplate("infrastructure-basic"),
  },
  {
    id: "infrastructure-advanced",
    name: "Infrastructure Avancée",
    description: "Dashboard complet pour la surveillance d'infrastructure",
    category: "infrastructure",
    preview: "Métriques système, Alertes, Tendances, Capacité",
    complexity: "advanced",
    blocks: 8,
    icon: "Network",
    layout: getDashboardTemplate("infrastructure-advanced"),
  },
  {
    id: "application-monitoring",
    name: "Monitoring Application",
    description: "Surveillance des performances applicatives",
    category: "application",
    preview: "Temps de réponse, Taux d'erreur, Throughput",
    complexity: "medium",
    blocks: 6,
    icon: "Activity",
    layout: getDashboardTemplate("application-monitoring"),
  },
  {
    id: "business-metrics",
    name: "Métriques Business",
    description: "KPIs et métriques métier essentielles",
    category: "business",
    preview: "Revenus, Utilisateurs, Conversions, ROI",
    complexity: "medium",
    blocks: 6,
    icon: "TrendingUp",
    layout: getDashboardTemplate("business-metrics"),
  },
  {
    id: "security-overview",
    name: "Vue Sécurité",
    description: "Dashboard de surveillance sécuritaire",
    category: "security",
    preview: "Alertes sécurité, Événements, Compliance",
    complexity: "advanced",
    blocks: 7,
    icon: "Shield",
    layout: getDashboardTemplate("security-overview"),
  },
];

// Props du composant
interface TemplateSelectorProps {
  onTemplateSelect: (template: DashboardTemplate) => void;
  onClose?: () => void;
}

// Fonction pour obtenir l'icône correspondante
const getIcon = (iconName: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    Cpu,
    Network,
    Activity,
    TrendingUp,
    Shield,
    BarChart,
    LineChart,
    PieChart,
    Table,
    Gauge,
    HardDrive,
    MemoryStick,
    Users,
    DollarSign,
    AlertTriangle,
    CheckCircle,
  };
  
  const IconComponent = icons[iconName] || Activity;
  return <IconComponent className="h-8 w-8" />;
};

// Fonction pour obtenir la couleur du badge de complexité
const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case "simple":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

// Fonction pour obtenir la couleur du badge de catégorie
const getCategoryColor = (category: string) => {
  switch (category) {
    case "infrastructure":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "application":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "business":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    case "security":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

// Composant principal
export function TemplateSelector({ onTemplateSelect, onClose }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filtrage des templates par catégorie
  const filteredTemplates = dashboardTemplates.filter(
    (template) => selectedCategory === "all" || template.category === selectedCategory
  );

  // Catégories disponibles
  const categories = [
    { id: "all", name: "Tous", count: dashboardTemplates.length },
    { 
      id: "infrastructure", 
      name: "Infrastructure", 
      count: dashboardTemplates.filter(t => t.category === "infrastructure").length 
    },
    { 
      id: "application", 
      name: "Application", 
      count: dashboardTemplates.filter(t => t.category === "application").length 
    },
    { 
      id: "business", 
      name: "Business", 
      count: dashboardTemplates.filter(t => t.category === "business").length 
    },
    { 
      id: "security", 
      name: "Sécurité", 
      count: dashboardTemplates.filter(t => t.category === "security").length 
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header avec bouton de fermeture */}
      {onClose && (
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Templates de Dashboard</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Onglets de catégories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={selectedCategory} className="flex-1 mt-4 px-4 pb-4">
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="group cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border-2 hover:border-primary/50"
                  onClick={() => onTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getIcon(template.icon)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                            {template.name}
                          </CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getCategoryColor(template.category)}`}
                            >
                              {template.category}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getComplexityColor(template.complexity)}`}
                            >
                              {template.complexity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="text-sm mb-3 line-clamp-2">
                      {template.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        <strong>Contenu:</strong> {template.preview}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{template.blocks} blocs</span>
                        <span className="capitalize">{template.complexity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-medium mb-2">Aucun template trouvé</h3>
                <p className="text-muted-foreground">
                  Aucun template ne correspond à la catégorie sélectionnée.
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
} 