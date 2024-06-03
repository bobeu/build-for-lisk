// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import {  IInterWallet } from "../interfaces/IInterWallet.sol";

contract InterWallet is IInterWallet, Context {
  error UnAuthorizedCaller(address);
  event EthReceived(uint);

  // Owner's address
  address private owner;

  // Reward token
  IERC20 private rewardToken;

  constructor(IERC20 _rewardToken) payable {
    owner = _msgSender();
    rewardToken = _rewardToken;
  }
  
  //Fallback
  receive() external payable {
    emit EthReceived(msg.value);
  }

  // Only owner can call when this is invoked
  modifier onlyOwner() {
    if(_msgSender() != owner) revert UnAuthorizedCaller(_msgSender());
    _;
  }

  ///@dev Withdraw Eth of @param amount : amount to withdraw from contract 
  function withdrawEth(address to) external onlyOwner {
    uint balance = address(this).balance;
    (bool success,) = to.call{value: balance}("");
    require(success, "withdrawal failed");
  }

  ///@dev Withdraw reward token 
  function withdrawERC20(address to) external onlyOwner {
    uint balance = IERC20(rewardToken).balanceOf(address(this));
    if(balance >  0) require(IERC20(rewardToken).transfer(to, balance), "Failed");
  } 
}
