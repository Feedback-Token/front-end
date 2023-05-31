import { FC, useState } from "react";
import {
  Box,
  Center,
  Text,
  Stack,
  List,
  ListItem,
  ListIcon,
  Button,
  useColorModeValue,
  Icon,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";

import { calculateTimeLock, toEth } from "../../utils";

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
  const [months, setMonths] = useState(12);
  const [veTotal, setVETotal] = useState("0");
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
          <Text fontSize={"2xl"}>{months} months</Text>

          <RangeSlider
            colorScheme="orange"
            defaultValue={[12]}
            step={1}
            max={48}
            min={1}
            onChangeEnd={(val) => {
              const amount = calculateTimeLock(val[0], fbtAmount);

              setMonths(val[0]);
              fbtAmount ? setVETotal(toEth(amount)) : null;
            }}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0}>
              <CircleIcon boxSize={6} color="orange.100" />
            </RangeSliderThumb>
          </RangeSlider>
          <Button
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
        </Box>
      </Box>
    </Center>
  );
};
