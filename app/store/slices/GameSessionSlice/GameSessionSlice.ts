import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface initial {
  horizontalSpeed: number,
  verticalSpeed: number,
  gameScore: number,
  inGameTime: number,
}

const initialState : initial = {
  horizontalSpeed: 0,
  verticalSpeed: 0,
  gameScore: 0,
  inGameTime: 0,
}

const gameSessionSlice = createSlice({
  name: "gamesession",
  initialState,
  reducers: {
    setHorizontalSpeed:((state, action : PayloadAction<number>) => {
      state.horizontalSpeed = action.payload
    }),
    setVerticalSpeed:((state, action : PayloadAction<number>) => {
      state.verticalSpeed = action.payload
    }),
    setGameScore:((state, action : PayloadAction<number>) => {
      state.gameScore = action.payload;
    }),
    setInGametime:((state, action : PayloadAction<number>) => {
      state.inGameTime = action.payload;
    }),
  }
});

export default gameSessionSlice.reducer

export const { setHorizontalSpeed, setVerticalSpeed, setGameScore, setInGametime } = gameSessionSlice.actions