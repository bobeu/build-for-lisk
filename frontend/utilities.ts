import { ethers } from "ethers";

export const str = (x: string | undefined) : string => {
    return String(x);
} 

export const bn = (x: string | bigint) => ethers.BigNumber.from(x);
export const toBigInt = (x: string | number) => ethers.BigNumber.from(x).toBigInt();
export const powr = (x: number | string, power: number, decimals: number): ethers.BigNumber => {
    return ethers.BigNumber.from(x).mul(ethers.BigNumber.from(ethers.BigNumber.from(10).pow(decimals))).mul(ethers.BigNumber.from(power));
}