import { FC, useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { NextPage } from "next";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Textarea,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  Button,
} from "@chakra-ui/react";

const TrainModel: NextPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:5000/api/prompt");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log(data);
        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
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
          <BreadcrumbLink href="/train-model">Train-Model</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Divider />
      <br />
      <Select placeholder="Select region">
        <option value="option1">Austin, TX</option>
        <option value="option2">Dallas, TX</option>
        <option value="option3">Houston, TX</option>
      </Select>
      <div>
        {data.map((question, key) => {
          return (
            <div key={key}>
              <br />
              <Heading>{question.category}</Heading>
              <br></br>
              {question.questions.map((question, key) => {
                return (
                  <FormControl key={key} isRequired>
                    <FormLabel>{question}</FormLabel>
                    <Input placeholder="feedback" />
                  </FormControl>
                );
              })}
            </div>
          );
        })}
      </div>
      <br />
      <Box display="flex" justifyContent="center">
        <Button size="lg" variant="solid" colorScheme="orange">
          Submit
        </Button>
      </Box>
    </Layout>
  );
};
export default TrainModel;
