import { Pool, QueryResult } from "pg";

const pool = new Pool({
  host: process.env.NEXT_PRIVATE_PGHOST,
  user: process.env.NEXT_PRIVATE_PGUSER,
  password: process.env.NEXT_PRIVATE_PGPASSWORD,
  database: process.env.NEXT_PRIVATE_PGDATABASE,
  port: parseInt(process.env.NEXT_PRIVATE_PORT || "5432", 10),
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(
  text: string,
  params?: any[]
): Promise<QueryResult<any>> {
  const client = await pool.connect();

  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

export async function insertUserResponses(
  userResponses: any[],
  modelId: string
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertPromptsQuery = `
        INSERT INTO prompts (model_id, question, answer)
        VALUES ((SELECT id FROM models WHERE region_id = $1), $2, $3);
      `;

    for (const response of userResponses) {
      const { question, response: answer } = response;
      await client.query(insertPromptsQuery, [modelId, question, answer]);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
