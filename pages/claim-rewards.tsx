import { useState, useEffect } from "react";
import { Layout } from "../components/layout";
import { NextPage } from "next";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { ClaimRewards } from "@/components/earn-rewards/claim-rewards";
import { LockTokens } from "@/components/earn-rewards/lock-tokens";
import { getRewardBalance, getVEBalance, getTokenBalance } from "../utils";
import { useAccount } from "wagmi";
const EarnRewards: NextPage = () => {
  const account = useAccount();
  const [rewards, setRewards] = useState("0.0");
  const [veBalance, setVeBalance] = useState("0.0");
  const [fbtBalance, setFbtBalance] = useState("0.0");
  const [itemLoaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getRewardBalance(account.address as string);
        const veTokens = await getVEBalance(account.address as string);
        const fbtTokens = await getTokenBalance(account.address as string);
        setRewards(balance);
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
    <Layout title="BrainCloud">
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href="/claim-rewards">Claim-Rewards</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Divider />
      {itemLoaded ? (
        <Center justifyContent={"space-around"}>
          <LockTokens veAmount={veBalance} fbtAmount={fbtBalance} />
          <ClaimRewards rewards={rewards} veAmount={veBalance} />
        </Center>
      ) : (
        <Center marginTop={"200px"} marginBottom={"200px"}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="orange.200"
            color="orange.500"
            size="xl"
          />
        </Center>
      )}
    </Layout>
  );
};
export default EarnRewards;
