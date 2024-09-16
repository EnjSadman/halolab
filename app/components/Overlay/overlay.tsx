"use client"

import { useDispatch, useSelector } from 'react-redux'
import styles from './overlay.module.css'
import { RootState } from '@/app/store/store';
import { useEffect, useRef } from 'react';
import { setHorizontalSpeed, setInGametime, setPositionX, setPositionY, setVerticalSpeed } from '@/app/store/slices/GameSessionSlice/GameSessionSlice';

export function Overlay () {
  const dispatch = useDispatch();

  const { horizontalSpeed, verticalSpeed, positionX, positionY, inGameTime, gameScore } = useSelector((state : RootState) => state.gameSessionReducer);
  const { caveReady } = useSelector((state : RootState) => state.caveReducer);

  const refVertical = useRef(verticalSpeed);
  const refHorizontal = useRef(horizontalSpeed);
  const refPositionX = useRef(positionX);
  const refPositionY = useRef(positionY);
  const refInGameTime = useRef(inGameTime);

  let interval : any;

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
    console.log(horizontalSpeed);
    let horizontalMovement : any;

    if (caveReady) {
      horizontalMovement = setInterval(() => {
        dispatch(setPositionX(refPositionX.current - refHorizontal.current))
      }, 10);
    }

    return (() => {
      clearInterval(horizontalMovement)
    })
  }, [horizontalSpeed]);

  useEffect(() => {
    refVertical.current = verticalSpeed;
    let verticalMovement : any;

    if (caveReady) {
      verticalMovement = setInterval(() => {
        dispatch(setPositionY(refPositionY.current - refVertical.current))
      }, 10);
    }

    return (() => {
      clearInterval(verticalMovement)
    })
  }, [verticalSpeed]);


  useEffect(() => {
    const movementListener = (event : KeyboardEvent) => {      
      switch (event.key) {
        case ("ArrowUp"): {
          if (refVertical.current < 10 && refVertical.current >= 0) {
            dispatch(setVerticalSpeed(refVertical.current + 1))
          } else if (refVertical.current < 0) {
            dispatch(setVerticalSpeed(0))
          }
        break;  
        }
        case ("ArrowDown"): {
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
        Horizontal - {horizontalSpeed}
        Vertical - {verticalSpeed}
        Time - {timeDisplay(inGameTime)} 
      </div>
      <svg className={styles.svgcontainer}>
        <polygon points="495,0 500,10 505,0" fill='lime' />
      </svg>
       
    </div>
  )
}