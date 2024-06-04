import React, { CSSProperties } from "react";
import { zeroAddress } from "viem";

export type FunctionName = "deposit" | "checkout" | "withdraw" | "getProfile" | "balanceOf" ;
export type OxString = `0x${string}`;
export type WagmiConfig = import('wagmi').Config;
export const formatAddr = (x: string | (OxString | undefined)) : OxString => {
    if(!x || x === "") return `0x${'0'.repeat(40)}`;
    return `0x${x.substring(2, 42)}`;
};

export interface NotificationProps {
  message: string | JSX.Element;
  description: string | JSX.Element;
}

export interface PageProps {
  isUserAuthenticated: boolean;
  setAuthenticating: () => void;
  isAuthenticating: boolean;
  setauthentication: (x:boolean) => void;
  setAccount: (x:string) => void;
}

export interface AddressProp {
  account?: string;
  isAuthenticated?: boolean;
  styleAvatarLeft?: CSSProperties;
  styleAvatarRight?: CSSProperties;
  style?: CSSProperties;
  copyable?: boolean;
  styleCopy?: CSSProperties;
  avatar?: 'right' | 'left';
  display?: boolean;
  textStyle?: CSSProperties;
  size?: number;
  chainId?: SVGStringList;
}

export interface Explorer {
  address: string | null | undefined;
  chainId: any;
} 

export interface Profile {
  ethAmount: bigint;
  depositTime: bigint;
  wallet: OxString;
}

export class MockProfile {
  profile: Profile;

  constructor() {
    this.profile = {
      depositTime: 0n,
      ethAmount: 0n,
      wallet: zeroAddress
    }
  }
}

export interface AppProps {
  account: string;
}

export interface TransactionResultProps {
  view: boolean;
  reward?: bigint;
  profile?: Profile;
}

export const transactionResult :TransactionResultProps = {
  view: false,
}

export interface SpinnerProps {
  color: string;
  rest?: React.CSSProperties
}