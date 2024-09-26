/*
// MANUAL MODE: An item that is stored by the serving. 
//  This item will not be stored in the food database, 
//  only in the diary entry. Math can not be performed on
//  a manual mode entry, as we do not know the per-100g stats.
// 
// CALCULATE MODE: This item will be stored in the food DB, and
//  can be modified, we know the per-100g stats so serving sizes
//  can be changed on the fly. This is assumed the default and most
//  common use case of the app. This will also store in the diary.
// 
// UPDATE MODE: This is for modifying a diary entry, which must
//  be an item which was entered in CALCULATE mode. 
//
// These modes are passed to the AddNewItem modal to determine which
// actions are taken on save. They also have a small bearing on the
// text which is displayed to the user inside the modal.
*/
export enum MODES {
  MANUAL = 'manual',
  CALCULATE = 'calculate',
  UPDATE = 'update',
}

export type ItemMode = MODES.MANUAL | MODES.CALCULATE | MODES.UPDATE | null;

export type NullableNumber = number | null | typeof NaN | undefined;
