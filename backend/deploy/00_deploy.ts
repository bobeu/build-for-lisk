import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { config } from "dotenv";
import { parseEther } from 'viem';

config()

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
	const {deploy, getNetworkName, execute, read } = deployments;
	const {deployer } = await getNamedAccounts();

  const maxSupply = 1_000_000_000;
  const minDepositValue = parseEther("0.001") ;
  const networkName = getNetworkName();
  console.log("Network Name", networkName); 

  const factory = await deploy("Factory", {
    from: deployer,
    args: [minDepositValue],
    log: true,
  });
  console.log("Factory address", factory.address);
  
  const rewardToken = await deploy("RewardToken", {
    from: deployer,
    args: [factory.address, maxSupply],
    log: true,
  });
  console.log("RewardToken address", rewardToken.address);

  await execute("Factory", {from: deployer}, "setToken", rewardToken.address);
  
  const newRewardToken = await read("Factory", "token");
  console.log("NewToken set successfully", newRewardToken);

};

export default func;

func.tags = ["Factory", "RewardToken",];


// Mainnet registry addresses

// 0x43E55608892989c43366CCd07753ce49e0c17688
// 0x70EF9503DB13ea94f001476B6d8491784348F8aF
// Tokens
// [
//   '0x409e23a02AC0e8eEa44B504B01fc6f672f624Fca',
//   '0x7885F497c2b2b5096b92b70a31aEEb74070A4e69'
// ]