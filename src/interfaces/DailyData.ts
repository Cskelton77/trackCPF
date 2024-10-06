import { RecipeIngredient } from '@/app/(logged-in)/recipe/page';
import { DefinedFoodObject, FoodObject } from './FoodObject';

export interface DiaryData {
  did: string; // Diary Identifier
  uid: string; // User Identifier
  date: string; // Date of Entry
  serving: number; // Serving of entry
  isDirectEntry: boolean; // if true, entry serving can not be modified
  foodEntry: DefinedFoodObject; // Nutrition data for entry

  // Two vars for recipe status, not sure how/if these will be used
  // yet but better to store them now and use them later
  isRecipe?: boolean;
  ingredients?: RecipeIngredient[];
}
