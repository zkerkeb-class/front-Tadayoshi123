// front-Tadayoshi123/next-theme-setup/hooks/use-block-data.ts
import { useState, useEffect } from 'react';
import { metricsService } from '@/lib/services/metrics.service';
import type { DashboardBlockDataSource } from '@/lib/types/dashboard';

interface UseBlockDataResult {
  data: any;
  isLoading: boolean;
  error: string | null;
}

export function useBlockData(dataSource?: DashboardBlockDataSource): UseBlockDataResult {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataSource) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let result: any;
        switch (dataSource.type) {
          case 'prometheus':
            if (dataSource.params?.query) {
              result = await metricsService.fetchPrometheusQuery(dataSource.params);
            } else {
              throw new Error('Prometheus query is missing in dataSource.params');
            }
            break;
          case 'static':
            result = dataSource.data;
            break;
          case 'api':
             if (dataSource.params?.endpoint) {
              result = await metricsService.fetchApiEndpoint(dataSource.params.endpoint);
            } else {
              throw new Error('API endpoint is missing in dataSource.params');
            }
            break;
          default:
            setData(null);
            setIsLoading(false);
            return;
        }
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up interval for data refreshing
    const refreshIntervalMs = (dataSource.refreshInterval || 0) * 1000;
    if (refreshIntervalMs > 0) {
      const intervalId = setInterval(fetchData, refreshIntervalMs);
      return () => clearInterval(intervalId);
    }

  }, [dataSource]);

  return { data, isLoading, error };
} 