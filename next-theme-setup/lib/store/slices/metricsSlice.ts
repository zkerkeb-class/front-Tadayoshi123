import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface MetricData {
  timestamp: number
  value: number
}

interface SystemMetrics {
  cpuUsage: MetricData[]
  memoryUsage: MetricData[]
  diskUsage: MetricData[]
  networkTraffic: MetricData[]
}

interface Alert {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: Date
  server: string
  resolved: boolean
}

interface MetricsState {
  systemMetrics: SystemMetrics
  alerts: Alert[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

const initialState: MetricsState = {
  systemMetrics: {
    cpuUsage: [],
    memoryUsage: [],
    diskUsage: [],
    networkTraffic: [],
  },
  alerts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
}

// Fetch metrics from Prometheus/Grafana
export const fetchMetrics = createAsyncThunk("metrics/fetchMetrics", async () => {
  // TODO: Replace with actual Prometheus/Grafana API calls
  const response = await fetch("http://localhost:9090/api/v1/query_range", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("supervia_token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch metrics")
  }

  return await response.json()
})

// Fetch active alerts
export const fetchAlerts = createAsyncThunk("metrics/fetchAlerts", async () => {
  // TODO: Replace with actual alerting service call
  const response = await fetch("http://localhost:3004/alerts", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("supervia_token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch alerts")
  }

  return await response.json()
})

const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    addMockAlert: (state, action) => {
      state.alerts.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.isLoading = false
        state.systemMetrics = action.payload
        state.lastUpdated = new Date()
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch metrics"
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload
      })
  },
})

export const { clearError, addMockAlert } = metricsSlice.actions
export default metricsSlice.reducer
