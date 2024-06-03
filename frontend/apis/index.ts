import { getAddresses } from "./getAddresses";
import { readContract, writeContract, simulateContract, waitForTransactionReceipt }from "wagmi/actions";
import { type FunctionName, type OxString, type WagmiConfig, type Profile, type TransactionResultProps, transactionResult} from "@/interfaces";

export const waitForConfirmation = async(config: WagmiConfig, hash: OxString) => {
  await waitForTransactionReceipt(config, {hash});
}

async function sendtransaction(options: {config: WagmiConfig, value?: bigint, account: OxString, functionName: FunctionName, cancelLoading?: () => void }) {
  const { factory, token } = getAddresses();
  const { config, account, functionName, cancelLoading, value } = options;
  let hash : OxString = '0x';
  let result: TransactionResultProps = transactionResult;
  try {
    switch (functionName) {
      case "deposit":
        const deposit = await simulateContract(config, {
          address: factory,
          account,
          abi: depositAbi,
          functionName,
          value: value
        });
        hash = await writeContract(config, deposit.request ); 
        break;
      
      case "checkout":
        const checkout = await simulateContract(config, {
          address: factory,
          account,
          abi: checkoutAbi,
          functionName,
        });
        hash = await writeContract(config, checkout.request ); 
        break;

      case "withdraw":
        const withdraw = await simulateContract(config, {
          address: factory,
          account,
          abi: withdrawAbi,
          functionName,
        });
        hash = await writeContract(config, withdraw.request ); 
        break;

      case "getProfile":
        result.result = await readContract(config, {
          abi: getProfileAbi,
          functionName: "getProfile",
          account,
          address: factory
        });
        result.view = true;
        break;

      case "balanceOf":
        result.result = await readContract(config, {
          abi: balanceOfAbi,
          functionName: "balanceOf",
          account,
          address: token,
          args: [account]
        });
        result.view = true;
        break;

      default:
        break;
      }

      if(!result.view) {
        await waitForConfirmation(config, hash);
        result.result = await readContract(config, {
          abi: getProfileAbi,
          functionName: "getProfile",
          account,
          address: factory
        });
        cancelLoading?.();
      }
      
    } catch (error) {
      console.log(error);
      cancelLoading?.();
    }
    
  return result;
};

export default sendtransaction;


const depositAbi = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
] as const;

const balanceOfAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

const getProfileAbi = [
  {
    "inputs": [],
    "name": "getProfile",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "depositTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "ethAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "wallet",
            "type": "address"
          }
        ],
        "internalType": "struct IFactory.Staker",
        "name": "stk",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

const withdrawAbi = [
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

const checkoutAbi = [
  {
    "inputs": [],
    "name": "checkout",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;