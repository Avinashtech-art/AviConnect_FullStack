import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StatusState, Status } from '../../types';

// Mock API calls - replace with real API
const mockStatusAPI = {
  getStatuses: () => Promise.resolve([]),
  getMyStatuses: () => Promise.resolve([]),
  createStatus: (data: any) => Promise.resolve({ id: Date.now().toString(), ...data }),
  deleteStatus: (id: string) => Promise.resolve(id),
  viewStatus: (id: string) => Promise.resolve(id),
};

// Async thunks
export const fetchStatuses = createAsyncThunk(
  'status/fetchStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const statuses = await mockStatusAPI.getStatuses();
      return statuses;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch statuses');
    }
  }
);

export const fetchMyStatuses = createAsyncThunk(
  'status/fetchMyStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const statuses = await mockStatusAPI.getMyStatuses();
      return statuses;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch my statuses');
    }
  }
);

export const createStatus = createAsyncThunk(
  'status/createStatus',
  async (statusData: { content: string; type: string; backgroundColor?: string; textColor?: string }, { rejectWithValue }) => {
    try {
      const status = await mockStatusAPI.createStatus({
        ...statusData,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        viewers: []
      });
      return status;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create status');
    }
  }
);

export const deleteStatus = createAsyncThunk(
  'status/deleteStatus',
  async (statusId: string, { rejectWithValue }) => {
    try {
      await mockStatusAPI.deleteStatus(statusId);
      return statusId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete status');
    }
  }
);

export const viewStatus = createAsyncThunk(
  'status/viewStatus',
  async ({ statusId, userId }: { statusId: string; userId: string }, { rejectWithValue }) => {
    try {
      await mockStatusAPI.viewStatus(statusId);
      return { statusId, userId, viewedAt: new Date() };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to view status');
    }
  }
);

const initialState: StatusState = {
  statuses: [],
  myStatuses: [],
  isLoading: false,
  error: null,
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addStatusViewer: (state, action: PayloadAction<{ statusId: string; userId: string; viewedAt: Date }>) => {
      const { statusId, userId, viewedAt } = action.payload;
      const status = state.statuses.find(s => s.id === statusId);
      if (status && !status.viewers.find(v => v.userId === userId)) {
        status.viewers.push({ userId, viewedAt });
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch statuses
    builder
      .addCase(fetchStatuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statuses = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch my statuses
    builder
      .addCase(fetchMyStatuses.fulfilled, (state, action) => {
        state.myStatuses = action.payload;
      });

    // Create status
    builder
      .addCase(createStatus.fulfilled, (state, action) => {
        state.myStatuses.unshift(action.payload);
      });

    // Delete status
    builder
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.myStatuses = state.myStatuses.filter(s => s.id !== action.payload);
      });

    // View status
    builder
      .addCase(viewStatus.fulfilled, (state, action) => {
        const { statusId, userId, viewedAt } = action.payload;
        const status = state.statuses.find(s => s.id === statusId);
        if (status && !status.viewers.find(v => v.userId === userId)) {
          status.viewers.push({ userId, viewedAt });
        }
      });
  },
});

export const { clearError, addStatusViewer } = statusSlice.actions;
export default statusSlice.reducer;