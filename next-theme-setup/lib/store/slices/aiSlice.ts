import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { ChatMessage, GeneratedDashboard } from "@/lib/services/ai.service"
import AIService from "@/lib/services/ai.service"

const aiService = new AIService();

interface DashboardSuggestion {
  id: string
  title: string
  description: string
  config: any
  preview?: string
}

interface AIState {
  // Chat Assistant
  chatMessages: ChatMessage[]
  isChatLoading: boolean
  chatError: string | null

  // Dashboard Builder
  dashboardSuggestions: DashboardSuggestion[]
  generatedDashboard: GeneratedDashboard | null
  isDashboardLoading: boolean
  dashboardError: string | null

  // Current prompt
  currentPrompt: string
}

const initialState: AIState = {
  chatMessages: [],
  isChatLoading: false,
  chatError: null,
  dashboardSuggestions: [],
  generatedDashboard: null,
  isDashboardLoading: false,
  dashboardError: null,
  currentPrompt: "",
}

// AI Chat Assistant thunk
export const sendChatMessage = createAsyncThunk(
  "ai/sendChatMessage", 
  async ({ prompt, context }: { prompt: string; context?: Record<string, any> }, { rejectWithValue }) => {
    try {
      const response = await aiService.sendChatMessage(prompt, undefined, context)
      
      // Vérifier que la réponse contient bien un message valide
      if (!response || !response.message) {
        throw new Error("Format de réponse invalide du service IA");
      }
      
      return {
        userMessage: {
          id: Date.now().toString(),
          role: "user" as const,
          content: prompt,
          timestamp: new Date().toISOString(),
        },
        assistantMessage: response.message,
      }
    } catch (error: any) {
      console.error("Chat error:", error)
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to send message")
    }
  }
);

// AI Dashboard Builder thunk
export const generateDashboard = createAsyncThunk<
  GeneratedDashboard,
  { prompt: string; context?: { preferredMetrics?: string[] } },
  { rejectValue: string }
>(
  "ai/generateDashboard",
  async (request, { rejectWithValue }) => {
    try {
      const generatedData = await aiService.generateDashboard(request)
      return generatedData;
    } catch (error: any) {
      console.error("Dashboard generation error:", error)
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to generate dashboard")
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearChatError: (state) => {
      state.chatError = null
    },
    clearDashboardError: (state) => {
      state.dashboardError = null
    },
    setCurrentPrompt: (state, action: PayloadAction<string>) => {
      state.currentPrompt = action.payload
    },
    clearChatMessages: (state) => {
      state.chatMessages = []
    },
    addMockChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // Chat message
      .addCase(sendChatMessage.pending, (state, action) => {
        state.isChatLoading = true
        state.chatError = null
        state.chatMessages.push({
          id: Date.now().toString(),
          role: "user",
          content: action.meta.arg.prompt,
          timestamp: new Date().toISOString(),
        })
        state.currentPrompt = ""; // Vider le prompt dès l'envoi
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isChatLoading = false
        // Vérifier que assistantMessage existe avant de l'ajouter
        if (action.payload && action.payload.assistantMessage) {
          state.chatMessages.push(action.payload.assistantMessage)
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isChatLoading = false
        state.chatError = action.payload as string
        // Ajouter un message d'erreur comme message de l'assistant
        state.chatMessages.push({
          id: Date.now().toString(),
          role: "assistant",
          content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          timestamp: new Date().toISOString(),
        })
      })
      // Dashboard generation
      .addCase(generateDashboard.pending, (state) => {
        state.isDashboardLoading = true
        state.dashboardError = null
      })
      .addCase(generateDashboard.fulfilled, (state, action) => {
        state.isDashboardLoading = false
        state.generatedDashboard = action.payload
      })
      .addCase(generateDashboard.rejected, (state, action) => {
        state.isDashboardLoading = false
        state.dashboardError = action.payload as string
      })
  },
})

export const { clearChatError, clearDashboardError, setCurrentPrompt, clearChatMessages, addMockChatMessage } =
  aiSlice.actions
export default aiSlice.reducer
