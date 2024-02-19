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

// POST route to add friends to a user
router.put('/users/:userId/add-friends', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { friendIds } = req.body;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Add new friends to the user's friends array
      user.friends.push(...friendIds);
  
      // Save the updated user document
      await user.save();
  
      // Respond with the updated user document
      res.status(200).json(user);
    } catch (error) {
      console.error('Error adding friends to user:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  router.delete('/users/:userId/remove-friends', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { friendIds } = req.body;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Remove friends from the user's friends array
      friendIds.forEach(friendId => {
        const index = user.friends.indexOf(friendId);
        if (index !== -1) {
          user.friends.splice(index, 1);
        }
      });
  
      // Save the updated user document
      await user.save();
  
      // Respond with the updated user document
      res.status(200).json(user);
    } catch (error) {
      console.error('Error removing friends from user:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });
router.get('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find the user by its ID
      const user = await User.findById(userId)
                            .populate('thoughts')
                            .populate('friends');
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'user not found.' });
      }
  
      // Respond with the user
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

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
