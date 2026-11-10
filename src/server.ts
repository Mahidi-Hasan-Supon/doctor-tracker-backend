import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/database.js";
import config from "./config/index.js";


const port = Number(config.port) || 5000;
// const port = Number(process.env.PORT) || 5000;

async function main() {
  try {
    // Connect MongoDB first
    await connectDB();

    // Start Express server after successful DB connection
    app.listen(port, () => {
      console.log(`Doctor Tracker server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

main();

