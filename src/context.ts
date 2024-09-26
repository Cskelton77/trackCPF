import { createContext } from 'react';

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
  heightInches: number;
  weight: number;
  protein: PROTEIN_CALCULATION;
  rounding: boolean;
  personaliseFibre: boolean;
  usePlantPoints: boolean;
}

export const defaultSettings: SettingsContextInterface = {
  gender: GENDER.MALE,
  age: 1,
  heightFeet: 1,
  heightInches: 1,
  weight: 1,
  protein: PROTEIN_CALCULATION.CONSERVATIVE,
  rounding: false,
  personaliseFibre: true,
  usePlantPoints: true,
};

export const SettingsContext = createContext<SettingsContextInterface>(defaultSettings);
