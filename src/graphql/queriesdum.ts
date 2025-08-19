import { gql } from '@apollo/client';

// GraphQL Queries
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
    }
  }
`;

// GraphQL Mutations
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
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }
`;
