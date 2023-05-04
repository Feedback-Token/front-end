import type { NextApiRequest, NextApiResponse } from "next";

interface User {
  id: number;
  name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | { message: string }>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // try {
  //   const result = await query(`SELECT * FROM models where city = '${}'`);
  //   res.status(200).json(result.rows);
  // } catch (error) {
  //   res
  //     .status(500)
  //     .json({ message: "Error executing query", error: error.message });
  // }
}
