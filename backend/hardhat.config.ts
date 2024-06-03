import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { config as dotConfig } from "dotenv";
// import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

dotConfig();
const PRIVATE_KEY = String(process.env.PRIVATE_KEY);

const config: HardhatUserConfig = {
  networks: {
    testnet: {
        url: "https://",
        accounts: [PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1111: `privatekey://${PRIVATE_KEY}`,
    },
  },

  solidity: {
  version: "0.8.24",
  settings: {
      optimizer: {
          enabled: true,
          runs: 200,
      },
      evmVersion: "byzantium"
    }
  },
};

export default config;
