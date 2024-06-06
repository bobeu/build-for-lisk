import { createConfig, http } from "wagmi"
import { liskSepolia } from "wagmi/chains";
// import { injected, walletConnect } from "wagmi/connectors";
import { injectedWallet, coinbaseWallet, metaMaskWallet} from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

// // My project ID. You can get one at https://cloud.walletconnect.com
export const projectId = String(process.env.NEXT_PUBLIC_PROJECT_ID);
if (!projectId) throw new Error('Project ID is undefined');
// if (!projectId) throw new Error('Project ID is undefined');

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet, coinbaseWallet, metaMaskWallet],
    },
  ],
  {
      appName: "GeneriFi",
      projectId,
  }
);


export const config = createConfig({
    connectors,
    chains: [liskSepolia],
    transports: {
      [liskSepolia.id]: http(),
    },
  });
