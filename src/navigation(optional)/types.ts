import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  RecipeDetail: { recipeId: string };
  AddRecipe: undefined;
  EditRecipe: { recipeId: string };
  RecipeNotes: { recipeId: string; recipeTitle: string };
};

export type HomeTabParamList = {
  AllRecipes: undefined;
  Categories: undefined;
  Favorites: undefined;
};
