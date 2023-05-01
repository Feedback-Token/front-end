import { FC } from "react";
import { Textarea, Box, Button } from "@chakra-ui/react";

export const Query: FC = ({ subTotal }) => {
  return (
    <Box>
      <Textarea
        isDisabled={subTotal <= 0}
        placeholder="Fill in your prompt here"
      />
    </Box>
  );
};
