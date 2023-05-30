import { FC, useState, useEffect, use } from "react";
import { Layout } from "../components/layout";
import { NextPage } from "next";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Input,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { Query } from "@/components/query";
import { useAppState } from "../hooks/app-hooks";
import { ethers } from "ethers";
import { TopUpCard } from "@/components/use-model/top-up-card";
import { getSubBalance } from "../utils";
import { useAccount } from "wagmi";
const ClaimRewards: NextPage = () => {
  const { subToken } = useAppState();
  const account = useAccount();
  const [amount, setAmount] = useState("0.0");
  const [itemLoaded, setLoaded] = useState(false);
  console.log(subToken, "subtoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getSubBalance(account.address as string);
        console.log(balance, "balance");
        setAmount(balance);
        setLoaded(true);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [account.address, subToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getSubBalance(account.address as string);
        console.log(balance, "balance");
        setAmount(balance);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [account.address]);
  return (
    <Layout title="Vernari Protocol">
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
        amount == "0.0" ? (
          <TopUpCard />
        ) : (
          <Query subTotal={subToken} />
        )
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
export default ClaimRewards;
