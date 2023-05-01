import { FC } from "react";
import { Textarea, Box, Button } from "@chakra-ui/react";

interface QueryProps {
  subTotal: number;
}

export const Query: FC<QueryProps> = ({ subTotal }) => {
  return (
    <Box>
      <Textarea
        isDisabled={subTotal <= 0}
        placeholder="Fill in your prompt here"
      />
    </Box>
  );
};
