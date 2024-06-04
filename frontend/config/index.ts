import { createConfig, http } from "wagmi"
import { liskSepolia } from "wagmi/chains";
// import { injected, walletConnect } from "wagmi/connectors";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

// // My project ID. You can get one at https://cloud.walletconnect.com
export const projectId = String(process.env.NEXT_PUBLIC_PROJECT_ID);
if (!projectId) throw new Error('Project ID is undefined');

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet],
    },
  ],
  {
      appName: "GeneriFi",
      projectId: "01934b1b14be39ddf47490f1bfc1527a",
  }
);


export const config = createConfig({
    connectors,
    chains: [liskSepolia],
    transports: {
      [liskSepolia.id]: http(),
    },
  });
