import express from "express";

import mongoose from "mongoose";

const PORT = process.env.PORT || 5050;
const app = express();

//imported gradesschema
import Grade from "./routes/grades.mjs";

// import grades from "./routes/grades.mjs";
import grades_agg from "./routes/grades_agg.mjs";

app.use(express.json());

// Connect to Mongoose.
await mongoose.connect(process.env.ATLAS_URI);

app.get("/", (req, res) => {
  res.send("Welcome to the API.");
});

app.use("/grades", Grade);
app.use("/grades", grades_agg);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
