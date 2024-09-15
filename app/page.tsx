import StoreProvider from "./store/storeProvider"
import { DialogWindow } from "./components/DialogWindow/DialogWindow";
import { Main } from "./components/Main/Main";

export default function Home() {
  
  return (
    <StoreProvider>
        <DialogWindow />
        <Main />
    </StoreProvider> 
  );
}
//<Overlay />
//<Comp />