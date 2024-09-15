import { dialogContent } from "@/app/utils/enums";
import { SCORE } from "@/app/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initial {
  dialogOpened: boolean;
  score: SCORE[],
  dialogContentType: dialogContent,
}

const initialState : initial = {
  dialogOpened: true,
  score: [],
  dialogContentType: dialogContent.score,
}

const MiscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setDialogVisibility: (state, action) => {
      state.dialogOpened = action.payload;
    },
    setDialogContentType: (state, action : PayloadAction<dialogContent>) => {
      state.dialogContentType = action.payload
    },
    initializeScore: (state, action : PayloadAction<SCORE[]>) => {
      state.score = [...action.payload]
    },
    setScore: (state, action : PayloadAction<SCORE>) => {
      state.score = [...state.score, {...action.payload}]
    }
  }
})

export default MiscSlice.reducer;

export const { setDialogVisibility, setDialogContentType, setScore, initializeScore } = MiscSlice.actions;