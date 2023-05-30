import { FC } from "react";
import { Center } from "@chakra-ui/react";
import { Card as DashboardCard } from "./dashboard/card";

export const CardGrid: FC = () => {
  return (
    <Center justifyContent={"space-between"} maxW={"full"} flexWrap={"wrap"}>
      <DashboardCard
        name="Train Model"
        about={"Get paid to train AI models."}
        link="/train-model"
        buttonName="Start Training"
      />
      <DashboardCard
        name="Use Model"
        about="Get real time information on destinations around the world
          trained by users in that area."
        link="/use-model"
        buttonName="Start Using"
      />
      <DashboardCard
        name="Lock Tokens"
        about="Lock your tokens to earn rewards and governance rights."
        link="/claim-rewards"
        buttonName="Start Claiming"
      />
    </Center>
  );
};
