import { FC, use, useEffect, useState } from "react";
import {
  Textarea,
  Box,
  Button,
  Stack,
  Text,
  Center,
  useColorModeValue,
  Select,
  Flex,
  Progress,
} from "@chakra-ui/react";
import { useProvider, useNetwork, useAccount } from "wagmi";
import { ethers } from "ethers";
import { addresses } from "../utils";
import { Answer } from "./use-model/answer";

interface QueryProps {
  subTotal: string;
}

export const Query: FC<QueryProps> = ({ subTotal }) => {
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("Hi, what can I help you with?");
  const [txHash, setTxHash] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");

  const { chain } = useNetwork();
  const { address } = useAccount();
  const networkId = (chain?.id as number) || 11155111;
  const pk = process.env.NEXT_PRIVATE_INTERNAL_PK as string;
  const provider = useProvider();
  const SUB_ABI = require("../contracts/Subscription.json");
  const wallet = new ethers.Wallet(pk, provider);
  const subContract = new ethers.Contract(
    addresses[networkId].subscription as `0x${string}`,
    SUB_ABI,
    wallet
  );

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      try {
        const response = await fetch("/api/regions");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setRegions(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (isLoading) {
      setAnswer("Sure, let me check...");
    }
  }, [isLoading]);

  async function queryTx(functionName: string, ...args: any[]) {
    try {
      const txResponse = await subContract[functionName](...args);

      console.log("Transaction hash:", txResponse.hash);

      const receipt = await txResponse.wait();
      console.log("Transaction receipt:", receipt);
      setTxHash(receipt.transactionHash);
      return receipt.transactionHash;
    } catch (error: any) {
      console.error("Error calling write function:", error);
    }
  }
  const handleUserQuestion = (e: any) => {
    const value = e.target.value;
    setUserQuestion(value);
  };
  const handleQuestion = async () => {
    try {
      if (userQuestion === "") {
        throw new Error("Please ask a question");
      }
      setIsLoading(true);
      let tx = await queryTx("useSubscription", address);
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          txHash: tx,
          address: addresses[networkId].subscription,
          region: selectedRegion,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit responses");
      }
      const data = await response.json();
      setIsLoading(false);
      setAnswer(data.message);
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <Center py={6} paddingBottom={100} paddingTop={10} flexDirection="column">
      <Box
        maxW={"530px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
        marginBottom={7}
      >
        <Stack
          textAlign={"center"}
          p={6}
          color={useColorModeValue("grey.800", "white")}
          align={"center"}
        >
          <Text
            fontSize={"sm"}
            fontWeight={500}
            bg={useColorModeValue("orange.50", "orange.900")}
            p={2}
            px={3}
            color={"white.500"}
            rounded={"full"}
          >
            Select Region
          </Text>
          <Select
            placeholder="Select region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {regions.map((region: any, key) => {
              return (
                <option key={key} value={region.id}>
                  {`${region.city}, ${region.state} | ${region.country}`}
                </option>
              );
            })}
          </Select>
        </Stack>

        <Box bg={useColorModeValue("gray.50", "gray.900")} px={6} py={10}>
          <Textarea
            onChange={handleUserQuestion}
            isDisabled={parseInt(subTotal) <= 0}
            placeholder="question..."
          />
          <Button
            onClick={handleQuestion}
            mt={10}
            w={"full"}
            bg={"orange.400"}
            color={"white"}
            rounded={"xl"}
            boxShadow={"0 5px 20px 0px rgb(232 113 26 / 43%)"}
            _hover={{
              bg: "orange.500",
            }}
            _focus={{
              bg: "orange.500",
            }}
          >
            Ask!
          </Button>
        </Box>
        {isLoading ? (
          <Progress size="xs" isIndeterminate colorScheme="orange" />
        ) : null}
      </Box>

      <Answer answer={answer} />
    </Center>
  );
};
