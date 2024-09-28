import {
  Actions,
  DiscardAction,
  EntryBox,
  ItemAttributes,
  NewItemModal,
  SaveAction,
  AttributeInput,
  TextDisplay,
  EntryLabel,
  PlantPointsSelector,
} from './AddNewItem.style';
import { ForwardedRef, forwardRef, useContext, useEffect, useState } from 'react';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import Modal from '../_Modal/Modal';
import { SettingsContext } from '@/context';

export interface ModifyFoodInterface {
  selectedFood?: DefinedFoodObject;
  isVisible: boolean;
  handleSave: (food: DefinedFoodObject) => void;
  close: () => void;
}

const ModifyFood = forwardRef(
  (
    { selectedFood, handleSave, isVisible, close }: ModifyFoodInterface,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const context = useContext(SettingsContext);
    const { usePlantPoints } = context;

    if (!selectedFood) {
      return <></>;
    }

    const [calories, setCalories] = useState<string>();
    const [protein, setProtein] = useState<string>();
    const [fibre, setFibre] = useState<string>();
    const [plantPoints, setPlantPoints] = useState<string>('0');

    useEffect(() => {
      if (selectedFood) {
        setCalories(selectedFood.calories?.toString());
        setProtein(selectedFood.protein?.toString());
        setFibre(selectedFood.fibre?.toString());
        setPlantPoints(selectedFood.plantPoints?.toString() || '0');
      }
    }, [selectedFood]);

    const resetForm = () => {
      setCalories(undefined);
      setProtein(undefined);
      setFibre(undefined);
      setPlantPoints('0');
    };

    const handleDiscard = () => {
      resetForm();
      close();
    };

    const handleSubmit = () => {
      handleSave({
        fid: selectedFood.fid,
        name: selectedFood.name,
        calories: parseFloat(calories || ''),
        protein: parseFloat(protein || ''),
        fibre: parseFloat(fibre || ''),
        plantPoints: parseFloat(plantPoints || '0'),
      });

      resetForm();
    };

    return (
      <Modal title="Modify Database Entry" isVisible={isVisible} close={close} ref={ref}>
        <NewItemModal id="foodObjectForm" action={handleSubmit}>
          <span>
            Modifying or deleting items from this page will affect what is offered to you in the
            dropdown when you are creating your food diary. It will NOT modify any existing diary
            entries, only change what is avaialble to you for future entries.
          </span>
          <ItemAttributes>
            <EntryLabel>{selectedFood.name} per 100g</EntryLabel>
            <EntryBox>
              <AttributeInput
                id="calories"
                inputMode="decimal"
                value={calories || ''}
                onChange={(e) => setCalories(e.target.value)}
              />
              <TextDisplay htmlFor="calories">Calories</TextDisplay>
            </EntryBox>
            <EntryBox>
              <AttributeInput
                id="protein"
                inputMode="decimal"
                value={protein || ''}
                onChange={(e) => setProtein(e.target.value)}
              />
              <TextDisplay htmlFor="protein">Protein</TextDisplay>
            </EntryBox>
            <EntryBox>
              <AttributeInput
                id="fibre"
                inputMode="decimal"
                value={fibre || ''}
                onChange={(e) => setFibre(e.target.value)}
              />
              <TextDisplay htmlFor="fibre">Fibre</TextDisplay>
            </EntryBox>
            {usePlantPoints && (
              <EntryBox>
                <PlantPointsSelector
                  aria-label="Plant Points"
                  id="plantPoints"
                  value={plantPoints}
                  onChange={(e) => setPlantPoints(e.target.value)}
                >
                  <option value={0}>0 Plant Points</option>
                  <option value={1}>1 Plant Point</option>
                  <option value={0.5}>1/2 Plant Point</option>
                  <option value={0.25}>1/4 Plant Point</option>
                </PlantPointsSelector>
              </EntryBox>
            )}
          </ItemAttributes>

          <Actions>
            <DiscardAction onClick={handleDiscard}>Discard Changes</DiscardAction>
            <SaveAction type={'submit'}>Update Entry</SaveAction>
          </Actions>
        </NewItemModal>
      </Modal>
    );
  },
);

export default ModifyFood;
