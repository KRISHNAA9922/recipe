// Define the specific categories
export type RecipeCategory =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'dessert'
  | 'snack'
  | 'beverage'
  | 'appetizer'
  | 'main-course'
  | 'side-dish';

// Represents a single Note object from your database
export interface Note {
  id: string;
  recipeId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Represents a single Recipe object.
// The `notes` field is removed, assuming notes are fetched separately.
// `category` now uses the specific RecipeCategory type.
export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  category: RecipeCategory; // <-- Improved
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Input for creating a new Note
export interface NoteInput {
  recipeId: string;
  content: string;
}

// Input for creating/updating a Recipe.
// The `notes` field is removed for clarity, separating recipe creation from note creation.
export interface RecipeInput {
  title: string;
  ingredients: string[];
  steps: string[];
  category: RecipeCategory; // <-- Improved
  image?: string;
}
