const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const Thought = require("../schemas/ThoughtSchema");

// For JSON parsing
app.use(express.json());

// For URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// POST route to create a new thought
router.post("/", async (req, res) => {
  try {
    // Extract data from the request body
    const { thoughtText, username, reactions } = req.body;

    // Create a new thought
    const newThought = new Thought({
      thoughtText,
      username,
      reactions, // Assuming reactions are provided in the request body
    });

    // Save the new thought to the database
    const savedThought = await newThought.save();

    // Respond with the saved thought
    res.status(201).json(savedThought);
  } catch (error) {
    console.error("Error creating thought:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find();
    return res.status(200).json(thoughts);
  } catch (error) {
    console.error("Error fetching thoughts:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
