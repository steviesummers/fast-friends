const mongoose = require('mongoose');

// Thought schema
const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function() {
      return this.createdAt.toLocaleDateString(); // Format the timestamp on query
    }
  },
  username: {
    type: String,
    required: true
  },
  reactions: [String] // Array of nested reaction documents
});

// Create the Thought model
const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
