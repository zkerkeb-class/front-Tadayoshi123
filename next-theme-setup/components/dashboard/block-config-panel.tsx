import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardBlock } from '@/lib/types/dashboard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash } from 'lucide-react';

interface BlockConfigPanelProps {
  block: DashboardBlock;
  onUpdateBlock: (updatedBlock: DashboardBlock) => void;
  onDeleteBlock?: (blockId: string) => void;
}

export function BlockConfigPanel({ block, onUpdateBlock, onDeleteBlock }: BlockConfigPanelProps) {
  const handleChange = (field: string, value: any) => {
    onUpdateBlock({
      ...block,
      [field]: value,
    });
  };

  const handleConfigChange = (field: string, value: any) => {
    onUpdateBlock({
      ...block,
      config: {
        ...block.config,
        [field]: value,
      },
    });
  };

  const handleDataSourceChange = (field: string, value: any) => {
    onUpdateBlock({
      ...block,
      dataSource: {
        ...(block.dataSource || { type: 'static' }), // Ensure dataSource is not undefined
        [field]: value,
      },
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Configuration du Bloc</CardTitle>
        <CardDescription>
          {`Type: ${block.type}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="appearance">Apparence</TabsTrigger>
              <TabsTrigger value="data">Données</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={block.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Titre du bloc"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={block.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Description du bloc"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showTitle">Afficher le titre</Label>
                  <Switch
                    id="showTitle"
                    checked={block.config?.showTitle !== false}
                    onCheckedChange={(checked) => handleConfigChange('showTitle', checked)}
                  />
                </div>
              </div>
              
              {onDeleteBlock && (
                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={() => onDeleteBlock(block.id)}
                    className="w-full"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Supprimer le bloc
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="height">Hauteur (pixels)</Label>
                <Input
                  id="height"
                  type="number"
                  value={block.config?.height || 300}
                  onChange={(e) => handleConfigChange('height', parseInt(e.target.value))}
                />
              </div>
              
              {(block.type === 'line-chart' || block.type === 'bar-chart' || block.type === 'pie-chart') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="chartType">Type de graphique</Label>
                    <Select
                      value={block.config?.chartType || 'default'}
                      onValueChange={(value) => handleConfigChange('chartType', value)}
                    >
                      <SelectTrigger id="chartType">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Par défaut</SelectItem>
                        <SelectItem value="stacked">Empilé</SelectItem>
                        <SelectItem value="percentage">Pourcentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showLegend">Afficher la légende</Label>
                      <Switch
                        id="showLegend"
                        checked={block.config?.showLegend !== false}
                        onCheckedChange={(checked) => handleConfigChange('showLegend', checked)}
                      />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="data" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="dataType">Type de données</Label>
                <Select
                  value={block.dataSource?.type || 'static'}
                  onValueChange={(value) => handleDataSourceChange('type', value)}
                >
                  <SelectTrigger id="dataType">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Données statiques</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="prometheus">Prometheus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {block.dataSource?.type === 'api' && (
                <div className="space-y-2">
                  <Label htmlFor="endpoint">URL de l'API</Label>
                  <Input
                    id="endpoint"
                    value={block.dataSource?.endpoint || ''}
                    onChange={(e) => handleDataSourceChange('endpoint', e.target.value)}
                    placeholder="https://api.example.com/data"
                  />
                </div>
              )}
              
              {block.dataSource?.type === 'prometheus' && (
                <div className="space-y-2">
                  <Label htmlFor="query">Requête Prometheus</Label>
                  <Textarea
                    id="query"
                    value={block.dataSource?.query || ''}
                    onChange={(e) => handleDataSourceChange('query', e.target.value)}
                    placeholder="sum(rate(http_requests_total[5m])) by (service)"
                    rows={3}
                  />
                </div>
              )}
              
              {block.dataSource?.type === 'static' && (
                <div className="space-y-2">
                  <Label htmlFor="staticData">Données JSON</Label>
                  <Textarea
                    id="staticData"
                    value={typeof block.dataSource?.data === 'string' 
                      ? block.dataSource.data 
                      : JSON.stringify(block.dataSource?.data || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsedData = JSON.parse(e.target.value);
                        handleDataSourceChange('data', parsedData);
                      } catch {
                        handleDataSourceChange('data', e.target.value);
                      }
                    }}
                    placeholder='{"data": [...]}'
                    rows={6}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="refreshInterval">Intervalle de rafraîchissement (secondes)</Label>
                <Input
                  id="refreshInterval"
                  type="number"
                  value={block.dataSource?.refreshInterval || 60}
                  onChange={(e) => handleDataSourceChange('refreshInterval', parseInt(e.target.value))}
                />
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 