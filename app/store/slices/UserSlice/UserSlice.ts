import { requestStatus } from '@/app/utils/enums';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState = {
  userId: null,
  username : "",
  difficulty: 0,
  status: requestStatus.idle,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername:((state, action : PayloadAction<string>) => {
      state.username = action.payload;
    }),
    setDifficulty:((state, action : PayloadAction<number>) => {
      state.difficulty = action.payload;
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserId.pending, (state) => {
        state.status = requestStatus.loading;
      })
      .addCase(fetchUserId.fulfilled, (state, action) => {
        state.status = requestStatus.succeeded;
        state.userId = action.payload;
      })
      .addCase(fetchUserId.rejected, (state) => {
        state.status = requestStatus.failed;
      })
  }
});

export default userSlice.reducer;
export const {setDifficulty, setUsername} = userSlice.actions

export const fetchUserId = createAsyncThunk("userId/fetchId", async ({name, complexity} : {name: string, complexity: number}) => {

  const user = {
    name: name,
    complexity:complexity,
  }

  try {
    const result = await fetch (`https://cave-drone-server.shtoa.xyz/init`, {        
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    });
    return (await result.json()).id;
  } catch (error) {
    return error
  }
})
