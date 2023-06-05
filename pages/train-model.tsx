import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { NextPage } from "next";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Center,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  Text,
  useToast,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useProvider, useNetwork, useAccount } from "wagmi";
import { addresses } from "../utils";
interface ModelPrompts {
  category: string;
  questions: string[];
}

const TOKEN_ABI = require("../contracts/Token.json");

const TrainModel: NextPage = () => {
  const [data, setData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userResponses, setUserResponses] = useState<Response[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [progress, setProgress] = useState(20);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const provider = useProvider();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const toast = useToast();
  const networkId = (chain?.id as number) || 11155111;
  const pk = process.env.NEXT_PRIVATE_INTERNAL_PK as string;
  const wallet = new ethers.Wallet(pk, provider);
  const tokenContract = new ethers.Contract(
    addresses[networkId].token as `0x${string}`,
    TOKEN_ABI,
    wallet
  );
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/prompt");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }

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
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
    setError(null);
  }, [error, toast]);

  interface Response {
    question: string;
    response: string;
  }
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function trainReward(functionName: string, ...args: any[]) {
    try {
      setIsLoading(true);
      const txResponse = await tokenContract[functionName](...args);
      setProgress(75);
      console.log("Transaction hash:", txResponse.hash);

      const receipt = await txResponse.wait();
      console.log("Transaction receipt:", receipt);
      setProgress(100);
      await sleep(1000);
    } catch (error: any) {
      console.error("Error calling write function:", error);
      setError("Error sending tokens");
    }
  }

  const handleInputChange = (e: any, question: any) => {
    const responseIndex = userResponses.findIndex(
      (response: Response) => response.question === question
    );

    if (responseIndex === -1) {
      setUserResponses([
        ...userResponses,
        { question: question, response: e.target.value },
      ]);
    } else {
      const updatedResponses: Response[] = [...userResponses];
      updatedResponses[responseIndex].response = e.target.value;
      setUserResponses(updatedResponses);
    }
  };

  useEffect(() => {
    const checkFormValidity = () => {
      const totalQuestions = data.reduce(
        (count, item: ModelPrompts) => count + item.questions.length,
        0
      );
      const isFormValid = userResponses.length === totalQuestions;
      setIsFormValid(isFormValid);
    };
    checkFormValidity();
  }, [userResponses, data]);

  const handleSubmit = async () => {
    try {
      if (selectedRegion === "") {
        throw new Error("Please select a region");
      }
      const response = await fetch("/api/submitResponses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responses: userResponses,
          modelId: selectedRegion,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit responses");
      } else {
        onOpen();
        await trainReward(
          "send",
          address,
          process.env.NEXT_PUBLIC_TRAINING_REWARD as string
        );
        setIsLoading(false);
        setProgress(20);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };
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
          <BreadcrumbLink href="/train-model">Train-Model</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Divider />
      <br />
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
      <div>
        {isLoading ? (
          <Center marginTop={"200px"} marginBottom={"200px"}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="orange.200"
              color="orange.500"
              size="xl"
            />
          </Center>
        ) : (
          data.map((question: ModelPrompts, key) => {
            return (
              <div key={key}>
                <br />
                <Heading>{question.category}</Heading>
                <br></br>
                {question.questions.map((question, key) => {
                  return (
                    <FormControl key={key} isRequired>
                      <FormLabel>{question}</FormLabel>
                      <Input
                        placeholder="feedback"
                        onChange={(e) => handleInputChange(e, question)}
                      />
                    </FormControl>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
      <br />
      <Box display="flex" justifyContent="center">
        <Tooltip isDisabled={isFormValid} label="All fields must be completed">
          <Button
            size="lg"
            variant="solid"
            colorScheme="orange"
            onClick={() => {
              handleSubmit();
            }}
            isDisabled={!isFormValid}
          >
            Submit
          </Button>
        </Tooltip>
      </Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Claiming Rewards</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Progress value={progress} size="xs" colorScheme="orange" />
            ) : (
              <Text>Tokens Received!</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              size="lg"
              variant="solid"
              colorScheme="orange"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};
export default TrainModel;
