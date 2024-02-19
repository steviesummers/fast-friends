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

router.put("/:id", async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const { thoughtText } = req.body;

    // Check if the thought ID is provided
    if (!thoughtId) {
      return res.status(400).json({ error: "Thought ID is required." });
    }

    // Find the thought by ID and update the thoughtText
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { thoughtText },
      { new: true } // Return the updated thought
    );

    // Check if the thought exists
    if (!updatedThought) {
      return res.status(404).json({ error: "Thought not found." });
    }

    // Respond with the updated thought
    res.status(200).json(updatedThought);
  } catch (error) {
    console.error("Error updating thought:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.delete("/delete/:thoughtId", async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;

    // Check if the thoughtId is provided
    if (!thoughtId) {
      return res.status(400).json({ error: "thought ID is required." });
    }

    // Find the thought by thoughtId and delete
    const deletedthought = await Thought.findByIdAndDelete(thoughtId);

    // Check if thought with provided thoughtId exists
    if (!deletedthought) {
      return res.status(404).json({ error: "thought not found." });
    }

    return res.status(200).json({ message: "thought deleted successfully." });
  } catch (error) {
    console.error("Error deleting thought:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});
module.exports = router;
