import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search } from '@/components/ui/search';
import { Server, Activity, Shield, Users, Database, AlertTriangle, Clock } from 'lucide-react';

// Types pour les templates
interface DashboardTemplate {
  id: string;
  title: string;
  description: string;
  category: 'infrastructure' | 'application' | 'security' | 'business' | 'custom';
  icon: React.ReactNode;
  tags: string[];
  preview?: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  onClose: () => void;
}

// Templates prédéfinis
const dashboardTemplates: DashboardTemplate[] = [
  {
    id: 'server-overview',
    title: 'Vue d\'ensemble Serveur',
    description: 'Dashboard complet pour surveiller les métriques serveur',
    category: 'infrastructure',
    icon: <Server className="h-8 w-8 text-primary" />,
    tags: ['serveur', 'infrastructure', 'performance'],
    preview: '/templates/server-overview.png',
  },
  {
    id: 'application-performance',
    title: 'Performance Application',
    description: 'Surveillance des performances et de la disponibilité de l\'application',
    category: 'application',
    icon: <Activity className="h-8 w-8 text-primary" />,
    tags: ['application', 'performance', 'disponibilité'],
    preview: '/templates/app-performance.png',
  },
  {
    id: 'security-monitoring',
    title: 'Surveillance Sécurité',
    description: 'Suivi des événements de sécurité et des vulnérabilités',
    category: 'security',
    icon: <Shield className="h-8 w-8 text-primary" />,
    tags: ['sécurité', 'alertes', 'audit'],
    preview: '/templates/security-monitoring.png',
  },
  {
    id: 'user-analytics',
    title: 'Analytique Utilisateurs',
    description: 'Analyse du comportement et de l\'activité des utilisateurs',
    category: 'business',
    icon: <Users className="h-8 w-8 text-primary" />,
    tags: ['utilisateurs', 'analytics', 'business'],
    preview: '/templates/user-analytics.png',
  },
  {
    id: 'database-monitoring',
    title: 'Surveillance Base de Données',
    description: 'Métriques et performances de la base de données',
    category: 'infrastructure',
    icon: <Database className="h-8 w-8 text-primary" />,
    tags: ['base de données', 'performance', 'infrastructure'],
    preview: '/templates/database-monitoring.png',
  },
  {
    id: 'alerts-dashboard',
    title: 'Tableau de Bord Alertes',
    description: 'Vue centralisée de toutes les alertes système',
    category: 'application',
    icon: <AlertTriangle className="h-8 w-8 text-primary" />,
    tags: ['alertes', 'monitoring', 'incidents'],
    preview: '/templates/alerts-dashboard.png',
  },
  {
    id: 'sla-monitoring',
    title: 'Surveillance SLA',
    description: 'Suivi des SLA et de la disponibilité des services',
    category: 'business',
    icon: <Clock className="h-8 w-8 text-primary" />,
    tags: ['disponibilité', 'uptime', 'SLA'],
    preview: '/templates/sla-monitoring.png',
  },
];

export function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  // Filtrer les templates en fonction de la recherche et de la catégorie
  const filteredTemplates = dashboardTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Sélectionner un Template</CardTitle>
        <CardDescription>
          Choisissez un template pour démarrer rapidement votre dashboard
        </CardDescription>
        <div className="mt-2">
          <Search
            placeholder="Rechercher des templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="custom">Personnalisé</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground col-span-2">
                  Aucun template ne correspond à votre recherche
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => onSelectTemplate(template.id)}
                  >
                    <CardContent className="p-4 pt-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0">{template.icon}</div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{template.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      
                      {template.preview && (
                        <div className="aspect-video bg-muted rounded-md overflow-hidden mb-4">
                          <div className="w-full h-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                            Aperçu du template
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="default" onClick={() => onSelectTemplate('blank')}>
          Créer un dashboard vide
        </Button>
      </CardFooter>
    </Card>
  );
} 