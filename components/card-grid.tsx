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
} from "@chakra-ui/react";

export const CardGrid: FC = () => {
  return (
    <Flex>
      <SimpleGrid spacing={10} flexWrap="wrap" display="flex">
        <Card>
          <CardHeader>
            <Heading size="md">Train Model</Heading>
          </CardHeader>
          <CardBody>
            <Text>Get paid to train AI models</Text>
          </CardBody>
          <CardFooter>
            <Link href="/train-model">
              <Button>View</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Heading size="md">Use Model</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              Get real time information on destionations around the world
              trained by users in that area.
            </Text>
          </CardBody>
          <CardFooter>
            <Link href="/use-model">
              <Button>View</Button>
            </Link>
          </CardFooter>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};
