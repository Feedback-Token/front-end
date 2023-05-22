import { FC, useState } from "react";
import { Textarea, Box, Button, Input } from "@chakra-ui/react";
import { useContractWrite, usePrepareContractWrite, useNetwork } from "wagmi";
import { addresses } from "../utils";
import { ethers } from "ethers";

interface QueryProps {
  _amount: string;
}
const TOKEN_ABI = require("../contracts/Token.json");
export const FillSub: FC<QueryProps> = ({ _amount }) => {
  const { chain } = useNetwork();
  const networkId = (chain?.id as number) || 11155111;
  const { config } = usePrepareContractWrite({
    address: addresses[networkId].token as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: "transferAndCall",
    args: [
      addresses[networkId].subscription,
      ethers.utils.parseEther("1").toString(),
      "0x00",
    ],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <Button disabled={!write} onClick={() => write?.()}>
      Fill subscription
    </Button>
  );
};
