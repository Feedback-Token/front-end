import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import {
  FcAbout,
  FcAssistant,
  FcCollaboration,
  FcDonate,
  FcManager,
} from "react-icons/fc";

interface CardProps {
  heading: string;
  description: string;
  icon: ReactElement;
  href: string;
}

const Card = ({ heading, description, icon, href }: CardProps) => {
  return (
    <Box
      maxW={{ base: "full", md: "275px" }}
      w={"full"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
    >
      <Stack align={"start"} spacing={2}>
        <Flex
          w={16}
          h={16}
          align={"center"}
          justify={"center"}
          color={"white"}
          rounded={"full"}
          bg={useColorModeValue("gray.100", "gray.700")}
        >
          {icon}
        </Flex>
        <Box mt={2}>
          <Heading size="md">{heading}</Heading>
          <Text mt={1} fontSize={"sm"}>
            {description}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default function GridListWith() {
  return (
    <Box p={4}>
      <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
        <Heading fontSize={{ base: "2xl", sm: "4xl" }} fontWeight={"bold"}>
          Get Paid to Train AI Models
        </Heading>
        <Text color={"gray.600"} fontSize={{ base: "sm", sm: "lg" }}>
          Elevating your travels, BrainCloud merges AI and token economics to
          deliver personalized, real-time city advice, while empowering you to
          earn exciting rewards by shaping the very models that guide your
          journey!
        </Text>
      </Stack>

      <Container maxW={"5xl"} mt={12}>
        <Flex flexWrap="wrap" gridGap={6} justify="center">
          <Card
            heading={"AI Travel Assistant"}
            icon={<Icon as={FcAssistant} w={10} h={10} />}
            description={
              "From finding hidden local gems to avoiding peak-hour traffic, our AI Assistant is your real-time, intelligent travel guide."
            }
            href={"#"}
          />
          <Card
            heading={"$FBT Rewards"}
            icon={<Icon as={FcCollaboration} w={10} h={10} />}
            description={
              "Refine city models with your travel expertise and watch your FBT token balance grow."
            }
            href={"#"}
          />
          <Card
            heading={"Get Paid"}
            icon={<Icon as={FcDonate} w={10} h={10} />}
            description={"Get paid to train AI models about your local area."}
            href={"#"}
          />
        </Flex>
      </Container>
    </Box>
  );
}
