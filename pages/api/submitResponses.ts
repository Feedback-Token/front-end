import type { NextApiRequest, NextApiResponse } from "next";
import { insertUserResponses } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const userResponses = req.body.responses;
  const modelId = req.body.modelId;

  try {
    await insertUserResponses(userResponses, modelId);
    res.status(200).json({ message: "User responses successfully received" });
  } catch (error) {
    console.error("Error inserting user responses:", error);
    res.status(500).json({ message: "Error inserting user responses" });
  }
}
