export interface DefinedFoodObject {
  fid: string;
  name: string;
  calories?: number;
  protein?: number;
  fibre?: number;
  plantPoints?: number;
}

export type FoodObject = Omit<DefinedFoodObject, 'fid'>