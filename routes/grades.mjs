import express from "express";
import db from "../db/conn.mjs";

import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const router = express.Router();

//creating a mongoose schema
const gradeSchema = new mongoose.Schema({
    learner_id: { type: Number, required: true },
    class_id: { type: Number },
    scores: [{ type: Number }],
  });

  const Grade = mongoose.model("Grade", gradeSchema);

// Create a single grade entry
router.post("/", async (req, res) => {

  //old code
//   let collection = await db.collection("grades");
//   let newDocument = req.body;

//   // rename fields for backwards compatibility
//   if (newDocument.student_id) {
//     newDocument.learner_id = newDocument.student_id;
//     delete newDocument.student_id;
//   }

//   let result = await collection.insertOne(newDocument);
//   res.send(result).status(204);
 

//new mongoose code
let newDocument = new Grade(req.body);

if (req.body.student_id) {
    newDocument.learner_id = req.body.student_id;
    delete req.body.student_id;
  }

  const result = await newDocument.save();
  res.status(201).send(result);

});

// Get a single grade entry
router.get("/:id", async (req, res) => {
    //old code
//   let collection = await db.collection("grades");
//   let query = { _id: ObjectId(req.params.id) };
//   let result = await collection.findOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);

//new mongoose code
//eg: http://localhost:5050/grades/56d5f7eb604eb380b0d8d8ce
const result = await Grade.findById(req.params.id);
    if (!result) return res.status(404).send("Not found");
    res.status(200).send(result);

});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { _id: ObjectId(req.params.id) };

  let result = await collection.updateOne(query, {
    $push: { scores: req.body }
  });

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { _id: ObjectId(req.params.id) };

  let result = await collection.updateOne(query, {
    $pull: { scores: req.body }
  });

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { _id: ObjectId(req.params.id) };
  let result = await collection.deleteOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
  res.redirect(`learner/${req.params.id}`);
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { learner_id: Number(req.params.id) };
  
  // Check for class_id parameter
  if (req.query.class) query.class_id = Number(req.query.class);

  let result = await collection.find(query).toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { learner_id: Number(req.params.id) };

  let result = await collection.deleteOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { class_id: Number(req.params.id) };

  // Check for learner_id parameter
  if (req.query.learner) query.learner_id = Number(req.query.learner);

  let result = await collection.find(query).toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Update a class id
router.patch("/class/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { class_id: Number(req.params.id) };

  let result = await collection.updateMany(query, {
    $set: { class_id: req.body.class_id }
  });

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Delete a class
router.delete("/class/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { class_id: Number(req.params.id) };

  let result = await collection.deleteMany(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// export default mongoose.model("Grade", gradeSchema);
export default router;
