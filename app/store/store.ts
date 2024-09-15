import { configureStore } from '@reduxjs/toolkit'
import  userReducer from './slices/UserSlice/UserSlice';
import  caveReducer from './slices/CaveSlice/CaveSlice';
import  miscReducer from './slices/MiscSlice/Misc';

export const makeStore = () => {
  return configureStore({
    reducer: {
      userReducer,
      caveReducer,
      miscReducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']