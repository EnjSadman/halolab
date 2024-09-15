"use client"

import { RootState } from "@/app/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { LoadingScreen } from "../LoadingScreen/LoadingScreen";
import Comp from "../comp/comp";

export function Main() {
  const dispatch = useDispatch();
  const cave = useSelector((state : RootState) => state.caveReducer)
  useEffect(() => {

  }, [])
  return(
    <div>
      {
        (cave.caveReady)
        ? <Comp />
        : <LoadingScreen />
      }
    </div>
  )
}