const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Mock data for notes
let notes = [
  {
    id: '1',
    recipeId: '1',
    content: 'Add extra vanilla extract for better flavor',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: '2',
    recipeId: '1',
    content: 'Try using buttermilk instead of regular milk',
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z'
  },
  {
    id: '3',
    recipeId: '2',
    content: 'Chill dough for 30 minutes before baking',
    createdAt: '2024-01-17T15:00:00Z',
    updatedAt: '2024-01-17T15:00:00Z'
  }
];

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/notes', (req, res) => {
  const { recipeId } = req.query;
  if (recipeId) {
    const filteredNotes = notes.filter(note => note.recipeId === recipeId);
    res.json(filteredNotes);
  } else {
    res.json(notes);
  }
});

app.get('/api/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
});

app.post('/api/notes', (req, res) => {
  const { recipeId, content } = req.body;
  
  if (!recipeId || !content) {
    return res.status(400).json({ error: 'recipeId and content are required' });
  }

  const newNote = {
    id: String(notes.length + 1),
    recipeId,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  notes.push(newNote);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const { content } = req.body;
  const noteIndex = notes.findIndex(n => n.id === req.params.id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    content,
    updatedAt: new Date().toISOString()
  };
  
  res.json(notes[noteIndex]);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteIndex = notes.findIndex(n => n.id === req.params.id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes.splice(noteIndex, 1);
  res.json({ message: 'Note deleted successfully' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 REST server ready at http://localhost:${PORT}`);
});
