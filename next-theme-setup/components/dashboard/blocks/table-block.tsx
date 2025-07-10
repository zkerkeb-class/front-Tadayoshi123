"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardBlock } from "@/lib/types/dashboard";
import { useBlockData } from "@/hooks/use-block-data";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

interface TableBlockProps {
  block: DashboardBlock;
  className?: string;
}

export function TableBlock({ block, className }: TableBlockProps) {
  const { title, description, config = {}, dataSource } = block;
  const { data, isLoading, error } = useBlockData(dataSource);

  const { 
    columns = [],
    striped = true,
    bordered = false,
    compact = false,
  } = config;

  const formatData = (rawData: any) => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData; // Support simple arrays

    if (rawData.resultType === 'vector' || rawData.resultType === 'matrix') {
      return rawData.result.map((item: any) => ({
        ...item.metric,
        value: item.value ? parseFloat(item.value[1]) : item.values.map((v: any) => parseFloat(v[1])).join(', '),
      }));
    }
    
    return [];
  };

  const tableData = !isLoading && data ? formatData(data) : [];

  const tableColumns = columns.length > 0 
    ? columns 
    : tableData.length > 0 
      ? Object.keys(tableData[0]).map(key => ({ key, title: key.charAt(0).toUpperCase() + key.slice(1) }))
      : [];
      
  const formatCell = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value);
    return value.toString();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-[200px] text-destructive">
          <AlertTriangle className="h-8 w-8" />
          <p className="mt-2 text-sm text-center">{error}</p>
        </div>
      );
    }

    if (tableData.length === 0) {
       return (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">Aucune donnée disponible.</p>
        </div>
      );
    }

    return (
       <Table className={bordered ? "border border-border" : ""}>
        <TableHeader>
          <TableRow>
            {tableColumns.map((column: { key: string; title: string }, index: number) => (
              <TableHead key={index} className={compact ? "py-1" : ""}>
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row: any, rowIndex: number) => (
            <TableRow 
              key={rowIndex}
              className={striped && rowIndex % 2 !== 0 ? "bg-muted/50" : ""}
            >
              {tableColumns.map((column: { key: string; title: string }, colIndex: number) => (
                <TableCell key={colIndex} className={compact ? "py-1" : ""}>
                  {formatCell(row[column.key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title || "Tableau de données"}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[400px]">
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
} 