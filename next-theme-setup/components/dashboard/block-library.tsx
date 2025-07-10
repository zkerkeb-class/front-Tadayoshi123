import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, PieChart, Gauge, Table, Text, Activity } from 'lucide-react';
import { DashboardBlockType } from '@/lib/types/dashboard';

interface BlockTemplate {
  type: DashboardBlockType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface BlockLibraryProps {
  onAddBlock: (type: DashboardBlockType) => void;
}

const blockTemplates: BlockTemplate[] = [
  {
    type: 'line-chart',
    title: 'Graphique Linéaire',
    description: 'Affiche des données sous forme de graphique linéaire',
    icon: <LineChart className="h-8 w-8 text-primary" />,
  },
  {
    type: 'bar-chart',
    title: 'Graphique à Barres',
    description: 'Affiche des données sous forme de graphique à barres',
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
  },
  {
    type: 'pie-chart',
    title: 'Graphique Circulaire',
    description: 'Affiche des données sous forme de graphique circulaire',
    icon: <PieChart className="h-8 w-8 text-primary" />,
  },
  {
    type: 'metric',
    title: 'Métrique',
    description: 'Affiche une métrique avec sa tendance',
    icon: <Activity className="h-8 w-8 text-primary" />,
  },
  {
    type: 'gauge',
    title: 'Jauge',
    description: 'Affiche une métrique sous forme de jauge',
    icon: <Gauge className="h-8 w-8 text-primary" />,
  },
  {
    type: 'table',
    title: 'Tableau',
    description: 'Affiche des données sous forme de tableau',
    icon: <Table className="h-8 w-8 text-primary" />,
  },
  {
    type: 'text',
    title: 'Texte',
    description: 'Affiche du texte formaté en Markdown',
    icon: <Text className="h-8 w-8 text-primary" />,
  },
];

export function BlockLibrary({ onAddBlock }: BlockLibraryProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Bibliothèque de Blocs</CardTitle>
        <CardDescription>
          Glissez-déposez ces blocs sur votre dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
          <div className="grid grid-cols-1 gap-4">
            {blockTemplates.map((template) => (
              <Card
                key={template.type}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onAddBlock(template.type)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-shrink-0">{template.icon}</div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{template.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ajouter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 