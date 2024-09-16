import { CaveLayout } from "../CaveLayout/CaveLayout";
import { Overlay } from "../Overlay/overlay";

export function GameScreen() {
  return (
    <div>
      <Overlay />
      <CaveLayout />
    </div>
  )
}