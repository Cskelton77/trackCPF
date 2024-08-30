export enum MODES {
    MANUAL = 'manual',
    CALCULATE = 'calculate',
    UPDATE = 'update'
  } 
  
  export type ItemMode = MODES.MANUAL | MODES.CALCULATE | MODES.UPDATE | null

  export type NullableNumber = number | null