import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

interface User {
  id: number;
  name: string;
}
const configuration = new Configuration({
  apiKey: process.env.NEXT_PRIVATE_OPENAI_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { message: string; error: string }>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  const userQuestion = req.body.question;
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "davinci:ft-syncracy-capital-2023-05-01-18-17-31",
      prompt: userQuestion,
      temperature: 0,
      max_tokens: 100,
    });
    const answer = response.data.choices[0].text as string;

    res.status(200).json({ message: answer });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error executing query", error: error.message });
  }
}
