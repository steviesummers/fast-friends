const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");

// For JSON parsing
app.use(express.json());

// For URL-encoded form data
app.use(express.urlencoded({ extended: true }));

router.post("/register", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res
        .status(400)
        .json({ error: "Both username and email are required." });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ error: "Email already in use." });
      } else {
        return res.status(409).json({ error: "Username already in use." });
      }
    }

    const newUser = await User.create(req.body);
    return res
      .status(201)
      .json({ message: "User created successfully.", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal server error." });
      }
})

router.delete("/users/delete/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
    
        // Check if the userId is provided
        if (!userId) {
          return res.status(400).json({ error: "User ID is required." });
        }
    
        // Find the user by userId and delete
        const deletedUser = await User.findByIdAndDelete(userId);
    
        // Check if user with provided userId exists
        if (!deletedUser) {
          return res.status(404).json({ error: "User not found." });
        }
    
        return res.status(200).json({ message: "User deleted successfully." });
      } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal server error." });
      }
})
module.exports = router;
