"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardBlock } from "@/lib/types/dashboard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useBlockData } from "@/hooks/use-block-data";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

interface BarChartBlockProps {
  block: DashboardBlock;
  className?: string;
}

export function BarChartBlock({ block, className }: BarChartBlockProps) {
  const { title, description, config = {}, dataSource } = block;
  const { data, isLoading, error } = useBlockData(dataSource);
  
  const { xKey = "name", yKeys = ["value"], colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"] } = config;

  const formatData = (rawData: any) => {
    if (!rawData || !rawData.result) return [];

    if (rawData.resultType === 'vector') {
      return rawData.result.map((item: any) => ({
        name: Object.values(item.metric).join('-') || 'N/A',
        value: parseFloat(item.value[1]),
      }));
    }
    
    if (Array.isArray(rawData)) {
      return rawData;
    }

    return [];
  };

  const chartData = !isLoading && data ? formatData(data) : [];
  const dynamicYKeys = chartData.length > 0 ? Object.keys(chartData[0]).filter(k => k !== xKey) : yKeys;


  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-[300px] w-full" />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] text-destructive">
          <AlertTriangle className="h-8 w-8" />
          <p className="mt-2 text-sm text-center">{error}</p>
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
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {dynamicYKeys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title || "Graphique à barres"}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
} 