import { readContract } from "@wagmi/core";
const TOKEN_ABI = require("../contracts/Token.json");
import { formatEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";

export const shortenAddress = (addr: string): string =>
  `${addr.substring(0, 6)}...${addr.slice(addr.length - 4)}`;

type AddressRecord = {
  [key: number]: {
    subscription: string;
    token: string;
  };
};
export const addresses: AddressRecord = {
  11155111: {
    subscription: "0x44785819b9d2fA30Afd69d48c3c48fF149CAb297",
    token: "0x6add4328327E6b66eA13AE64957B312fa210fCdd",
  },
};

export const getTokenBalance = async (address: string) => {
  const token = addresses[11155111].token;
  try {
    const data = await readContract({
      address: token as `0x${string}`,
      abi: TOKEN_ABI,
      functionName: "balanceOf",
      args: [address],
    });
    return formatEther(BigNumber.from(data?._hex));
  } catch (error: any) {
    throw new Error(`Error getting claimable link: ${error.message}`);
  }
};
