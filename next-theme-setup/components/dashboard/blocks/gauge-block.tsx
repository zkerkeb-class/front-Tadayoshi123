"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardBlock } from "@/lib/types/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useBlockData } from "@/hooks/use-block-data";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

interface GaugeBlockProps {
  block: DashboardBlock;
  className?: string;
}

export function GaugeBlock({ block, className }: GaugeBlockProps) {
  const { title, description, config = {}, dataSource } = block;
  const { data, isLoading, error } = useBlockData(dataSource);

  const { 
    max = 100, 
    min = 0, 
    unit = "%",
    thresholds = { warning: 70, critical: 90 },
    color = "#3b82f6"
  } = config;

  const extractValue = (rawData: any): number | null => {
    if (rawData === null || rawData === undefined) return null;
    if (typeof rawData === 'number') return rawData;
    if (rawData.resultType === 'scalar' || rawData.resultType === 'vector') {
      if (Array.isArray(rawData.result) && rawData.result.length > 0) {
        const valueStr = rawData.result[0].value?.[1] || rawData.result[0][1];
        if (valueStr) return parseFloat(valueStr);
      }
    }
    return null;
  }
  
  const currentValue = data ? extractValue(data) : (config.value || 0);
  const normalizedValue = currentValue !== null ? ((currentValue - min) / (max - min)) * 100 : 0;
  
  const getColor = () => {
    if (normalizedValue >= thresholds.critical) return "#ef4444"; // Red
    if (normalizedValue >= thresholds.warning) return "#f59e0b";  // Orange
    return color; // Default color
  };

  const chartData = [
    { name: 'value', value: normalizedValue },
    { name: 'empty', value: 100 - normalizedValue }
  ];

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-[220px] w-full" />;
    }
    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-[220px] text-destructive">
          <AlertTriangle className="h-8 w-8" />
          <p className="mt-2 text-sm text-center">{error}</p>
        </div>
      );
    }
     if (currentValue === null) {
      return (
        <div className="flex items-center justify-center h-[220px]">
          <p className="text-muted-foreground">Aucune donnée</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value">
                <Cell key="value" fill={getColor()} />
                <Cell key="empty" fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2">
          <div className="text-3xl font-bold" style={{ color: getColor() }}>
            {currentValue}
            <span className="text-lg ml-1">{unit}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Min: {min} {unit} | Max: {max} {unit}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title || "Jauge"}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
} 