// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../lib/db";

interface User {
  id: number;
  name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    User | { message: string } | { message: string; error: string }
  >
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const city = req.query.city;

  if (!city) {
    res.status(400).json({ message: "city is required" });
    return;
  }

  try {
    const result = await query("SELECT * FROM models WHERE city = $1", [city]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Model not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error executing query", error: error.message });
  }
}
