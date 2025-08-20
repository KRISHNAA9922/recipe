const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Recipe = require('./models/Recipe');
const Note = require('./models/Note');
const User = require('./models/User');
const { generateToken, authMiddleware } = require('./utils/auth');

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
    createdBy: User
  }

  type Note {
    id: ID!
    recipeId: ID!
    content: String!
    createdAt: String!
    updatedAt: String!
    createdBy: User
  }

  type User {
    id: ID!
    email: String!
    name: String!
    avatar: String
    createdRecipes: [Recipe!]!
    savedRecipes: [Recipe!]!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
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

  input RegisterInput {
    email: String!
    password: String!
    name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
    recipesByCategory(category: String!): [Recipe!]!
    searchRecipes(query: String!): [Recipe!]!
    notes(recipeId: ID!): [Note!]!
    note(id: ID!): Note
    me: User
    user(id: ID!): User
  }

  type Mutation {
    createRecipe(input: RecipeInput!): Recipe!
    updateRecipe(id: ID!, input: RecipeInput!): Recipe!
    deleteRecipe(id: ID!): Boolean!
    createNote(input: NoteInput!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    saveRecipe(recipeId: ID!): User!
    unsaveRecipe(recipeId: ID!): User!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    recipes: async () => {
       return await Recipe.find().populate('createdBy', 'username email');
    },
    recipe: async (_, { id }) => {
      return await Recipe.findById(id).populate('createdBy', 'username email');
    },
    recipesByCategory: async (_, { category }) => {
      return await Recipe.find({ category }).populate('createdBy').sort({ createdAt: -1 });
    },
    searchRecipes: async (_, { query }) => {
      const regex = new RegExp(query, 'i');
      return await Recipe.find({
        $or: [
          { title: { $regex: regex } },
          { ingredients: { $in: [regex] } }
        ]
      }).populate('createdBy').sort({ createdAt: -1 });
    },
    notes: async (_, { recipeId }) => {
      return await Note.find({ recipeId }).populate('createdBy').sort({ createdAt: -1 });
    },
    note: async (_, { id }) => {
      return await Note.findById(id).populate('createdBy');
    },
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    user: async (_, { id }) => {
      return await User.findById(id);
    }
  },
  Mutation: {
    createRecipe: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      const recipe = new Recipe({
        ...input,
        createdBy: user.id
      });
      const savedRecipe = await recipe.save();
      
      // Add to user's created recipes
      await User.findByIdAndUpdate(user.id, {
        $push: { createdRecipes: savedRecipe.id }
      });
      
      return savedRecipe;
    },
    updateRecipe: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      const recipe = await Recipe.findById(id);
      if (!recipe) throw new Error('Recipe not found');
      
      // Check if user owns this recipe
      if (recipe.createdBy && recipe.createdBy.toString() !== user.id) {
        throw new Error('Not authorized to update this recipe');
      }
      
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        id,
        { ...input, updatedAt: new Date() },
        { new: true }
      );
      
      return updatedRecipe;
    },
    deleteRecipe: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      const recipe = await Recipe.findById(id);
      if (!recipe) throw new Error('Recipe not found');
      
      // Check if user owns this recipe
      if (recipe.createdBy && recipe.createdBy.toString() !== user.id) {
        throw new Error('Not authorized to delete this recipe');
      }
      
      const result = await Recipe.findByIdAndDelete(id);
      if (result) {
        // Remove from user's created recipes
        await User.findByIdAndUpdate(user.id, {
          $pull: { createdRecipes: id }
        });
        
        // Also delete all notes for this recipe
        await Note.deleteMany({ recipeId: id });
        return true;
      }
      return false;
    },
    createNote: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      const note = new Note({
        ...input,
        createdBy: user.id
      });
      return await note.save();
    },
    updateNote: async (_, { id, content }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      const note = await Note.findById(id);
      if (!note) throw new Error('Note not found');
      
      // Check if user owns this note
      if (note.createdBy && note.createdBy.toString() !== user.id) {
        throw new Error('Not authorized to update this note');
      }
      
      const updatedNote = await Note.findByIdAndUpdate(
        id,
        { content, updatedAt: new Date() },
        { new: true }
      );
      
      return updatedNote;
    },
    deleteNote: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      const note = await Note.findById(id);
      if (!note) throw new Error('Note not found');
      
      // Check if user owns this note
      if (note.createdBy && note.createdBy.toString() !== user.id) {
        throw new Error('Not authorized to delete this note');
      }
      
      const result = await Note.findByIdAndDelete(id);
      return !!result;
    },
    register: async (_, { input }) => {
      const { email, password, name } = input;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      
      // Create new user
      const user = new User({ email, password, name });
      await user.save();
      
      // Generate token
      const token = generateToken(user.id);
      
      return { token, user };
    },
    login: async (_, { input }) => {
      const { email, password } = input;
      
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Check password
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }
      
      // Generate token
      const token = generateToken(user.id);
      
      return { token, user };
    },
    saveRecipe: async (_, { recipeId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      const userDoc = await User.findById(user.id);
      if (!userDoc.savedRecipes.includes(recipeId)) {
        userDoc.savedRecipes.push(recipeId);
        await userDoc.save();
      }
      
      return userDoc;
    },
    unsaveRecipe: async (_, { recipeId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      const userDoc = await User.findById(user.id);
      userDoc.savedRecipes = userDoc.savedRecipes.filter(
        id => id.toString() !== recipeId
      );
      await userDoc.save();
      
      return userDoc;
    }
  },
  Recipe: {
    createdBy: async (recipe) => {
      if (!recipe.createdBy) return null;
      return await User.findById(recipe.createdBy);
    }
  },
  Note: {
    createdBy: async (note) => {
      if (!note.createdBy) return null;
      return await User.findById(note.createdBy);
    }
  }
};

// Create server
const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const user = await authMiddleware(req);
    return { user };
  }
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
