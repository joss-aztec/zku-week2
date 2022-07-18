import { RainbowAndWagmiProvider } from "./RainbowAndWagmiProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MerkleTree } from "./MerkleTree";
import { InsertHash } from "./InsertHash";

function App() {
  return (
    <RainbowAndWagmiProvider>
      <ConnectButton />
      <MerkleTree />
      <InsertHash />
    </RainbowAndWagmiProvider>
  );
}

export default App;
