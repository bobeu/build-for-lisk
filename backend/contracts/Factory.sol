// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20Extended} from "./interfaces/IERC20Extended.sol";
import { IFactory } from "./interfaces/IFactory.sol";
import { IInterWallet } from "./interfaces/IInterWallet.sol";
import { InterWallet } from "./wallet/InterWallet.sol";

contract Factory is IFactory, Ownable {
    error EmptyStaking(uint);
    error NoValue(uint);

    event TokenLocked(uint);
    event TokenUnlocked(uint);

    // Minimum amount that can be deposited
    uint public minDepositValue;

    // Total depositors
    uint public depositors;

    // Reward token
    IERC20Extended public token;

    ///@dev Mapping of rounds to stake vault
    mapping (address => Staker) private vault;

    constructor (uint _minDepositValue) Ownable(_msgSender()) {
        require(_minDepositValue > 0, "Minimum staking too low");
        minDepositValue = _minDepositValue;
    }

    receive() external payable {
        require(msg.value > 0, "");
    }

    /**
     * onlyOwner function: SetToken
     * @param _token : Token address
     */
    function setToken(IERC20Extended _token) public onlyOwner {
        token = _token;
    }

    /**@dev Stake Eth for token reward.
     * - The amount of Eth sent along the call should be greater 
     *      than the minimum staking amount.
     * - If sender already own an interwallet otherwise we 
     *      create a new one for them.
     * - We can make a dynamic staking i.e depositors can stake any amount
     *      Eth, anytime. Each stake is unique to another in timing and
     *      identity.
     */
    function deposit() public payable override returns(bool){
        address alc;
        Staker memory stk = _getProfile(_msgSender());
        if(msg.value < minDepositValue) revert NoValue(msg.value);
        alc = stk.wallet;
        if(alc == address(0)) {
            alc = address(new InterWallet(token));
        }

        if(stk.ethAmount > 0) {
            _unstake(alc, stk.ethAmount, stk.depositTime);
        }
        vault[_msgSender()] = Staker(_now(), msg.value, alc);
        depositors ++;
        emit TokenLocked(msg.value);

        return true;
    }

    function _unstake(address alc, uint value, uint depositTime) private {
        depositors --;
        vault[_msgSender()].ethAmount = 0;
        (bool sent,) = alc.call{value: value}("");
        require(sent, "Transfer rejected");
        uint reward = _calculateReward(value, depositTime);
        if(reward > 0) _mintRewardToken(alc, reward);

        emit TokenUnlocked(value);
    }

    /**@dev Unstake Eth from the vault.
     */
    function checkout() public override returns(bool) {
        Staker memory stk = vault[_msgSender()];
        if(stk.ethAmount == 0) revert EmptyStaking(stk.ethAmount);
        require(stk.wallet != address(0), "Account anomally detected");
        _unstake(stk.wallet, stk.ethAmount, stk.depositTime);

        return true;
    }

    ///@dev Returns current unix time stamp
    function _now() internal view returns(uint) {
        return block.timestamp;
    }

    /**@dev Calculate reward due on staking.
     * @param stakedAmt - Exact amount staked.
     * @param depositTime - Time stake was made.
     * 
     * To get the reward, we compare the current unixtime to the time staking
     * was performed to get the time difference. If time difference is greater 
     * than 1 minute, multiplier will increase otherwise it defaults to 1.
     */
    function _calculateReward(uint stakedAmt, uint depositTime) internal view returns(uint reward) {
        uint divisor = 60;
        uint curTime = _now();
        if(curTime == depositTime) {
            reward = 10 ** 15;
            return reward;
        }

        if(curTime > depositTime) {
            uint timeDiff = curTime - depositTime;
            if(timeDiff > 0){
                reward = (timeDiff * stakedAmt) / divisor; // Weighted reward
            } else {
                reward = 1e15;
            }

        }
        return reward;
    }

    /// Mint rewardToken to staker on staking receipt
    function _mintRewardToken(address to, uint amount) private {
        require(IERC20Extended(token).mint(to, amount), "");
    }

    function _getProfile(address who) internal view returns(Staker memory) {
        return vault[who];
    } 

    function getProfile() public view returns(Staker memory stk) {
        return _getProfile(_msgSender());
    }

    function withdraw() public { 
        address alc = _getProfile(_msgSender()).wallet;
        IInterWallet(alc).withdrawEth(_msgSender());
        IInterWallet(alc).withdrawERC20(_msgSender());
    }
}