import app from "./app.js";
import connectDB from "./config/database.js";

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

export default app;