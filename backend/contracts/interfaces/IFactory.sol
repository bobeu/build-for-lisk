// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IFactory {
  // Staker's profile data
  struct Staker {
    uint depositTime;
    uint ethAmount;
    address wallet;
  }

  function deposit() external payable returns(bool);
  function checkout() external returns(bool);

}