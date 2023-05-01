import { FC } from "react";
import { Textarea, Box, Button } from "@chakra-ui/react";

interface QueryProps {
  subTotal: string;
}

export const Query: FC<QueryProps> = ({ subTotal }) => {
  return (
    <Box>
      <Textarea
        isDisabled={parseInt(subTotal) <= 0}
        placeholder="Fill in your prompt here"
      />
    </Box>
  );
};
