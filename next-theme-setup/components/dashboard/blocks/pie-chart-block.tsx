"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardBlock } from "@/lib/types/dashboard";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useBlockData } from "@/hooks/use-block-data";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

interface PieChartBlockProps {
  block: DashboardBlock;
  className?: string;
}

export function PieChartBlock({ block, className }: PieChartBlockProps) {
  const { title, description, config = {}, dataSource } = block;
  const { data, isLoading, error } = useBlockData(dataSource);
  
  const { nameKey = "name", valueKey = "value", colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"] } = config;

  const formatData = (rawData: any) => {
    if (!rawData || !rawData.result) return [];

    if (rawData.resultType === 'vector') {
      return rawData.result.map((item: any) => ({
        name: Object.values(item.metric)[0] || 'N/A', // Use the first label value as name
        value: parseFloat(item.value[1]),
      }));
    }
    
    // Fallback for simple array data
    if (Array.isArray(rawData)) {
      return rawData;
    }

    return [];
  };

  const chartData = !isLoading && data ? formatData(data) : [];

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-[300px]"><Skeleton className="h-[200px] w-[200px] rounded-full" /></div>;
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
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, 'Valeur']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title || "Graphique circulaire"}</CardTitle>
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