export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
}

export interface ZodiacPrediction {
  sign: string;
  personality: string;
  tradingStyle: string;
  perfectCoin: string;
  cryptoStrength: string;
  weakness: string;
  prediction: string;
  advice: string;
  compatibility: string[];
  luckyNumber: number;
  nftStyle: string;
}

declare global {
  interface Window {
    FrameSDK: any;
    ethereum?: any;
  }
}
