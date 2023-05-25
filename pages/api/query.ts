import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { utils, ethers } from "ethers";
import { query } from "../../lib/db";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PRIVATE_OPENAI_KEY,
});

async function checkTransaction(txHash: string, address: string) {
  const SUB_ABI = require("../../contracts/Subscription.json");
  // Get the transaction
  const provider = new ethers.providers.JsonRpcProvider(
    "https://ethereum-sepolia-rpc.allthatnode.com"
  );
  const tx = await provider.getTransaction(txHash);

  if (!tx) {
    throw new Error("Transaction not found");
  }
  const block = await provider.getBlock(tx.blockNumber as number);

  const timestamp = block.timestamp;
  const currentTimestamp = Date.now() / 1000;
  console.log("Block timestamp: ", timestamp);
  console.log("Current timestamp: ", Date.now());
  console.log("Difference: ", currentTimestamp - timestamp);
  if (currentTimestamp - timestamp > 30) {
    console.log("The transaction is too old");
    return false;
  }

  if (tx.to?.toLowerCase() === address.toLowerCase()) {
    const iface = new ethers.utils.Interface(SUB_ABI);
    const decoded = iface.parseTransaction({ data: tx.data });

    if (decoded.name === "useSubscription") {
      console.log("The 'useSubscription' method was called");
      return true;
    } else {
      console.log(
        `The method '${decoded.name}' was called instead of 'useSubscription'`
      );
      return false;
    }
  } else {
    console.log("The transaction was not made to your contract");
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { message: string; error: string }>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  const userQuestion = req.body.question;
  const txHash = req.body.txHash;
  const address = req.body.address;
  const region = req.body.region;

  let regionName = "";
  const openai = new OpenAIApi(configuration);
  try {
    const regionname = await query(
      `SELECT name FROM models WHERE region_id = $1`,
      [region]
    );
    regionName = regionname.rows[0].name;
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error executing query", error: error.message });
  }
  try {
    if (!checkTransaction(txHash, address)) {
      res.status(403).json({ message: "Transaction not valid" });
    } else {
      try {
        const response = await openai.createCompletion({
          model: regionName,
          prompt: `${userQuestion}? ->`,
          temperature: 0,
          max_tokens: 1000,
          stop: [".\n"],
        });
        const answer = response.data.choices[0].text as string;

        res.status(200).json({ message: answer });
      } catch (error: any) {
        res
          .status(500)
          .json({ message: "Error executing query", error: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking transaction" });
  }
}
