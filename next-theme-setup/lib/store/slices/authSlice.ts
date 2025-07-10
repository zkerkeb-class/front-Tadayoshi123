import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { authService, type LoginCredentials, type SignupData } from "@/lib/services/auth.service"
import { type User } from '@/lib/types/dashboard';

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  lastActivity: number | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastActivity: null,
}

// Async thunks with proper error handling
export const loginUser = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials)
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Login failed")
  }
})

export const signupUser = createAsyncThunk("auth/signup", async (data: SignupData, { rejectWithValue }) => {
  try {
    const response = await authService.signup(data)
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Signup failed")
  }
})

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout()
    return null
  } catch (error: any) {
    return rejectWithValue(error.message || "Logout failed")
  }
})

export const verifyToken = createAsyncThunk("auth/verify", async (_, { rejectWithValue }) => {
  try {
    const user = await authService.verifyToken()
    return user
  } catch (error: any) {
    return rejectWithValue(error.message || "Token verification failed")
  }
})

export const refreshToken = createAsyncThunk("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.refreshToken()
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Token refresh failed")
  }
})

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async (token: string, { rejectWithValue }) => {
  try {
    const response = await authService.verifyEmail(token)
    // On ne change pas l'état d'authentification ici, on retourne juste le message
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Email verification failed")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now()
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.lastActivity = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.accessToken
        state.isAuthenticated = true
        state.lastActivity = Date.now()
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.token
        state.isAuthenticated = true
        state.lastActivity = Date.now()
        state.error = null
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.lastActivity = null
        state.error = null
        state.isLoading = false
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string
        state.isLoading = false
      })

      // Verify token
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.lastActivity = Date.now()
        state.error = null
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload as string
      })

      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.data.user
        state.token = action.payload.data.accessToken
        state.isAuthenticated = true
        state.lastActivity = Date.now()
        state.error = null
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload as string
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false
        // Optionnel : on pourrait vouloir mettre à jour le statut 'emailVerified' de l'utilisateur
        // si cette information est retournée par l'API et stockée dans le state.
        // Pour l'instant, on ne fait rien de spécial à part arrêter le chargement.
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, updateLastActivity, setUser, clearAuth } = authSlice.actions
export default authSlice.reducer
