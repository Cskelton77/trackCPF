import { FoodObject } from "./FoodObject";

export interface DiaryData {
    did: string;               // Diary Identifier
    uid: string;               // User Identifier
    date: string;              // Date of Entry   
    serving: number;           // Serving of entry
    isDirectEntry: boolean;    // if true, entry serving can not be modified
    isCompleteEntry: boolean;  // If true, all four elements are present (To Be Deleted??)
    foodEntry: FoodObject;     // Nutrition data for entry
  }