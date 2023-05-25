import { FC, useState, useEffect, use } from "react";
import { Layout } from "../components/layout";
import { NextPage } from "next";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Input,
  Select,
} from "@chakra-ui/react";
import { Query } from "@/components/query";
import { useAppState } from "../hooks/app-hooks";
import { ethers } from "ethers";
import { TopUpCard } from "@/components/use-model/top-up-card";
const UseModel: NextPage = () => {
  const { subToken } = useAppState();
  const [amount, setAmount] = useState("");
  const [isValidAmount, setIsValidAmount] = useState(true);
  console.log(subToken, "subtoken");

  useEffect(() => {
    console.log(subToken, "subtoken");
  }, [subToken]);
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
      {subToken == "0.0" ? <TopUpCard /> : <Query subTotal={subToken} />}
    </Layout>
  );
};
export default UseModel;
