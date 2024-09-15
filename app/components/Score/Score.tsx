"use client"

import { Button } from "@mui/material";
import styles from "./styles.module.css";
import { initializeScore, setDialogContentType } from "@/app/store/slices/MiscSlice/Misc";
import { RootState } from "@/app/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dialogContent } from "@/app/utils/enums";

export function Score() {
  const dispatch = useDispatch();
  const miscSelector = useSelector((state : RootState) => state.miscReducer);

  useEffect(() => {
    if (miscSelector.score.length === 0) {
      const score = localStorage.getItem("score");
      if (score) {
        dispatch(initializeScore(JSON.parse(score)))
      }
    }
  }, []);
  return (
    <div className={styles.scoreboard}>
          {
            miscSelector.score.map((el, index) => (
              <div key={index} className={styles.singleScore}>
                <div>
                  {index + 1}.
                  {el.username}
                </div>
                <div>
                  {el.score}
                </div>
              </div>
            ))
          }
          {
            (miscSelector.score.length === 0) 
            ? (
              <div>
                No scores here yet.
              </div>
            )
            : null 
          }
          <Button
            variant="contained"
            onClick={() => {
              dispatch(setDialogContentType(dialogContent.newGame))
            }}
          >
            Start new game
          </Button>
        </div>
  )
}