import express from "express";

import connectDB from "./db/conn.mjs";

import grades from "./routes/grades.mjs";
import grades_agg from "./routes/grades_agg.mjs";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Connect to Mongoose
connectDB();

app.use(express.json());

// Routes



app.get("/", (req, res) => {
    res.send("Welcome to the API.");
  });


  app.use("/grades", grades);
  app.use("/grades_agg", grades_agg);

// Global error handling
app.use((err, _req, res, next) => {
    res.status(500).send("Seems like we messed up somewhere...");
  });
  
  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
  
