"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardBlock } from "@/lib/types/dashboard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useBlockData } from "@/hooks/use-block-data";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

interface LineChartBlockProps {
  block: DashboardBlock;
  className?: string;
}

export function LineChartBlock({ block, className }: LineChartBlockProps) {
  const { title, description, config = {}, dataSource } = block;
  const { data, isLoading, error } = useBlockData(dataSource);
  
  const { xKey = "time", yKeys = ["value"], colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"] } = config;

  // Adapter les données de Prometheus pour Recharts
  const formatData = (rawData: any) => {
    if (!rawData || !rawData.result) return [];
    
    // Pour une query de type "matrix"
    if (rawData.resultType === 'matrix' && Array.isArray(rawData.result)) {
      const series = rawData.result.map((s: any) => s.values.map((v: any[]) => ({
        time: new Date(v[0] * 1000).toLocaleTimeString(),
        [`${s.metric.job || 'value'}`]: parseFloat(v[1])
      })));
      
      // Simple merge logic, might need improvement for complex cases
      if (series.length > 0) {
        const timeMap = new Map();
        series.flat().forEach((item: any) => {
          const existing = timeMap.get(item.time) || {};
          timeMap.set(item.time, { ...existing, ...item });
        });
        return Array.from(timeMap.values());
      }
    }
    return [];
  };
  
  const chartData = !isLoading && data ? formatData(data) : [];

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-[300px] w-full" />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </div>
      );
    }
     if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Aucune donnée disponible.</p>
        </div>
      );
    }
    return (
       <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {yKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title || "Graphique linéaire"}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
} 