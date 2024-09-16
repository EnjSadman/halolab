"use client"

import styles from "./styles.module.css";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { addCoords, setCaveReady } from "@/app/store/slices/CaveSlice/CaveSlice";
import { setChunkSize } from "@/app/store/slices/GameSessionSlice/GameSessionSlice";

export function CaveLayout() {
  const defaultChunkHeight = 25;

  const dispatch = useDispatch();

  const { caveId } = useSelector((state : RootState) => state.caveReducer);
  const { userId, difficulty } = useSelector((state : RootState) => state.userReducer);
  const { positionX, positionY } = useSelector((state : RootState) => state.gameSessionReducer);
  const wsRef = useRef<WebSocket | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const setCoordinates = (arr : string[]) => {
    let firstPoint = Number(arr[0]);
    let secondPoint = Number(arr[1]);

    const result = [500 + firstPoint, 500 + secondPoint];

    return result;
  }

  const initializeWebSocket = (id: string) => {
    if (wsRef.current === null || wsRef.current.readyState !== WebSocket.OPEN) {
      wsRef.current = new WebSocket(`wss://cave-drone-server.shtoa.xyz/cave`);
      let count = 0;
      const prevData : number[] = [];

      wsRef.current.onopen = () => {
        const initMessage = `player:${userId}-${id}`;
        wsRef.current?.send(initMessage)
      };

      wsRef.current.onmessage = event => {
        const message = event.data;
        const points = setCoordinates(message.split(","));

        const svgNamespace = 'http://www.w3.org/2000/svg';
        if (svgRef.current) {
          if (count === 0) {
            svgRef.current.setAttribute('width', '100vw');
            svgRef.current.setAttribute('height', '0px');

            const poly = document.createElementNS(svgNamespace, "polygon")
            poly.setAttribute("points", `${points[1]},${count} ${points[0]},${count}  ${points[0]},${count + defaultChunkHeight - difficulty} ${points[1]},${count + defaultChunkHeight - difficulty}`);
            poly.setAttribute("fill", "white");
    
            svgRef.current.appendChild(poly);
            prevData[0] = points[0];
            prevData[1] = points[1];

            count += defaultChunkHeight - difficulty;

            dispatch(setChunkSize(defaultChunkHeight - difficulty));
            dispatch(addCoords(setCoordinates(message.split(","))))
          } else {
            const poly = document.createElementNS(svgNamespace, "polygon");
            svgRef.current.setAttribute('height', `${count + defaultChunkHeight - difficulty}px`);
            // poly.setAttribute("points", `${prevData[1]},${count} ${prevData[0]},${count}  ${points[0]},${count + defaultChunkHeight - difficulty} ${points[1]},${count + defaultChunkHeight - difficulty}`);
            poly.setAttribute("points", `${points[1]},${count} ${points[0]},${count}  ${points[0]},${count + defaultChunkHeight - difficulty} ${points[1]},${count + defaultChunkHeight - difficulty}`);
            poly.setAttribute("fill", "white");
            svgRef.current.appendChild(poly);
            prevData[0] = points[0];
            prevData[1] = points[1];
            count += defaultChunkHeight - difficulty;

            if (message !== "finished") {
              dispatch(addCoords(setCoordinates(message.split(","))))
            }
          }
        }
      };

      wsRef.current.onclose = () => {
        wsRef.current = null;
        dispatch(setCaveReady(true));
      };
    }
  };

  useEffect(() => {
    if (caveId !== "") {
      initializeWebSocket(caveId);
    }
  }, [caveId])
  return(
    <div className={styles.caveContainer}>
      <svg
        style={{"top": `${-positionY}px`, "left": `${positionX}px`}}
        ref={svgRef}
        className={styles.caveSvg}
        
      >
        <rect x="499" width="1px" height="100%" fill="red"/>
      </svg>
    </div>
  )
}