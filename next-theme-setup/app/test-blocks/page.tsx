"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GaugeBlock } from "@/components/dashboard/blocks/gauge-block";
import { LineChartBlock } from "@/components/dashboard/blocks/line-chart-block";
import { BarChartBlock } from "@/components/dashboard/blocks/bar-chart-block";
import { PieChartBlock } from "@/components/dashboard/blocks/pie-chart-block";
import { MetricBlock } from "@/components/dashboard/blocks/metric-block";
import { TableBlock } from "@/components/dashboard/blocks/table-block";

export default function TestBlocksPage() {
  const [activeBlock, setActiveBlock] = useState("gauge");

  const testConfigs = {
    gauge: {
      title: "Test Gauge",
      min: 0,
      max: 100,
      value: 75,
      unit: "%",
      showValue: true,
      thresholds: "70,90",
      colors: ["#10b981", "#f59e0b", "#ef4444"],
    },
    lineChart: {
      title: "Test Line Chart",
      showLegend: true,
      showGrid: true,
      colors: ["#3b82f6", "#10b981", "#f59e0b"],
      data: [
        { time: "00:00", incoming: 45, outgoing: 32 },
        { time: "01:00", incoming: 52, outgoing: 28 },
        { time: "02:00", incoming: 48, outgoing: 35 },
        { time: "03:00", incoming: 61, outgoing: 42 },
        { time: "04:00", incoming: 55, outgoing: 38 },
      ],
      xKey: "time",
      yKeys: ["incoming", "outgoing"],
    },
    barChart: {
      title: "Test Bar Chart",
      showLegend: true,
      showGrid: true,
      colors: ["#f59e0b", "#10b981"],
      data: [
        { name: "/", used: 45, available: 55 },
        { name: "/var", used: 78, available: 22 },
        { name: "/home", used: 32, available: 68 },
        { name: "/tmp", used: 12, available: 88 },
      ],
      xKey: "name",
      yKeys: ["used", "available"],
    },
    pieChart: {
      title: "Test Pie Chart",
      showLegend: true,
      showLabels: true,
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
      data: [
        { name: "Success", value: 85 },
        { name: "Warning", value: 12 },
        { name: "Error", value: 3 },
      ],
    },
    metric: {
      title: "Test Metric",
      value: "1,247",
      unit: "",
      prefix: "",
      showTrend: true,
      trendValue: 15,
      colorMode: "trend" as "value" | "trend" | "fixed",
    },
    table: {
      title: "Test Table",
      columns: "Name,Value,Status",
      pageSize: 5,
      showPagination: true,
      sortable: true,
      filterable: true,
      striped: true,
      bordered: true,
      data: [
        { Name: "Serveur 1", Value: 245, Status: "Active" },
        { Name: "Serveur 2", Value: 189, Status: "Inactive" },
        { Name: "Serveur 3", Value: 312, Status: "Error" },
        { Name: "Serveur 4", Value: 92, Status: "Pending" },
        { Name: "Serveur 5", Value: 156, Status: "Active" },
      ]
    },
  };

  const renderBlock = () => {
    try {
      switch (activeBlock) {
        case "gauge":
          return <GaugeBlock config={testConfigs.gauge} />;
        case "lineChart":
          return <LineChartBlock config={testConfigs.lineChart} />;
        case "barChart":
          return <BarChartBlock config={testConfigs.barChart} />;
        case "pieChart":
          return <PieChartBlock config={testConfigs.pieChart} />;
        case "metric":
          return <MetricBlock config={testConfigs.metric} />;
        case "table":
          return <TableBlock config={testConfigs.table} />;
        default:
          return <div>Bloc non trouvé</div>;
      }
    } catch (error) {
      return (
        <div className="p-4 text-red-500">
          <h3>Erreur lors du rendu du bloc :</h3>
          <pre className="text-xs mt-2">{error instanceof Error ? error.message : String(error)}</pre>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test des Blocs Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar avec les boutons */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-4">Types de blocs</h2>
          {Object.keys(testConfigs).map((blockType) => (
            <Button
              key={blockType}
              variant={activeBlock === blockType ? "default" : "outline"}
              onClick={() => setActiveBlock(blockType)}
              className="w-full justify-start"
            >
              {blockType}
            </Button>
          ))}
        </div>

        {/* Zone d'affichage du bloc */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Test du bloc : {activeBlock}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 border rounded p-4">
                {renderBlock()}
              </div>
            </CardContent>
          </Card>

          {/* Configuration du bloc */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Configuration actuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                {JSON.stringify(testConfigs[activeBlock as keyof typeof testConfigs], null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 