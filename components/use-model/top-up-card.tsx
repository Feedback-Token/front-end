import {
  Box,
  Center,
  useColorModeValue,
  Input,
  Text,
  Stack,
  Image,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
} from "@chakra-ui/react";
import { FC, useState, useEffect } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useAccount,
} from "wagmi";
import { addresses } from "../../utils";
import { ethers } from "ethers";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { getSubBalance } from "../../utils";
import { useAppState } from "../../hooks/app-hooks";

const IMAGE = "/images/braincloud.png";

export const TopUpCard: FC = () => {
  const [amount, setAmount] = useState("0");
  const [amountInWei, setAmountInWei] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState(20);
  const [isValidAmount, setIsValidAmount] = useState(false);
  const TOKEN_ABI = require("../../contracts/Token.json");
  const { chain } = useNetwork();
  const networkId = (chain?.id as number) || 11155111;
  const toast = useToast();
  const account = useAccount();
  const { setSubToken } = useAppState();

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

  const topUpSubscription = async () => {
    console.log(amountInWei, "amountInWei");
    try {
      let convertedAmountInWei;
      if (isValidAmount) {
        convertedAmountInWei = ethers.utils.parseEther(amount).toString();
      } else {
        setError("Invalid amount");
        return;
      }

      const paramsConfig = {
        address: addresses[networkId].token as `0x${string}`,
        abi: TOKEN_ABI,
        functionName: "transferAndCall",
        args: [addresses[networkId].subscription, convertedAmountInWei, "0x00"],
      };
      const config = await prepareWriteContract(paramsConfig);
      const data = await writeContract(config);
      onOpen();
      setIsLoading(true);
      const isSuccess = await data
        .wait()
        .then((receipt) => receipt.status === 1);
      setProgress(80);
      if (!isSuccess) throw new Error("Request to top up was not successful");
      setIsLoading(false);
      setSubToken(amount);
      return data;
    } catch (error: any) {
      setError(error.message);
    }
  };
  const handleAmountChange = (e: any) => {
    const value = String(e.target.value);
    setAmount(value);

    // Validate input
    const regex = /^\d+(\.\d{0,18})?$/;
    const isValidAmountNow = regex.test(value);
    setIsValidAmount(isValidAmountNow);
  };
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${IMAGE})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            alt="top up subscription"
            rounded={"lg"}
            height={230}
            width={282}
            objectFit={"cover"}
            src={IMAGE}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Text color={"gray.500"} fontSize={"sm"} textTransform={"uppercase"}>
            Top Up
          </Text>
          <Input placeholder="0.0" onChange={handleAmountChange} />
          <Stack direction={"row"} align={"center"}>
            <Button
              disabled={false}
              onClick={async () => {
                await topUpSubscription();
              }}
            >
              Fill subscription
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Topping Up Subscription</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Progress value={progress} size="xs" colorScheme="orange" />
            ) : (
              <Text>Subscription Updated!</Text>
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
    </Center>
  );
};
