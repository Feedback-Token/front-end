import { FC, useState } from "react";
import { Layout } from "../components/layout";
import { NextPage } from "next";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Input,
} from "@chakra-ui/react";
import { Query } from "@/components/query";
import { useAppState } from "../hooks/app-hooks";
import { FillSub } from "@/components/fill-subscription";
import { ethers } from "ethers";
const UseModel: NextPage = () => {
  const { subToken } = useAppState();
  const [amount, setAmount] = useState("");
  const [isValidAmount, setIsValidAmount] = useState(true);

  const handleAmountChange = (e: any) => {
    const value = e.target.value;
    setAmount(value);

    // Validate input
    const regex = /^\d+(\.\d{0,18})?$/;
    setIsValidAmount(regex.test(value));
    console.log(isValidAmount);
    if (isValidAmount) {
      const amountInWei = ethers.utils.parseEther(amount);
      setAmount(amountInWei.toString());
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
          <BreadcrumbLink href="/use-model">Use-Model</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Divider />
      <Input placeholder="Basic usage" onChange={handleAmountChange} />
      <FillSub _amount={amount} />
      <Query subTotal={"1"} />
    </Layout>
  );
};
export default UseModel;
