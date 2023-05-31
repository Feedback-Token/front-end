import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";

interface Region {
  id: number;
  city: string;
  state: string;
  country: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Region[] | { message: string } | { message: string; error: string }
  >
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const result = await query(`SELECT id, city, state, country FROM regions`);
    res.status(200).json(result.rows);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error executing query", error: error.message });
  }
}
