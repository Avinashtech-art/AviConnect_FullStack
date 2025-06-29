import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CallState, Call } from '../../types';

// Mock API calls - replace with real API
const mockCallAPI = {
  getCalls: () => Promise.resolve([]),
  makeCall: (data: any) => Promise.resolve({ id: Date.now().toString(), ...data }),
  endCall: (id: string) => Promise.resolve(id),
};

// Async thunks
export const fetchCalls = createAsyncThunk(
  'call/fetchCalls',
  async (_, { rejectWithValue }) => {
    try {
      const calls = await mockCallAPI.getCalls();
      return calls;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch calls');
    }
  }
);

export const makeCall = createAsyncThunk(
  'call/makeCall',
  async (callData: { receiverId: string; type: 'voice' | 'video'; chatId?: string }, { rejectWithValue }) => {
    try {
      const call = await mockCallAPI.makeCall({
        ...callData,
        timestamp: new Date(),
        status: 'calling'
      });
      return call;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to make call');
    }
  }
);

export const endCall = createAsyncThunk(
  'call/endCall',
  async (callId: string, { rejectWithValue }) => {
    try {
      await mockCallAPI.endCall(callId);
      return callId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to end call');
    }
  }
);

const initialState: CallState = {
  calls: [],
  activeCall: null,
  isLoading: false,
  error: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setActiveCall: (state, action: PayloadAction<Call | null>) => {
      state.activeCall = action.payload;
    },
    updateCallStatus: (state, action: PayloadAction<{ callId: string; status: string; duration?: number }>) => {
      const { callId, status, duration } = action.payload;
      const call = state.calls.find(c => c.id === callId);
      if (call) {
        call.status = status as any;
        if (duration) call.duration = duration;
      }
      if (state.activeCall?.id === callId) {
        state.activeCall.status = status as any;
        if (duration) state.activeCall.duration = duration;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch calls
    builder
      .addCase(fetchCalls.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCalls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.calls = action.payload;
      })
      .addCase(fetchCalls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Make call
    builder
      .addCase(makeCall.fulfilled, (state, action) => {
        state.calls.unshift(action.payload);
        state.activeCall = action.payload;
      });

    // End call
    builder
      .addCase(endCall.fulfilled, (state, action) => {
        if (state.activeCall?.id === action.payload) {
          state.activeCall = null;
        }
      });
  },
});

export const { setActiveCall, updateCallStatus, clearError } = callSlice.actions;
export default callSlice.reducer;