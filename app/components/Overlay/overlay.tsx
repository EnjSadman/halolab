"use client"

import { useDispatch, useSelector } from 'react-redux'
import styles from './overlay.module.css'
import { RootState } from '@/app/store/store';
import { useEffect, useRef } from 'react';
import { setHorizontalSpeed, setInGametime, setVerticalSpeed } from '@/app/store/slices/GameSessionSlice/GameSessionSlice';

export function Overlay () {
  const dispatch = useDispatch();

  const { horizontalSpeed, verticalSpeed, inGameTime, gameScore } = useSelector((state : RootState) => state.gameSessionReducer);
  const { caveReady } = useSelector((state : RootState) => state.caveReducer);

  const refVertical = useRef(verticalSpeed);
  const refHorizontal = useRef(horizontalSpeed);
  const refInGameTime = useRef(inGameTime);

  let interval;

  function timeDisplay(ms : number) {
    const result : string[] = [ "00:", "00"];
    let msHolder = ms;
    
    if (msHolder > 600000) {
      result[0] = `${Math.floor(msHolder / 60000)}:`
      msHolder /= 60000;
    } else if (msHolder < 600000 && msHolder > 60000) {
      result[0] = `0${Math.floor(msHolder / 60000)}:`
      msHolder /= 60000;
    }
    if (msHolder > 10000 ) {
      result[1] = `${Math.floor(msHolder / 1000)}`
      msHolder /= 1000;
    } else if (msHolder < 10000 && msHolder > 1000){
      result[1] = `0${Math.floor(msHolder / 1000)}`
      msHolder /= 1000;
    }
    return result;
  }

  useEffect(() => {
    refInGameTime.current = inGameTime; 
  }, [inGameTime])

  useEffect(() => {
    refHorizontal.current = horizontalSpeed; 
  }, [horizontalSpeed]);

  useEffect(() => {
    refVertical.current = verticalSpeed;
  }, [verticalSpeed]);


  useEffect(() => {
    const movementListener = (event : KeyboardEvent) => {      
      switch (event.key) {
        case ("ArrowUp"): {
          if (refVertical.current < 10 && refVertical.current >= 0) {
            dispatch(setVerticalSpeed(refVertical.current + 1))
          } else if (refVertical.current < 0) {
            dispatch(setVerticalSpeed(0 + 1))
          }
        break;  
        }
        case ("ArrowDown"): {
          if (refVertical.current < 0 && refVertical.current > -10) {
            dispatch(setVerticalSpeed(refVertical.current + (-1)))
          } else if (refVertical.current > 0) {
            dispatch(setVerticalSpeed(0 + (-1)))
          }
        break;  
        }
        case ("ArrowLeft"): {
          if (refHorizontal.current > 0) {
            dispatch(setHorizontalSpeed(0 + (-1)))
          } else if (refHorizontal.current > -10 && refHorizontal.current <= 0){
            dispatch(setHorizontalSpeed(refHorizontal.current + (-1)))
          }
        break;  
        }
        case ("ArrowRight"): {
          if (refHorizontal.current < 10 && refHorizontal.current > 0) {
            dispatch(setHorizontalSpeed(refHorizontal.current + 1))
          } else if (refHorizontal.current <= 0){
            dispatch(setHorizontalSpeed(0 + 1))
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
      document.removeEventListener("keydown", movementListener)
    })
  }, [caveReady])

  return (
    <div className={styles.overlay}>
      Horizontal - {horizontalSpeed}
      Vertical - {verticalSpeed}
      Time - {timeDisplay(inGameTime)} 
      <svg className={styles.svgcontainer}>
        <polygon points="495,0 500,10 505,0" fill='lime' />
      </svg>
       
    </div>
  )
}