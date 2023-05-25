import { FC } from "react";
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
  Link,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

interface CardProps {
  name: string;
  about: string;
  link: string;
  buttonName: string;
}

export const Card: FC<CardProps> = ({ name, about, link, buttonName }) => {
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
            {name}
          </Text>
          <Stack direction={"row"} align={"center"} justify={"center"}>
            <Text fontSize={"1xl"}>{about}</Text>
          </Stack>
        </Stack>

        <Box
          bg={useColorModeValue("gray.50", "gray.900")}
          px={6}
          py={10}
          minH={"150px"}
        >
          <Link href={link}>
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
              {buttonName}
            </Button>
          </Link>
        </Box>
      </Box>
    </Center>
  );
};
