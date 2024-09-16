"use client"

import styles from "./styles.module.css";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { setCaveReady } from "@/app/store/slices/CaveSlice/CaveSlice";

export function CaveLayout() {
  const dispatch = useDispatch();
  const { caveId } = useSelector((state : RootState) => state.caveReducer);
  const { userId, difficulty } = useSelector((state : RootState) => state.userReducer);
  const wsRef = useRef<WebSocket | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const setCoordinates = (arr : string[]) => {
    let firstPoint = Number(arr[0]);
    let secondPoint = Number(arr[1]);

    console.log(firstPoint, secondPoint)

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
        console.log(message.split(","));
        const points = setCoordinates(message.split(","));

        const svgNamespace = 'http://www.w3.org/2000/svg';
        if (svgRef.current) {
          if (count === 0) {
            svgRef.current.setAttribute('width', '100vw');
            svgRef.current.setAttribute('height', '10000vh');

            const poly = document.createElementNS(svgNamespace, "polygon")
            poly.setAttribute("points", `${points[1]},${count} ${points[0]},${count}  ${points[0]},${count + 20 - difficulty} ${points[1]},${count + 20 - difficulty}`);
            poly.setAttribute("fill", "white");
    
            svgRef.current.appendChild(poly);
            prevData[0] = points[0];
            prevData[1] = points[1];
            count += 20 - difficulty;
          } else {
            const poly = document.createElementNS(svgNamespace, "polygon");
            poly.setAttribute("points", `${prevData[1]},${count} ${prevData[0]},${count}  ${points[0]},${count + 20 - difficulty} ${points[1]},${count + 20 - difficulty}`);
            poly.setAttribute("fill", "white");
            svgRef.current.appendChild(poly);
            prevData[0] = points[0];
            prevData[1] = points[1];
            count += 20 - difficulty;
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
    <div>
      <svg
        style={{"top": `0px`}} ref={svgRef}
        className={styles.caveSvg}
      />
    </div>
  )
}