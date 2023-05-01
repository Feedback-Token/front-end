// import { Logo } from '../img/logo';
// import { ColorModeSwitcher } from "./color-mode-switcher";
// import { MobileMenu } from "./mobile-menu";
import { StandardMenu } from "./standard-menu";
import { Wallet } from "./wallet";
import { Flex, Link, Heading } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import {
  useContractRead,
  useSigner,
  useProvider,
  useAccount,
  useNetwork,
} from "wagmi";
import { BigNumber, ContractTransaction } from "ethers";
import { formatEther, getAddress, isAddress } from "ethers/lib/utils";
import { useAppState } from "../hooks/app-hooks";
import { addresses } from "../utils";

interface NavBarProps {
  width: number;
  paddingX?: string[];
}

export const NavBar: FC<NavBarProps> = ({ width, paddingX }) => {
  const { setSubToken, setTokenAmount } = useAppState();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const TOKEN_ABI = require("../contracts/Token.json");
  const SUB_ABI = require("../contracts/Subscription.json");
  const networkId = (chain?.id as number) || 11155111;

  const { data } = useContractRead({
    address: addresses[networkId].token as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address],
  });
  const { data: subData } = useContractRead({
    address: addresses[networkId].subscription as `0x${string}`,
    abi: SUB_ABI,
    functionName: "getSubscription",
    args: [address],
  });
  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    if (!data?._hex || !subData?._hex) return;
    const tokenWeiValue = BigNumber.from(data?._hex);
    const subWeiValue = BigNumber.from(subData?._hex);
    setTokenAmount(formatEther(tokenWeiValue));
    setSubToken(formatEther(subWeiValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      height={["8vh", "10vh", "12vh"]}
      bg="white"
      boxShadow="Dark lg"
      padding={paddingX}
    >
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Heading color="black" size="lg" letterSpacing={2}>
          <Link style={{ textDecoration: "none" }} href="/">
            BrainCloud
          </Link>
        </Heading>
      </Flex>
      <Wallet />

      {<StandardMenu width={width} />}
    </Flex>
  );
};
