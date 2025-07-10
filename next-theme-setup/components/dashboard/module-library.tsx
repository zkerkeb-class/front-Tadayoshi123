import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Server, Activity, Network, Cpu } from 'lucide-react';
import { getAllMetricsTemplates, getMetricsTemplatesByCategory } from '@/lib/dashboard/metrics-templates';
import type { MetricTemplate } from '@/lib/dashboard/metrics-templates';

interface ModuleLibraryProps {
  onAddModule: (templateId: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  system: <Server className="h-6 w-6 text-primary" />,
  application: <Activity className="h-6 w-6 text-primary" />,
  network: <Network className="h-6 w-6 text-primary" />,
  default: <Cpu className="h-6 w-6 text-primary" />,
};

export function ModuleLibrary({ onAddModule }: ModuleLibraryProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const templates = getAllMetricsTemplates();
  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredModules = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
        <div className="p-1">
          <Input
            placeholder="Rechercher des modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="flex-1 mt-2">
          <TabsList className="grid grid-cols-4 mb-2">
             {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="capitalize text-xs">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-350px)] pr-4">
            <div className="grid grid-cols-1 gap-3">
              {filteredModules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun module trouvé
                </div>
              ) : (
                filteredModules.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                  >
                    <CardContent className="p-3 flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">{categoryIcons[template.category] || categoryIcons.default}</div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {template.description}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onAddModule(template.id)}
                        className="self-center"
                      >
                        Ajouter
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </div>
  );
} 