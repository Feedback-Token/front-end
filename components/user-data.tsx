import { FC } from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Flex,
  Box,
  Container,
} from "@chakra-ui/react";
import { useSigner } from "wagmi";
import { useAppState } from "../hooks/app-hooks";

export const UserData: FC = () => {
  const { subToken, tokenAmount } = useAppState();

  const {
    data: signer,
    error: signerError,
    isLoading: signerLoading,
  } = useSigner();

  return (
    <Flex>
      <Stat>
        <StatLabel>Wallet Balance</StatLabel>
        <StatNumber>{tokenAmount}</StatNumber>
        <StatHelpText>FBT</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Subscription Balance</StatLabel>
        <StatNumber>{subToken}</StatNumber>
        <StatHelpText>FBT</StatHelpText>
      </Stat>
      {/* <Stat>
        <StatLabel>Function Balance</StatLabel>
        <StatNumber>3</StatNumber>
        <StatHelpText>LINK</StatHelpText>
      </Stat> */}
    </Flex>
  );
};
