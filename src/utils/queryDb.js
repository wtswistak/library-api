const { Client } = require("pg");
const client = new Client({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

const queryDb = async (query, values, client) => {
  try {
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { client, queryDb };
