import { readContract, prepareWriteContract, writeContract } from "@wagmi/core";
const TOKEN_ABI = require("../contracts/Token.json");
const SUB_ABI = require("../contracts/Subscription.json");
const REWARDS_ABI = require("../contracts/Rewards.json");
const VE_ABI = require("../contracts/Escrow.json");
import { formatEther } from "ethers/lib/utils";
import { BigNumber, ethers } from "ethers";

export const shortenAddress = (addr: string): string =>
  `${addr.substring(0, 6)}...${addr.slice(addr.length - 4)}`;

type AddressRecord = {
  [key: number]: {
    subscription: string;
    token: string;
    rewardsPool: string;
    veToken: string;
  };
};
export const addresses: AddressRecord = {
  11155111: {
    subscription: "0x0bfBD34e34C3f0E97F3232D67eF00aF8dA54eDcf",
    token: "0x6add4328327E6b66eA13AE64957B312fa210fCdd",
    rewardsPool: "0x061112Aa73f75Ca4Da88c92275116ad74F880205",
    veToken: "0xD016adDe6C97099143C6f7C6652F82d18B241845",
  },
};

export const calculateTimeLock = (
  timeInMonths: number,
  amountInEth: string
): string => {
  const secondsInAMonth = BigNumber.from((30.44 * 24 * 60 * 60).toFixed());
  const maxTime = BigNumber.from(4 * 60 * 60 * 24 * 365);
  const maxMonths = 48;
  let bigNumberAmount = ethers.utils.parseEther(amountInEth);
  const timeInSeconds = BigNumber.from(timeInMonths).mul(secondsInAMonth);

  if (maxMonths === timeInMonths) {
    // Return the full amount
    return formatEther(bigNumberAmount);
  } else {
    const veTokenAmount = bigNumberAmount.mul(timeInSeconds).div(maxTime);
    return formatEther(veTokenAmount);
  }
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
    throw new Error(`Error getting token balance: ${error.message}`);
  }
};

export const getSubBalance = async (address: string) => {
  const token = addresses[11155111].subscription;
  try {
    const data = await readContract({
      address: token as `0x${string}`,
      abi: SUB_ABI,
      functionName: "getSubscription",
      args: [address],
    });
    return formatEther(BigNumber.from(data?._hex));
  } catch (error: any) {
    throw new Error(`Error getting subscription balance: ${error.message}`);
  }
};

export const getRewardBalance = async (address: string) => {
  const contract = addresses[11155111].rewardsPool;
  try {
    const data = await readContract({
      address: contract as `0x${string}`,
      abi: REWARDS_ABI,
      functionName: "getAvailableRewards",
      args: [address],
    });
    return formatEther(BigNumber.from(data?._hex));
  } catch (error: any) {
    throw new Error(`Error getting reward balance: ${error.message}`);
  }
};

export const getVEBalance = async (address: string) => {
  const contract = addresses[11155111].veToken;
  try {
    const data = await readContract({
      address: contract as `0x${string}`,
      abi: VE_ABI,
      functionName: "balanceOf",
      args: [address],
    });
    return formatEther(BigNumber.from(data?._hex));
  } catch (error: any) {
    throw new Error(`Error getting Escrow balance: ${error.message}`);
  }
};

export const lockTokens = async (
  amount: string,
  networkId: number,
  timeLock: number,
  progressCallback: (progress: number) => void,
  loadingCallback: (loading: boolean) => void,
  isOpenCallback: () => void
) => {
  try {
    const encodedRaffleParams = ethers.utils.defaultAbiCoder.encode(
      ["uint256"],
      [timeLock * 30 * 24 * 60 * 60]
    );
    const paramsConfig = {
      address: addresses[networkId].token as `0x${string}`,
      abi: TOKEN_ABI,
      functionName: "transferAndCall",
      args: [
        addresses[networkId].rewardsPool,
        ethers.utils.parseEther(amount),
        encodedRaffleParams,
      ],
    };
    const config = await prepareWriteContract(paramsConfig);
    const data = await writeContract(config);
    isOpenCallback();
    loadingCallback(true);
    progressCallback(30);
    const isSuccess = await data.wait().then((receipt) => receipt.status === 1);
    if (!isSuccess) throw new Error("Transaction failed");
    progressCallback(80);
    await sleep(2000);
    loadingCallback(false);
  } catch (error: any) {
    throw new Error(`Error locking tokens: ${error.message}`);
  }
};

export const toEth = (wei: string): string => {
  const number = parseFloat(wei);
  const roundedNumber = number.toFixed(3);
  const stringWith3DecimalPlaces = roundedNumber.toString();
  return stringWith3DecimalPlaces;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
