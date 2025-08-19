import { gql } from '@apollo/client';

// Recipe queries
export const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      title
      ingredients
      steps
      category
      image
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GET_RECIPE = gql`
  query GetRecipe($id: ID!) {
    recipe(id: $id) {
      id
      title
      ingredients
      steps
      category
      image
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GET_RECIPES_BY_CATEGORY = gql`
  query GetRecipesByCategory($category: String!) {
    recipesByCategory(category: $category) {
      id
      title
      ingredients
      steps
      category
      image
      notes
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_RECIPES = gql`
  query SearchRecipes($query: String!) {
    searchRecipes(query: $query) {
      id
      title
      ingredients
      steps
      category
      image
      notes
      createdAt
      updatedAt
    }
  }
`;

// Recipe mutations
export const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
      id
      title
      ingredients
      steps
      category
      image
      notes
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      id
      title
      ingredients
      steps
      category
      image
      notes
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }
`;

// Note queries
export const GET_NOTES = gql`
  query GetNotes($recipeId: ID!) {
    notes(recipeId: $recipeId) {
      id
      recipeId
      content
      createdAt
      updatedAt
    }
  }
`;

export const GET_NOTE = gql`
  query GetNote($id: ID!) {
    note(id: $id) {
      id
      recipeId
      content
      createdAt
      updatedAt
    }
  }
`;

// Note mutations
export const CREATE_NOTE = gql`
  mutation CreateNote($input: NoteInput!) {
    createNote(input: $input) {
      id
      recipeId
      content
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $content: String!) {
    updateNote(id: $id, content: $content) {
      id
      recipeId
      content
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;
