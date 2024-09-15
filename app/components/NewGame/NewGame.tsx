"use client"

import { setDifficulty, setUsername } from "@/app/store/slices/UserSlice/UserSlice";
import styles from "./styles.module.css";
import { setDialogContentType, setDialogVisibility } from "@/app/store/slices/MiscSlice/Misc";
import { Button, FormControl, Input } from "@mui/material"
import { useState } from "react";
import { useDispatch } from "react-redux";

export function NewGame() {
  const dispatch = useDispatch();

  const difficulties = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const [playerName, setPlayerName] = useState("");
  const [playerDifficulty, setPlayerDifficulty] = useState(0);
  
  return (
    <div className={styles.newGame}>
        <FormControl>
          <Input 
            placeholder="Enter your name"
            value={playerName}
            onChange={(event) => {
              setPlayerName(event.target.value);
            }}
          />
        </FormControl>
        {
          difficulties.map((el, index) => (
            <Button
              key={index}
              className={(index === playerDifficulty) ? styles.current : styles.other}
              variant={(index === playerDifficulty) ? "contained" : "outlined"}
              onClick={() => {
                setPlayerDifficulty(el);
              }}
            >
              {el}
            </Button>
          ))
        }
        <Button
          variant="contained"
          disabled={playerName.length == 0}
          onClick={() => {
            dispatch(setDialogVisibility(false));
            dispatch(setUsername(playerName))
            dispatch(setDifficulty(playerDifficulty));
          }}
        >
          Start
        </Button>
    </div>
  )
}