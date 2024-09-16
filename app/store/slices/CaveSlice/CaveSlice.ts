import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialState {
  coords: string[][];
  caveReady: boolean;
  caveId: string;
}

const initialState : initialState = {
  coords: [[],[]],
  caveReady: false,
  caveId: "",
}

const caveSlice = createSlice({
  name: "cave",
  initialState,
  reducers: {
    addCoords: ((state, action: PayloadAction<string[]>) => {
      state.coords = [[...state.coords[0], action.payload[0]], [...state.coords[1], action.payload[1]]];
    }),
    setCaveReady:((state, action: PayloadAction<boolean>) => {
      state.caveReady = action.payload;
    }),
    setCaveId:((state, action: PayloadAction<string>) => {
      state.caveId = action.payload;
    })
  }
})

export default caveSlice.reducer

export const { addCoords, setCaveReady, setCaveId } = caveSlice.actions