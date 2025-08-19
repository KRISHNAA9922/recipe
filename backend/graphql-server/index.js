const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Recipe = require('./models/Recipe');
const Note = require('./models/Note');

// GraphQL schema
const typeDefs = gql`
  type Recipe {
    id: ID!
    title: String!
    ingredients: [String!]!
    steps: [String!]!
    category: String!
    image: String
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type Note {
    id: ID!
    recipeId: ID!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  input RecipeInput {
    title: String!
    ingredients: [String!]!
    steps: [String!]!
    category: String!
    image: String
    notes: String
  }

  input NoteInput {
    recipeId: ID!
    content: String!
  }

  type Query {
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
    recipesByCategory(category: String!): [Recipe!]!
    searchRecipes(query: String!): [Recipe!]!
    notes(recipeId: ID!): [Note!]!
    note(id: ID!): Note
  }

  type Mutation {
    createRecipe(input: RecipeInput!): Recipe!
    updateRecipe(id: ID!, input: RecipeInput!): Recipe!
    deleteRecipe(id: ID!): Boolean!
    createNote(input: NoteInput!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    recipes: async () => {
      return await Recipe.find().sort({ createdAt: -1 });
    },
    recipe: async (_, { id }) => {
      return await Recipe.findById(id);
    },
    recipesByCategory: async (_, { category }) => {
      return await Recipe.find({ category }).sort({ createdAt: -1 });
    },
    searchRecipes: async (_, { query }) => {
      const regex = new RegExp(query, 'i');
      return await Recipe.find({
        $or: [
          { title: { $regex: regex } },
          { ingredients: { $in: [regex] } }
        ]
      }).sort({ createdAt: -1 });
    },
    notes: async (_, { recipeId }) => {
      return await Note.find({ recipeId }).sort({ createdAt: -1 });
    },
    note: async (_, { id }) => {
      return await Note.findById(id);
    }
  },
  Mutation: {
    createRecipe: async (_, { input }) => {
      const recipe = new Recipe(input);
      return await recipe.save();
    },
    updateRecipe: async (_, { id, input }) => {
      const recipe = await Recipe.findByIdAndUpdate(
        id,
        { ...input, updatedAt: new Date() },
        { new: true }
      );
      if (!recipe) throw new Error('Recipe not found');
      return recipe;
    },
    deleteRecipe: async (_, { id }) => {
      const result = await Recipe.findByIdAndDelete(id);
      if (result) {
        // Also delete all notes for this recipe
        await Note.deleteMany({ recipeId: id });
        return true;
      }
      return false;
    },
    createNote: async (_, { input }) => {
      const note = new Note(input);
      return await note.save();
    },
    updateNote: async (_, { id, content }) => {
      const note = await Note.findByIdAndUpdate(
        id,
        { content, updatedAt: new Date() },
        { new: true }
      );
      if (!note) throw new Error('Note not found');
      return note;
    },
    deleteNote: async (_, { id }) => {
      const result = await Note.findByIdAndDelete(id);
      return !!result;
    }
  }
};

// Create server
const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  // Connect to MongoDB
  await connectDB();
  
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
