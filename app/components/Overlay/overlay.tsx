"use client"

import { useDispatch, useSelector } from 'react-redux'
import styles from './overlay.module.css'
import { RootState } from '@/app/store/store';
import { useEffect, useRef } from 'react';
import { setChunksPassed, setGameScore, setHorizontalSpeed, setInGametime, incrementPositionX, decrementPositionX, incrementPositionY, setVerticalSpeed } from '@/app/store/slices/GameSessionSlice/GameSessionSlice';

export function Overlay () {
  const dispatch = useDispatch();

  const { horizontalSpeed, verticalSpeed, positionX, positionY, inGameTime, chunkSize, chunksPassed, gameScore } = useSelector((state : RootState) => state.gameSessionReducer);
  const { caveReady, coords } = useSelector((state : RootState) => state.caveReducer);

  const refVertical = useRef(verticalSpeed);
  const refHorizontal = useRef(horizontalSpeed);
  const refPositionX = useRef(positionX);
  const refPositionY = useRef(positionY);
  const refInGameTime = useRef(inGameTime);

  const droneSize = 5;
  let interval : NodeJS.Timeout;

  function timeDisplay(ms : number) {
    const result : string[] = [];
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes < 10) {
      result[0] = `0${minutes}:`
    } else {
      result[0] = `${minutes}:`
    }

    if (seconds < 10) {
      result[1] = `0${seconds}`
    } else {
      result[1] = `${seconds}`
    }
    
    return result;
  }

  useEffect(() => {
    refInGameTime.current = inGameTime; 
  }, [inGameTime])

  useEffect(() => {
    refHorizontal.current = horizontalSpeed;
    let horizontalMovement : NodeJS.Timeout;

    if (caveReady) {
      horizontalMovement = setInterval(() => {
        if (refHorizontal.current > 0) {
          for (let i = 1; i <= refHorizontal.current; i++) {
            dispatch(decrementPositionX());
          }
        } else if (refHorizontal.current < 0) {
          for (let i = -1; i >= refHorizontal.current; i--) {  
            dispatch(incrementPositionX());
          }
        }
      }, 100);
    }

    return (() => {
      clearInterval(horizontalMovement)
    })
  }, [horizontalSpeed]);

  useEffect(() => {
    refVertical.current = verticalSpeed;
    let verticalMovement : NodeJS.Timeout;

    if (caveReady) {
      verticalMovement = setInterval(() => {
        for (let i = 1; i <= refVertical.current; i++) {
        dispatch(incrementPositionY())
        }
      }, 100);
    }

    return (() => {
      clearInterval(verticalMovement)
    })
  }, [verticalSpeed]);

  useEffect(() => {
    if (positionY !== 0) {
      dispatch(setChunksPassed(Math.floor(positionY / chunkSize)))
    }
  }, [positionY]);

  useEffect(() => {
    if (caveReady) {
      refPositionX.current = positionX;
      refPositionY.current = positionY;

      if (inGameTime < 60000) {
        dispatch(setGameScore(Math.floor((chunksPassed * 2) / (chunkSize / 100))))
      } else if (inGameTime < 120000) {
        dispatch(setGameScore(Math.floor((chunksPassed) / (chunkSize / 100))))
      } else {
        dispatch(setGameScore(Math.floor((chunksPassed * 0.5) / (chunkSize / 100))))
      }

      const walls = {
        leftWall1: Number(coords[0][chunksPassed]),
        rightWall1: Number(coords[1][chunksPassed]),
        x3: Number(coords[0][chunksPassed + 1]),
        x4: Number(coords[1][chunksPassed + 1]),
      }

      if (walls.leftWall1 == refPositionX.current + 500 - droneSize
          || walls.rightWall1 == refPositionX.current + 500 + droneSize
      ) {
        dispatch(setHorizontalSpeed(0));
        dispatch(setVerticalSpeed(0));
        console.log("collision")
      }
      
    }
  }, [positionX, positionY])


  useEffect(() => {
    const movementListener = (event : KeyboardEvent) => {      
      switch (event.key) {
        case ("ArrowUp"): {
          event.preventDefault();
          if (refVertical.current < 10 && refVertical.current >= 0) {
            dispatch(setVerticalSpeed(refVertical.current + 1))
          } else if (refVertical.current < 0) {
            dispatch(setVerticalSpeed(0))
          }
        break;  
        }
        case ("ArrowDown"): {
          event.preventDefault();
          if (refVertical.current < 0 && refVertical.current > -10) {
            dispatch(setVerticalSpeed(refVertical.current + (-1)))
          } else if (refVertical.current > 0) {
            dispatch(setVerticalSpeed(0))
          }
        break;  
        }
        case ("ArrowLeft"): {
          if (refHorizontal.current > 0) {
            dispatch(setHorizontalSpeed(0))
          } else if (refHorizontal.current > -10 && refHorizontal.current <= 0){
            dispatch(setHorizontalSpeed(refHorizontal.current + (-1)))
          }
        break;  
        }
        case ("ArrowRight"): {
          if (refHorizontal.current < 10 && refHorizontal.current >= 0) {
            dispatch(setHorizontalSpeed(refHorizontal.current + 1))
          } else if (refHorizontal.current < 0){
            dispatch(setHorizontalSpeed(0))
          }
        break;  
        }
      }
    }

    if (caveReady) {
      document.addEventListener("keydown", movementListener);
      interval = setInterval(() => {
        dispatch(setInGametime(refInGameTime.current + 100));  
      }, 100)
    }

    return (() => {
      document.removeEventListener("keydown", movementListener);
      clearInterval(interval)
    })
  }, [caveReady])

  return (
    <div className={styles.overlay}>
      <div className={styles.info}>
        <div className={`${styles.speedBackground}`}>
          <div style={{"transform": `rotate(${9 * verticalSpeed}deg)`}} className={styles.speedArrow}></div>
          <div className={styles.redDot}></div>
        </div>
        <div className={`${styles.speedBackground}`}>
          <div style={{"transform": `rotate(${9 * horizontalSpeed}deg)`}} className={styles.speedArrow}></div>
          <div className={styles.redDot}></div>
        </div>
        <div>
          Horizontal - {horizontalSpeed}
        </div>
        <div>
          Vertical - {verticalSpeed}
        </div>
        <div>
          Time - {timeDisplay(inGameTime)}
        </div>
        <div>
          Chunks Passed - {chunksPassed}
        </div>
        <div>
          Score - {gameScore}
        </div>
      </div>
      <svg className={styles.svgcontainer}>
        <polygon points={`${500 - droneSize},0 500,${droneSize} ${ 500 + (droneSize)},0` }fill='lime' />
      </svg>
       
    </div>
  )
}