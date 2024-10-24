import { NullableNumber } from './ItemModes';

export interface DefinedFoodObject {
  fid: string;
  name: string;
  calories?: NullableNumber;
  protein?: NullableNumber;
  fibre?: NullableNumber;
  plantPoints?: NullableNumber;
  recipeWeight?: NullableNumber;
}

export type FoodObject = Omit<DefinedFoodObject, 'fid'>;
