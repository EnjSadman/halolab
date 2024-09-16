"use client"

import { AppDispatch, RootState } from "@/app/store/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { LoadingScreen } from "../LoadingScreen/LoadingScreen";
import { GameScreen } from "../GameScreen/GameScreen";
import { fetchUserId, setDifficulty, setUsername } from "@/app/store/slices/UserSlice/UserSlice";
import { setCaveId } from "@/app/store/slices/CaveSlice/CaveSlice";
import { CaveLayout } from "../CaveLayout/CaveLayout";
import { Overlay } from "../Overlay/overlay";

export function Main() {
  const dispatch = useDispatch<AppDispatch>();
  const cave = useSelector((state : RootState) => state.caveReducer);
  const {username, difficulty, userId} = useSelector((state : RootState) => state.userReducer);

  const prevUsername = useRef(username);

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      if (username !== prevUsername.current){
        dispatch(setUsername(username))
        dispatch(fetchUserId({ name: username, complexity: difficulty }));
      }
      dispatch(setDifficulty(difficulty));
    }
  }, [username]);

  useEffect(() => {
    if (userId !== null) {
      const fetchPromises = [];
      for (let i = 1; i <= 4; i++) {
        const fetchPromise = fetch(`https://cave-drone-server.shtoa.xyz/token/${i}?id=${userId}`)
        .then(res => res.json())
        fetchPromises.push(fetchPromise);
      }
      Promise.all(fetchPromises).then(responses => {
        dispatch(setCaveId(responses.map(el => el.chunk).join("")));
      })
    }
  }, [userId])


  return(
    <div>
      {
        //(!cave.caveReady)
        //? <LoadingScreen />
        //: null
      }

      {
        <>
          <Overlay />
          <CaveLayout />
        </>
      }
    </div>
  )
}