import { createContext, useContext } from 'react';

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
}

export enum PROTEIN_CALCULATION {
  CONSERVATIVE = 'conservative',
  AGGRESSIVE = 'aggressive',
}

export type Genders = GENDER.FEMALE | GENDER.MALE;
export type ProteinCalculation = PROTEIN_CALCULATION.AGGRESSIVE | PROTEIN_CALCULATION.CONSERVATIVE;

export interface SettingsContextInterface {
  gender: GENDER;
  age: number;
  heightFeet: number;
  weight: number;
  protein: PROTEIN_CALCULATION;
  rounding: boolean;
}

export const SettingsContext = createContext<SettingsContextInterface | undefined>(undefined);

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    // throw new Error('useSettingsContext must be within TodoProvider');
    return {};
  }

  return context;
}
