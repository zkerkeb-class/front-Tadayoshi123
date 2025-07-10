// @/lib/store/slices/paymentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentService from '@/lib/services/payment.service';

interface Subscription {
    id: string;
    status: string;
    current_period_end: number;
    plan: {
        id: string;
        name: string;
    };
}

interface PaymentState {
    subscription: Subscription | null;
    loading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    subscription: null,
    loading: false,
    error: null,
};

// Async thunks
export const fetchSubscriptionStatus = createAsyncThunk(
    'payment/fetchSubscriptionStatus',
    async (_, { rejectWithValue }) => {
        try {
            // This endpoint does not exist yet on the backend, we will need to create it.
            // For now, this will fail gracefully.
            const response = await paymentService.getSubscription(); 
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscriptionStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.subscription = action.payload;
            })
            .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default paymentSlice.reducer; 