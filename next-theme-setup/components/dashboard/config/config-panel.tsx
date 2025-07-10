"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "@/components/ui/color-picker";
import type { DashboardBlock, DataSource } from "@/lib/types/dashboard";
import { getBlockTemplate } from "@/lib/dashboard/block-templates";
import { X, Save, Palette, Settings, Database, Layout } from "lucide-react";

interface ConfigPanelProps {
  block: DashboardBlock;
  onUpdate: (updates: Partial<DashboardBlock>) => void;
  onClose: () => void;
}

export function ConfigPanel({ block, onUpdate, onClose }: ConfigPanelProps) {
  // États locaux pour les modifications
  const [localConfig, setLocalConfig] = useState(block.config);
  const [localTitle, setLocalTitle] = useState(block.title);
  const [localDescription, setLocalDescription] = useState(block.description || "");
  const [localStyle, setLocalStyle] = useState(block.style || {});
  const [activeTab, setActiveTab] = useState("config");

  // Récupérer le template du bloc pour accéder au schéma de configuration
  const template = getBlockTemplate(block.type);

  // Mise à jour des états locaux lorsque le bloc change
  useEffect(() => {
    setLocalConfig(block.config);
    setLocalTitle(block.title);
    setLocalDescription(block.description || "");
    setLocalStyle(block.style || {});
  }, [block]);

  // Sauvegarder les modifications et fermer le panneau
  const handleSave = () => {
    onUpdate({
      title: localTitle,
      description: localDescription,
      config: localConfig,
      style: localStyle,
    });
    onClose();
  };

  // Rendu d'un champ de configuration en fonction de son type
  const renderConfigField = (key: string, schema: any) => {
    const value = localConfig[key] ?? schema.default;

    switch (schema.type) {
      case "string":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{schema.label}</Label>
            {key === "content" ? (
              <Textarea
                id={key}
                value={value}
                onChange={(e) => setLocalConfig((prev) => ({ ...prev, [key]: e.target.value }))}
                rows={4}
              />
            ) : (
              <Input
                id={key}
                value={value}
                onChange={(e) => setLocalConfig((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            )}
            {schema.description && (
              <p className="text-xs text-muted-foreground">{schema.description}</p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{schema.label}</Label>
            <Input
              id={key}
              type="number"
              value={value}
              min={schema.min}
              max={schema.max}
              step={schema.step || 1}
              onChange={(e) => setLocalConfig((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
            />
            {schema.description && (
              <p className="text-xs text-muted-foreground">{schema.description}</p>
            )}
          </div>
        );

      case "boolean":
        return (
          <div key={key} className="flex items-center justify-between">
            <div>
              <Label htmlFor={key}>{schema.label}</Label>
              {schema.description && (
                <p className="text-xs text-muted-foreground">{schema.description}</p>
              )}
            </div>
            <Switch
              id={key}
              checked={value}
              onCheckedChange={(checked) => setLocalConfig((prev) => ({ ...prev, [key]: checked }))}
            />
          </div>
        );

      case "select":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{schema.label}</Label>
            <Select
              value={value}
              onValueChange={(newValue) => setLocalConfig((prev) => ({ ...prev, [key]: newValue }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {schema.options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {schema.description && (
              <p className="text-xs text-muted-foreground">{schema.description}</p>
            )}
          </div>
        );

      case "color":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{schema.label}</Label>
            <ColorPicker
              value={value}
              onChange={(color) => setLocalConfig((prev) => ({ ...prev, [key]: color }))}
            />
            {schema.description && (
              <p className="text-xs text-muted-foreground">{schema.description}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Organiser les champs de configuration par catégorie
  const getConfigFieldsByCategory = () => {
    if (!template?.configSchema) return {};

    const categories: Record<string, { key: string; schema: any }[]> = {};

    Object.entries(template.configSchema).forEach(([key, schema]) => {
      const category = schema.category || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({ key, schema });
    });

    return categories;
  };

  const configCategories = getConfigFieldsByCategory();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Configurer le bloc</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none border-b-0 p-0">
            <TabsTrigger value="config" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2">
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="style" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2">
              <Palette className="h-4 w-4 mr-2" />
              Style
            </TabsTrigger>
            <TabsTrigger value="layout" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2">
              <Layout className="h-4 w-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="data" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2">
              <Database className="h-4 w-4 mr-2" />
              Données
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="config" className="mt-0 space-y-6">
            {/* Basic Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Paramètres de base</CardTitle>
                <CardDescription>Configurez les propriétés de base de ce bloc</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="block-title">Titre</Label>
                  <Input id="block-title" value={localTitle} onChange={(e) => setLocalTitle(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-description">Description</Label>
                  <Textarea
                    id="block-description"
                    value={localDescription}
                    onChange={(e) => setLocalDescription(e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Block-specific Configuration */}
            {template?.configSchema && Object.keys(configCategories).map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-sm">{category}</CardTitle>
                  <CardDescription>Configurez les paramètres {category.toLowerCase()} pour ce {template.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {configCategories[category].map(({ key, schema }) => renderConfigField(key, schema))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="style" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Style visuel</CardTitle>
                <CardDescription>Personnalisez l'apparence de ce bloc</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Couleur de fond</Label>
                  <ColorPicker
                    value={localStyle.backgroundColor || ''}
                    onChange={(color) => setLocalStyle((prev) => ({ ...prev, backgroundColor: color }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Couleur de bordure</Label>
                  <ColorPicker
                    value={localStyle.borderColor || ''}
                    onChange={(color) => setLocalStyle((prev) => ({ ...prev, borderColor: color }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Couleur du texte</Label>
                  <ColorPicker
                    value={localStyle.textColor || ''}
                    onChange={(color) => setLocalStyle((prev) => ({ ...prev, textColor: color }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rayon de bordure</Label>
                  <Input
                    value={localStyle.borderRadius || ''}
                    onChange={(e) => setLocalStyle((prev) => ({ ...prev, borderRadius: e.target.value }))}
                    placeholder="0px"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Position & Taille</CardTitle>
                <CardDescription>Configurez les propriétés de mise en page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Largeur (colonnes)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={block.position.w}
                      onChange={(e) =>
                        onUpdate({
                          position: { ...block.position, w: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hauteur (lignes)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={block.position.h}
                      onChange={(e) =>
                        onUpdate({
                          position: { ...block.position, h: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Source de données</CardTitle>
                <CardDescription>Configurez la source de données pour ce bloc</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Source de données</Label>
                  <Select
                    value={block.datasource?.type || "mock"}
                    onValueChange={(value) => {
                      const dsId = `ds-${Date.now()}`;
                      onUpdate({
                        datasource: {
                          id: dsId,
                          name: value,
                          type: value as "static" | "api" | "prometheus" | "grafana" | "mock",
                          config: {},
                          url: value === "api" ? "https://api.example.com/data" : undefined
                        },
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mock">Données fictives</SelectItem>
                      <SelectItem value="prometheus">Prometheus</SelectItem>
                      <SelectItem value="static">Données statiques</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {block.datasource?.type === "api" && (
                  <div className="space-y-2">
                    <Label>URL de l'API</Label>
                    <Input
                      value={block.datasource?.url || ""}
                      onChange={(e) => {
                        if (block.datasource) {
                          onUpdate({
                            datasource: {
                              ...block.datasource,
                              url: e.target.value,
                            },
                          })
                        }
                      }}
                      placeholder="https://api.example.com/data"
                    />
                  </div>
                )}

                {block.datasource?.type === "prometheus" && (
                  <div className="space-y-2">
                    <Label>Requête Prometheus</Label>
                    <Textarea
                      value={block.targets?.[0]?.expr || ""}
                      onChange={(e) =>
                        onUpdate({
                          targets: [
                            {
                              datasource: "prometheus",
                              expr: e.target.value,
                              interval: "30s",
                              legendFormat: "{{instance}}",
                              refId: "A",
                            },
                          ],
                        })
                      }
                      placeholder="up"
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
} 