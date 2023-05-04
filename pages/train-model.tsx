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

interface ModelPrompts {
  category: string;
  questions: string[];
}

const TrainModel: NextPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userResponses, setUserResponses] = useState<Response[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
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
        console.log(data);
        setData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  interface Response {
    question: string;
    response: string;
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

  const handleSubmit = async () => {
    try {
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
      }

      // TODO show a success message or redirect to another page
    } catch (error) {
      // TODO need to handle this still
    }
  };
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
      <Select
        placeholder="Select region"
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
      >
        <option value="Austin, TX">Austin, TX</option>
        <option value="Dallas, TX">Dallas, TX</option>
        <option value="Houston, TX">Houston, TX</option>
      </Select>
      <div>
        {data.map((question: ModelPrompts, key) => {
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
        })}
      </div>
      <br />
      <Box display="flex" justifyContent="center">
        <Button
          size="lg"
          variant="solid"
          colorScheme="orange"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Layout>
  );
};
export default TrainModel;
