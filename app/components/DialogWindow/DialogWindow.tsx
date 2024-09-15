"use client"

import styles from "./styles.module.css";
import { RootState } from "@/app/store/store";
import { dialogContent } from "@/app/utils/enums";
import { Dialog } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { Score } from "../Score/Score";
import { NewGame } from "../NewGame/NewGame";

export function DialogWindow() {

  const dispatch = useDispatch();
  const miscSelector = useSelector((state : RootState) => state.miscReducer);


  return (

      <Dialog
        open={miscSelector.dialogOpened}
        className={styles.scoreboard}
        fullWidth={true}
        maxWidth={"lg"}
      >
        {
          (miscSelector.dialogContentType === dialogContent.score) 
          ? <Score />
          : null
        }
        {
          (miscSelector.dialogContentType === dialogContent.newGame)
          ? <NewGame />
          : null
        }
      </Dialog>

  )
}