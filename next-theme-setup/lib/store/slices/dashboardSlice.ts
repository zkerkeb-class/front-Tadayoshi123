import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { DashboardLayout, DashboardBlock } from '@/lib/types/dashboard';
import { nanoid } from 'nanoid';

// État initial
interface DashboardState {
  currentLayout: DashboardLayout | null;
  savedLayouts: DashboardLayout[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  currentLayout: null,
  savedLayouts: [],
  isLoading: false,
  error: null,
};

// Fonction pour simuler une API (à remplacer par de vraies API calls)
const simulateApiCall = <T>(data: T, delay = 500, shouldFail = false): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('API call failed'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Thunks
export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchDashboard',
  async (dashboardId: string, { rejectWithValue }) => {
    try {
      // Simuler un appel API
      // À remplacer par un vrai appel API
      const response = await simulateApiCall({
        id: dashboardId,
        name: 'Dashboard chargé',
        description: 'Ce dashboard a été chargé depuis le serveur',
        blocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gridConfig: {
          cols: 12,
          rowHeight: 50,
          gap: 10,
          compactType: 'vertical',
        },
      } as DashboardLayout);
      
      return response;
    } catch (error) {
      return rejectWithValue('Impossible de charger le dashboard');
    }
  }
);

export const saveDashboard = createAsyncThunk(
  'dashboard/saveDashboard',
  async (dashboard: DashboardLayout, { rejectWithValue }) => {
    try {
      // Simuler un appel API
      // À remplacer par un vrai appel API
      const updatedDashboard = {
        ...dashboard,
        updatedAt: new Date().toISOString(),
      };
      
      const response = await simulateApiCall(updatedDashboard);
      return response;
    } catch (error) {
      return rejectWithValue('Impossible de sauvegarder le dashboard');
    }
  }
);

// Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Réinitialiser le dashboard
    resetDashboard: (state) => {
      state.currentLayout = null;
      state.error = null;
    },
    
    // Créer un nouveau dashboard
    createNewDashboard: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      const { name, description } = action.payload;
      state.currentLayout = {
        id: nanoid(),
        name,
        description: description || '',
        blocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gridConfig: {
          cols: 12,
          rowHeight: 50,
          gap: 10,
          compactType: 'vertical',
        },
      };
    },
    
    // Ajouter un bloc au dashboard
    addBlock: (state, action: PayloadAction<DashboardBlock>) => {
      if (state.currentLayout) {
        state.currentLayout.blocks.push(action.payload);
        state.currentLayout.updatedAt = new Date().toISOString();
      }
    },
    
    // Mettre à jour un bloc
    updateBlock: (state, action: PayloadAction<DashboardBlock>) => {
      if (state.currentLayout) {
        const index = state.currentLayout.blocks.findIndex(
          (block) => block.id === action.payload.id
        );
        
        if (index !== -1) {
          state.currentLayout.blocks[index] = action.payload;
          state.currentLayout.updatedAt = new Date().toISOString();
        }
      }
    },
    
    // Supprimer un bloc
    deleteBlock: (state, action: PayloadAction<string>) => {
      if (state.currentLayout) {
        state.currentLayout.blocks = state.currentLayout.blocks.filter(
          (block) => block.id !== action.payload
        );
        state.currentLayout.updatedAt = new Date().toISOString();
      }
    },
    
    // Mettre à jour les métadonnées du dashboard
    updateDashboardMetadata: (
      state,
      action: PayloadAction<{ name?: string; description?: string }>
    ) => {
      if (state.currentLayout) {
        const { name, description } = action.payload;
        
        if (name !== undefined) {
          state.currentLayout.name = name;
        }
        
        if (description !== undefined) {
          state.currentLayout.description = description;
        }
        
        state.currentLayout.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    // Gestion de fetchDashboard
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLayout = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Gestion de saveDashboard
    builder
      .addCase(saveDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLayout = action.payload;
        
        // Ajouter ou mettre à jour dans la liste des dashboards sauvegardés
        const index = state.savedLayouts.findIndex(
          (layout) => layout.id === action.payload.id
        );
        
        if (index !== -1) {
          state.savedLayouts[index] = action.payload;
        } else {
          state.savedLayouts.push(action.payload);
        }
      })
      .addCase(saveDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  resetDashboard,
  createNewDashboard,
  addBlock,
  updateBlock,
  deleteBlock,
  updateDashboardMetadata,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
