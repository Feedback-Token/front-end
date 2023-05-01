import { Container } from "@chakra-ui/react";
import GridListWith from "./landing-page/card-wrapper";
import Hero from "./landing-page/hero";

export default function LandingPage() {
  return (
    <Container maxW={"5xl"}>
      <Hero />
      <GridListWith />
    </Container>
  );
}
