import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface initial {
  horizontalSpeed: number,
  verticalSpeed: number,
  positionX: number,
  positionY: number,
  gameScore: number,
  inGameTime: number,
  chunkSize: number,
  chunksPassed: number,
}

const initialState : initial = {
  horizontalSpeed: 0,
  verticalSpeed: 0,
  positionX: 0,
  positionY: 0,
  gameScore: 0,
  inGameTime: 0,
  chunkSize: 0,
  chunksPassed: 0,
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
    incrementPositionX:((state) => {
      state.positionX = state.positionX + 1
    }),
    decrementPositionX:((state) => {
      state.positionX = state.positionX - 1
    }),
    incrementPositionY:((state) => {
      state.positionY = state.positionY + 1
    }),
    setGameScore:((state, action : PayloadAction<number>) => {
      state.gameScore = action.payload;
    }),
    setInGametime:((state, action : PayloadAction<number>) => {
      state.inGameTime = action.payload;
    }),
    setChunkSize:((state, action : PayloadAction<number>) => {
      state.chunkSize = action.payload;
    }),
    setChunksPassed:((state, action : PayloadAction<number>) => {
      state.chunksPassed = action.payload;
    })
  }
});

export default gameSessionSlice.reducer

export const { setHorizontalSpeed, setVerticalSpeed, incrementPositionX, decrementPositionX, incrementPositionY, setGameScore, setInGametime, setChunkSize, setChunksPassed } = gameSessionSlice.actions