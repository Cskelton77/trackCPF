export interface DefinedFoodObject {
  fid: string;
  name: string;
  calories?: number;
  protein?: number;
  fibre?: number;
}

export type FoodObject = Omit<DefinedFoodObject, 'fid'>