import { DefinedFoodObject, FoodObject } from './FoodObject';

export interface DiaryData {
  did: string; // Diary Identifier
  uid: string; // User Identifier
  date: string; // Date of Entry
  serving: number; // Serving of entry
  isDirectEntry: boolean; // if true, entry serving can not be modified
  foodEntry: DefinedFoodObject; // Nutrition data for entry
}
