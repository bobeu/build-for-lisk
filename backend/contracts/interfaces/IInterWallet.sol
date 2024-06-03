// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IInterWallet {
  function withdrawEth(address to) external;
  function withdrawERC20(address to) external;
}