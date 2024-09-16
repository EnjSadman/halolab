import { configureStore } from '@reduxjs/toolkit'
import  userReducer from './slices/UserSlice/UserSlice';
import  caveReducer from './slices/CaveSlice/CaveSlice';
import  miscReducer from './slices/MiscSlice/Misc';
import  gameSessionReducer from './slices/GameSessionSlice/GameSessionSlice';


export const makeStore = () => {
  return configureStore({
    reducer: {
      userReducer,
      caveReducer,
      miscReducer,
      gameSessionReducer,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']