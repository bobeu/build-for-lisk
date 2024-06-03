// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20Extended } from "../interfaces/IERC20Extended.sol";

contract RewardToken is ERC20, Ownable, IERC20Extended {
  uint public maxSupply;

  constructor (address _owner, uint _maxSupply) Ownable(_owner) ERC20("EarnedToken", "ERN") {
    require(_maxSupply > 0, "Zero supply");
    maxSupply = _maxSupply * (10**18);
  }

  function mint(address to, uint amount) external onlyOwner returns(bool) {
    _mint(to, amount);
    return true;
  }
}