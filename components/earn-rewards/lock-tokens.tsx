import { FC, useState } from "react";
import {
  Box,
  Center,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Icon,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Input,
  Tooltip,
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
import { useNetwork } from "wagmi";
import { calculateTimeLock, toEth, lockTokens } from "../../utils";

interface CardProps {
  veAmount: string;
  fbtAmount: string;
}

const CircleIcon = (props: any) => (
  <Icon viewBox="0 0 200 200" {...props}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);

export const LockTokens: FC<CardProps> = ({ veAmount, fbtAmount }) => {
  const [months, setMonths] = useState(0);
  const [veTotal, setVETotal] = useState("0");
  const [amount, setAmount] = useState("0");
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [toolTipDisabled, setToolTipDisabled] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(20);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { chain } = useNetwork();
  const networkId = (chain?.id as number) || 11155111;

  const handleAmountChange = (e: any) => {
    const value = String(e.target.value);
    setAmount(value);
    setToolTipDisabled(true);
    setButtonDisabled(false);
    if (parseInt(value) > parseInt(fbtAmount)) {
      setToolTipDisabled(false);
      setButtonDisabled(true);
    }

    // Validate input
    const regex = /^\d+(\.\d{0,18})?$/;
    const isValidAmountNow = regex.test(value);
    setIsValidAmount(isValidAmountNow);
  };

  return (
    <Center py={100}>
      <Box
        maxW={"330px"}
        minW="330px"
        minH={"300px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Stack
          minH={"150"}
          textAlign={"center"}
          p={6}
          color={useColorModeValue("gray.800", "white")}
          align={"center"}
        >
          <Text
            fontSize={"sm"}
            fontWeight={500}
            bg={useColorModeValue("orange.400", "orange.800")}
            p={2}
            px={3}
            color={"white.500"}
            rounded={"full"}
          >
            {"Receive"}
          </Text>
          <Stack direction={"row"} align={"center"} justify={"center"}>
            <Text fontSize={"3xl"}>Ξ</Text>
            <Text fontSize={"6xl"} fontWeight={800}>
              {veTotal}
            </Text>
            <Text color={"gray.500"}>/veFBT</Text>
          </Stack>
        </Stack>

        <Box
          bg={useColorModeValue("gray.50", "gray.900")}
          px={6}
          py={10}
          minH={"150px"}
        >
          <Input
            placeholder="0.0 FBT"
            isInvalid={!toolTipDisabled}
            errorBorderColor="red.300"
            onChange={handleAmountChange}
            marginBottom={5}
          />
          <Text fontSize={"2xl"}>{months} months</Text>

          <RangeSlider
            colorScheme="orange"
            defaultValue={[1]}
            step={1}
            max={48}
            min={1}
            onChangeEnd={(val) => {
              const _amount = calculateTimeLock(val[0], amount);

              setMonths(val[0]);
              fbtAmount ? setVETotal(toEth(_amount)) : null;
            }}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0}>
              <CircleIcon boxSize={6} color="orange.100" />
            </RangeSliderThumb>
          </RangeSlider>
          <Tooltip isDisabled={toolTipDisabled} label="Not enough FBT!">
            <Button
              onClick={async () => {
                await lockTokens(
                  amount,
                  networkId,
                  months,
                  setProgress,
                  setIsLoading,
                  onOpen
                );
              }}
              isDisabled={buttonDisabled}
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
              {"Lock Tokens"}
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Locking Tokens</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Progress value={progress} size="xs" colorScheme="orange" />
            ) : (
              <Text>Tokens Locked!</Text>
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
