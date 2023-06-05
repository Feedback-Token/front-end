import { FC, useEffect, useState } from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { getSubBalance, getVEBalance, getTokenBalance } from "../utils";
import { useAccount } from "wagmi";

export const UserData: FC = () => {
  const [veBalance, setVeBalance] = useState("0.0");
  const [fbtBalance, setFbtBalance] = useState("0.0");
  const [subBalance, setSubBalance] = useState("0.0");
  const [itemLoaded, setLoaded] = useState(false);
  const account = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getSubBalance(account.address as string);
        const veTokens = await getVEBalance(account.address as string);
        const fbtTokens = await getTokenBalance(account.address as string);

        setSubBalance(balance);
        setVeBalance(veTokens);
        setFbtBalance(fbtTokens);
        setLoaded(true);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [account.address]);

  return (
    <>
      {itemLoaded ? (
        <Center justifyContent={"space-between"} maxW={"full"}>
          <Stat>
            <StatLabel>Wallet Balance</StatLabel>
            <StatNumber>{fbtBalance}</StatNumber>
            <StatHelpText>FBT</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Subscription Balance</StatLabel>
            <StatNumber>{subBalance}</StatNumber>
            <StatHelpText>FBT</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Locked Tokens</StatLabel>
            <StatNumber>{veBalance}</StatNumber>
            <StatHelpText>veFBT</StatHelpText>
          </Stat>
        </Center>
      ) : (
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="orange.200"
            color="orange.500"
            size="xl"
          />
        </Center>
      )}
    </>
  );
};
