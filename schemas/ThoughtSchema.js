const mongoose = require('mongoose');

// Thought schema
const reactionSchema = new mongoose.Schema({
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId
    },
    reactionBody: {
      type: String,
      required: true,
      minlenth: 3,
      maxlength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function() {
        return this.createdAt.toLocaleDateString(); // Format the timestamp on query
      }
    }
  });
  
  // Thought schema
  const thoughtSchema = new mongoose.Schema({
    thoughtText: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function() {
        return this.createdAt.toLocaleDateString(); // Format the timestamp on query
      }
    },
    reactions: [reactionSchema] // Array of nested reaction subdocuments
  });
  
  // Virtual for reaction count
  thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
  });
  
  // Create the Thought model
  const Thought = mongoose.model('Thought', thoughtSchema);
  
  module.exports = Thought;