"use client"

import { useAppSelector } from "@/app/store/hooks";
import { fetchUserId } from "@/app/store/slices/UserSlice/UserSlice";
import { AppDispatch } from "@/app/store/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux"

interface caveResponse {
  no: number,
  chunkId: string, 
}

export default function Comp() {
  const dispatch = useDispatch<AppDispatch>();
  const select = useAppSelector(state => state.userReducer);
  const userId = select.userId;
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [finalString, setFinalString] = useState("");

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
            svgRef.current.setAttribute('height', '100vh');

    
            const triangle = document.createElementNS(svgNamespace, "polygon");
            triangle.setAttribute("points", "490,0 500,15 510,0");
            triangle.setAttribute("fill", "lime");

            const poly = document.createElementNS(svgNamespace, "polygon")
            poly.setAttribute("points", `${points[1]},${count} ${points[0]},${count}  ${points[0]},${count + 10} ${points[1]},${count + 10}`);
            poly.setAttribute("fill", "white");
    
            svgRef.current.appendChild(triangle);
            svgRef.current.appendChild(poly);
            prevData[0] = points[0];
            prevData[1] = points[1];
            count += 10;
          } else {
            const poly = document.createElementNS(svgNamespace, "polygon");
            poly.setAttribute("points", `${prevData[1]},${count} ${prevData[0]},${count}  ${points[0]},${count + 10} ${points[1]},${count + 10}`);
            poly.setAttribute("fill", "white");
            svgRef.current.appendChild(poly);
            prevData[0] = points[0];
            prevData[1] = points[1];
            count += 10;
          }
        }
      };

      wsRef.current.onclose = () => {
        wsRef.current = null;
      };
    }
  };

  useEffect(() => {
    dispatch(fetchUserId({name: "1", complexity:0}));
    containerRef.current?.setAttribute("style", "overflow:hidden;height:100vh;");

  }, []);

  useEffect(() => {
    if (finalString !== "") {
      initializeWebSocket(finalString);
    }
  }, [finalString])



  useEffect(() => {

    if (userId !== null) {
    
      const fetchPromises = [];
      for (let i = 1; i <= 4; i++) {
        const fetchPromise = fetch(`https://cave-drone-server.shtoa.xyz/token/${i}?id=${userId}`)
        .then(res => res.json())
        fetchPromises.push(fetchPromise);
      }
      Promise.all(fetchPromises).then(responses => {
        setFinalString(responses.map(el => el.chunk).join(""));
      })
    }
  }, [userId]);


  return (
    <div ref={containerRef}>
      <svg ref={svgRef} />
    </div>
  )
}