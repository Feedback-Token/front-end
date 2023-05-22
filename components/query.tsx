import { FC, useState } from "react";
import { Textarea, Box, Button } from "@chakra-ui/react";

interface QueryProps {
  subTotal: string;
}

export const Query: FC<QueryProps> = ({ subTotal }) => {
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const handleUserQuestion = (e: any) => {
    const value = e.target.value;
    setUserQuestion(value);
  };
  const handleQuestion = async () => {
    try {
      if (userQuestion === "") {
        throw new Error("Please ask a question");
      }
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit responses");
      }
      const data = await response.json();
      setAnswer(data.message);
    } catch (error: any) {}
  };
  return (
    <Box>
      <Textarea
        onChange={handleUserQuestion}
        isDisabled={parseInt(subTotal) <= 0}
        placeholder="Fill in your prompt here"
      />
      <Button onClick={handleQuestion}>Ask</Button>
      <Box>{answer}</Box>
    </Box>
  );
};
