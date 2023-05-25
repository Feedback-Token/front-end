import { FC } from "react";
import {
  SimpleGrid,
  Card,
  Heading,
  CardHeader,
  CardFooter,
  CardBody,
  Text,
  Button,
  Link,
  Flex,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import { Card as DashboardCard } from "./dashboard/card";

export const CardGrid: FC = () => {
  return (
    <Center justifyContent={"space-around"} maxW={"5xl"} flexWrap={"wrap"}>
      <DashboardCard
        name="Train Model"
        about={"Get paid to train AI models."}
        link="/train-model"
        buttonName="Start Training"
      />
      <DashboardCard
        name="Use Model"
        about="Get real time information on destionations around the world
          trained by users in that area."
        link="/use-model"
        buttonName="Start Using"
      />
    </Center>
  );
};
