import { FC } from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Center,
} from "@chakra-ui/react";
import { useAppState } from "../hooks/app-hooks";

export const UserData: FC = () => {
  const { subToken, tokenAmount } = useAppState();

  return (
    <Center justifyContent={"space-between"} maxW={"full"}>
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
      <Stat>
        <StatLabel>Locked Tokens</StatLabel>
        <StatNumber>3</StatNumber>
        <StatHelpText>veFBT</StatHelpText>
      </Stat>
    </Center>
  );
};
