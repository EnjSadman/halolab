import { DataFetcher } from '@/app/lib/DataFetcher';
import { requestStatus } from '@/app/utils/enums';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  status: requestStatus.idle,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchDataSuccess: (state, action) => {
      state.userId = action.payload;
      state.status = requestStatus.succeeded;
    },
    fetchDataFailure: (state) => {
      state.status = requestStatus.failed;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserId.pending, (state, action) => {
        state.status = requestStatus.loading;
      })
      .addCase(fetchUserId.fulfilled, (state, action) => {
        state.status = requestStatus.succeeded;
        state.userId = action.payload;
      })
      .addCase(fetchUserId.rejected, (state, action) => {
        state.status = requestStatus.failed;
      })
  }
});

export const { fetchDataSuccess, fetchDataFailure } = userSlice.actions;
export default userSlice.reducer;

export const fetchUserId = createAsyncThunk("userId", async () => {
  //const savedUser = 
  try {
    const response = await DataFetcher();
    return response?.json();
  } catch (error) {
    return error
  }
})
