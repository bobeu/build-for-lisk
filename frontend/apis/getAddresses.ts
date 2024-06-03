import { formatAddr } from "@/interfaces";
import factory from "../../backend/deployments/testnet/Factory.json";
import rewardToken from "../../backend/deployments/testnet/RewardToken.json";

export const getAddresses = () => {
  return {
    factory: formatAddr(factory.address),
    token: formatAddr(rewardToken.address),
    factoryAbi: factory.abi
  };
}
