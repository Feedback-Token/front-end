// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  try {
    // Read the data.json file from the public directory
    const filePath = path.join(
      process.cwd(),
      "public",
      "travel_questions.json"
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error reading JSON file" });
  }
}
