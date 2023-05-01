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
import { Query } from "@/components/query";
import { useAppState } from "../hooks/app-hooks";
const UseModel: NextPage = () => {
  const { subToken } = useAppState();

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
          <BreadcrumbLink href="/use-model">Use-Model</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Divider />
      <Query subTotal={subToken} />
    </Layout>
  );
};
export default UseModel;
