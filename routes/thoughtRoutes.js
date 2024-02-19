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
// POST route to create a new thought
router.post('/', async (req, res) => {
    try {
      const { thoughtText, username } = req.body;
  
      // Create a new thought
      const thought = await Thought.create({ thoughtText, username });
  
      // Find the associated user by username
      const user = await User.findOne({ username });
  
      // Check if the user exists
      if (!user) {
        // If the user does not exist, return an error
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Push the created thought's _id to the user's thoughts array
      user.thoughts.push(thought._id);
  
      // Save the updated user document
      await user.save();
  
      // Respond with the created thought
      res.status(201).json(thought);
    } catch (error) {
      console.error('Error creating thought:', error);
      res.status(500).json({ error: 'Internal server error.' });
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

router.get('/:id', async (req, res) => {
    try {
      const thoughtId = req.params.id;
  
      // Find the thought by its ID
      const thought = await Thought.findById(thoughtId);
  
      // Check if the thought exists
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found.' });
      }
  
      // Respond with the thought
      res.status(200).json(thought);
    } catch (error) {
      console.error('Error fetching thought by ID:', error);
      res.status(500).json({ error: 'Internal server error.' });
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
