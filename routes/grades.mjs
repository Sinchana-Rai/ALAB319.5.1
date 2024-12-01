import express from "express";
import connectDB from "../db/conn.mjs"; 
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const router = express.Router();

// Connect to Mongodb
connectDB();

// mongoose schema
const gradeSchema = new mongoose.Schema({
    learner_id: { type: Number, required: true },
    class_id: { type: Number },
    scores: [
      {
        type: {
          type: String, 
          required: true,
        },
        score: {
          type: Number, 
          required: true,
        },
      },
    ],
  });
  

const Grade = mongoose.model("Grade", gradeSchema);

// Create a single grade entry
router.post("/", async (req, res) => {

//old code

    // let collection = await db.collection("grades");
    // let newDocument = req.body;

    //  rename fields for backwards compatibility
    // if (newDocument.student_id) {
    //   newDocument.learner_id = newDocument.student_id;
    //   delete newDocument.student_id;
    // }

    // let result = await collection.insertOne(newDocument);
    // res.send(result).status(204);

//refactored code
  try {
    let newDocument = new Grade(req.body);

     // rename fields for backwards compatibility

    if (req.body.student_id) {
      newDocument.learner_id = req.body.student_id;
      delete req.body.student_id;
    }

    const result = await newDocument.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get a single grade entry
//http://localhost:5050/grades/674a19123d3c67620848a068

router.get("/:id", async (req, res) => {
 //old code 
    //  let collection = await db.collection("grades");
    //  let query = { _id: ObjectId(req.params.id) };
    //  let result = await collection.findOne(query);

    //  if (!result) res.send("Not found").status(404);
    //  else res.send(result).status(200);

//refactored code
  try {
    const result = await Grade.findById(req.params.id);
    if (!result) return res.status(404).send("Not found");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}); 

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {

    //old code
    // let collection = await db.collection("grades");
    // let query = { _id: ObjectId(req.params.id) };
  
    // let result = await collection.updateOne(query, {
    //   $push: { scores: req.body }
    // });
  
    // if (!result) res.send("Not found").status(404);
    // else res.send(result).status(200);

    //refactored code
    try {
        const result = await Grade.findByIdAndUpdate(req.params.id,
          { $push: { scores: req.body } },
          { new: true } 
        );
    
        if (!result) return res.status(404).send("Not found");
        res.status(200).send(result);
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    });

 // Delete a single grade entry
 router.delete("/:id", async (req, res) => {

    // old code
    // let collection = await db.collection("grades");
    // let query = { _id: ObjectId(req.params.id) };
    // let result = await collection.deleteOne(query);
  
    // if (!result) res.send("Not found").status(404);
    // else res.send(result).status(200);


    //refactored code

    try {
        const result = await Grade.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).send("Not found");
        res.status(200).send(result);
      } catch (err) {
        res.status(400).send(err.message);
      }

  });
      
// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {

    //old code

    // let collection = await db.collection("grades");
    // let query = { _id: ObjectId(req.params.id) };
  
    // let result = await collection.updateOne(query, {
    //   $pull: { scores: req.body }
    // });
  
    // if (!result) res.send("Not found").status(404);
    // else res.send(result).status(200);

    //refactored code
    try {
        const result = await Grade.findByIdAndUpdate(req.params.id,
          { $pull: { scores: req.body } },
          { new: true } 
        );
    
        if (!result) return res.status(404).send("Not found");
        res.status(200).send(result);
      } catch (err) {
        res.status(400).send({ error: err.message });
      }

  });
  
 
 
  // Get route for backwards compatibility
  router.get("/student/:id", async (req, res) => {
    res.redirect(`learner/${req.params.id}`);
  });
  
  // Get a learner's grade data
  router.get("/learner/:id", async (req, res) => {

    // old code
    // let collection = await db.collection("grades");
    // let query = { learner_id: Number(req.params.id) };
    
    // // Check for class_id parameter
    // if (req.query.class) query.class_id = Number(req.query.class);
  
    // let result = await collection.find(query).toArray();
  
    // if (!result) res.send("Not found").status(404);
    // else res.send(result).status(200);

    //Refactored code
    try {
        const query = { learner_id: Number(req.params.id) };
        if (req.query.class) query.class_id = Number(req.query.class);
    
        const result = await Grade.find(query);
        if (!result.length) return res.status(404).send("Not found");
        res.status(200).send(result);
      } catch (err) {
        res.status(400).send(err.message);
      }
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

 


export default router;
