import { CaveLayout } from "../CaveLayout/CaveLayout";
import { Overlay } from "../Overlay/Overlay";

export function GameScreen() {
  return (
    <div>
      <Overlay />
      <CaveLayout />
    </div>
  )
}