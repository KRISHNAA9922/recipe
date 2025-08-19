const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
