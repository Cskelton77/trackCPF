import { ItemMode, MODES, NullableNumber } from '@/interfaces/ItemModes';
import {
  Actions,
  DiscardAction,
  EntryBox,
  ItemAttributes,
  NewItemModal,
  ItemName,
  SaveAction,
  AttributeInput,
  TextDisplay,
} from './AddNewItem.style';
import { useContext, useEffect, useState } from 'react';
import { Moment } from 'moment';
import { FoodObject } from '@/interfaces/FoodObject';
import { DEBUGMODE } from '@/config';
import Modal from '../_Modal/Modal';
import { SettingsContext } from '@/context';

interface AddNewItem {
  name: string;
  selectedFood?: FoodObject;
  selectedFoodServing?: number;
  date: Moment;
  isVisible: boolean;
  mode: ItemMode;
  handleSave: (
    name: string,
    serving: number,
    calories: NullableNumber,
    protein: NullableNumber,
    fibre: NullableNumber,
    plantPoints: NullableNumber,
  ) => void;
  close: () => void;
}
const AddNewItem = ({
  name,
  selectedFood,
  selectedFoodServing,
  handleSave,
  isVisible,
  mode,
  close,
}: AddNewItem) => {
  const context = useContext(SettingsContext);
  const { usePlantPoints } = context;

  const isManualMode = mode === MODES.MANUAL;
  const isUpdateMode = mode === MODES.UPDATE;

  const [calories, setCalories] = useState<string>();
  const [protein, setProtein] = useState<string>();
  const [fibre, setFibre] = useState<string>();
  const [plantPoints, setPlantPoints] = useState<string>();
  const [serving, setServing] = useState<string>();

  useEffect(() => {
    if (selectedFood) {
      setCalories(selectedFood.calories?.toString());
      setProtein(selectedFood.protein?.toString());
      setFibre(selectedFood.fibre?.toString());
      setPlantPoints(selectedFood.plantPoints?.toString());
    }
    if (isUpdateMode) {
      setServing(selectedFoodServing?.toString());
    }
  }, [selectedFood, isUpdateMode]);

  const resetForm = () => {
    setCalories(undefined);
    setProtein(undefined);
    setFibre(undefined);
    setServing(undefined);
    setPlantPoints(undefined);
  };
  const handleDiscard = () => {
    resetForm();
    close();
  };

  const handleSubmit = () => {
    if (serving) {
      console.log('plantPoints', parseFloat(plantPoints || ''));
      handleSave(
        selectedFood?.name || name,
        parseFloat(serving),
        parseFloat(calories || ''),
        parseFloat(protein || ''),
        parseFloat(fibre || ''),
        parseFloat(plantPoints || ''),
      );
    }
    resetForm();
  };

  const getTitle = () => {
    switch (mode) {
      case MODES.MANUAL:
        return `New Entry: ${name}`;
      case MODES.CALCULATE:
        return `New Item: ${selectedFood?.name || name}`;
      case MODES.UPDATE:
        return `Update Entry: ${selectedFood?.name}`;
      default:
        break;
    }
  };

  return (
    <Modal title={getTitle()} isVisible={isVisible} close={close}>
      <NewItemModal id="foodObjectForm" action={handleSubmit}>
        <ItemAttributes>
          <EntryBox>Amount Eaten</EntryBox>
          <EntryBox>
            <AttributeInput
              id="serving"
              inputMode="decimal"
              value={serving || ''}
              onChange={(e) => setServing(e.target.value)}
            />
            <TextDisplay>{isManualMode ? 'Serving' : 'grams'}</TextDisplay>
          </EntryBox>
          <EntryBox>Nutrition {isManualMode ? 'Per Serving: ' : 'Per 100g: '}</EntryBox>
          <EntryBox>
            <AttributeInput
              id="calories"
              inputMode="decimal"
              value={calories || ''}
              onChange={(e) => setCalories(e.target.value)}
            />
            <TextDisplay>Calories</TextDisplay>
          </EntryBox>
          <EntryBox>
            <AttributeInput
              id="protein"
              inputMode="decimal"
              value={protein || ''}
              onChange={(e) => setProtein(e.target.value)}
            />
            <TextDisplay>Protein</TextDisplay>
          </EntryBox>
          <EntryBox>
            <AttributeInput
              id="fibre"
              inputMode="decimal"
              value={fibre || ''}
              onChange={(e) => setFibre(e.target.value)}
            />
            <TextDisplay>Fibre</TextDisplay>
          </EntryBox>
          {usePlantPoints && (
            <EntryBox>
              <span>Plant Points:</span>
              <select value={plantPoints} onChange={(e) => setPlantPoints(e.target.value)}>
                <option value={0}>0 Plant Points</option>
                <option value={1}>1 Plant Point</option>
                <option value={0.5}>1/2 Plant Point</option>
                <option value={0.25}>1/4 Plant Point</option>
              </select>
            </EntryBox>
          )}
        </ItemAttributes>

        <Actions>
          <DiscardAction onClick={handleDiscard}>
            {isUpdateMode ? 'Discard Changes' : 'Discard'}
          </DiscardAction>
          <SaveAction type={'submit'} disabled={serving == null || Number.isNaN(parseInt(serving))}>
            {isUpdateMode ? 'Update Entry' : 'Save'}
          </SaveAction>
        </Actions>
        {DEBUGMODE && (
          <div style={{ color: '#000', fontSize: '12px', fontFamily: 'monospace' }}>
            <h4>name</h4>
            <p>{name}</p>
            <h4>selectedFood</h4>
            <p>{JSON.stringify(selectedFood)}</p>
            <h4>selectedFoodServing</h4>
            <p>{selectedFoodServing}</p>
            <h4>mode</h4>
            <p>{mode}</p>
          </div>
        )}
      </NewItemModal>
    </Modal>
  );
};

export default AddNewItem;
