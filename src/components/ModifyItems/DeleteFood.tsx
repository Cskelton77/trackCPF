import {
  Actions,
  EntryBox,
  ItemAttributes,
  NewItemModal,
  TextDisplay,
  EntryLabel,
  DeleteAction,
} from './AddNewItem.style';
import { ForwardedRef, forwardRef, useContext } from 'react';
import { FoodObject } from '@/interfaces/FoodObject';
import Modal from '../_Modal/Modal';
import { SettingsContext } from '@/context';
import { Delete } from '@/Icons';
import { NullableNumber } from '@/interfaces/ItemModes';
import { roundDisplay } from '../MainDisplay/MainDisplay';

export interface DeleteFoodInterface {
  isVisible: boolean;
  selectedFood?: FoodObject;
  diaryEntryId: string;
  deleteDiaryEntry: (diaryId: string) => Promise<void>;
  close: () => void;
}

const DeleteFood = forwardRef(
  (
    { diaryEntryId, selectedFood, deleteDiaryEntry, isVisible, close }: DeleteFoodInterface,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const context = useContext(SettingsContext);
    const { usePlantPoints, rounding } = context;
    if (!selectedFood) {
      return <></>;
    }
    const calculateDisplay = (metric: NullableNumber): string => {
      if (metric === null || metric === undefined) {
        return '---';
      }
      if (rounding) {
        return Math.round(metric).toString();
      } else {
        return roundDisplay(metric).toString();
      }
    };

    const { calories, protein, fibre, plantPoints } = selectedFood;

    return (
      <Modal title="Delete Item from Diary" isVisible={isVisible} close={close} ref={ref}>
        <NewItemModal id="foodObjectForm">
          <span>
            This recipe can not be modified at this time. You may delete it below and recreate from
            scratch.
          </span>
          <ItemAttributes>
            <EntryLabel>{selectedFood.name} per 100g</EntryLabel>
            <EntryBox>
              {calculateDisplay(calories)}
              <TextDisplay>Calories</TextDisplay>
            </EntryBox>
            <EntryBox>
              {calculateDisplay(protein)}
              <TextDisplay>Protein</TextDisplay>
            </EntryBox>
            <EntryBox>
              {calculateDisplay(fibre)}
              <TextDisplay>Fibre</TextDisplay>
            </EntryBox>
            {usePlantPoints && (
              <EntryBox>
                {plantPoints} <TextDisplay>Plant Points</TextDisplay>
              </EntryBox>
            )}
          </ItemAttributes>

          <Actions>
            <DeleteAction onClick={() => deleteDiaryEntry(diaryEntryId)}>
              <Delete size={24} label={`Delete ${name}`} />
              {'Delete Entry from Diary'}
            </DeleteAction>
          </Actions>
        </NewItemModal>
      </Modal>
    );
  },
);

export default DeleteFood;
