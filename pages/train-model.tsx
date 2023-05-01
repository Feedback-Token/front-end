import { FC } from "react";
import { Layout } from "../components/layout";
import { NextPage } from "next";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
} from "@chakra-ui/react";
const TrainModel: NextPage = () => {
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
    </Layout>
  );
};
export default TrainModel;
