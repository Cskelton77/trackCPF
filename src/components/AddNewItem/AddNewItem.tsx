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
import { useEffect, useState } from 'react';
import { Moment } from 'moment';
import { FoodObject } from '@/interfaces/FoodObject';
import { DEBUGMODE } from '@/app/page';

interface AddNewItem {
  name: string;
  selectedFood?: FoodObject;
  selectedFoodServing?: number;
  date: Moment;
  isVisible: boolean;
  mode: ItemMode;
  handleSave: (
    serving: number,
    calories: NullableNumber,
    protein: NullableNumber,
    fibre: NullableNumber,
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
  const isManualMode = mode === MODES.MANUAL;
  const isUpdateMode = mode === MODES.UPDATE;

  const [calories, setCalories] = useState<NullableNumber>();
  const [protein, setProtein] = useState<NullableNumber>();
  const [fibre, setFibre] = useState<NullableNumber>();
  const [serving, setServing] = useState<NullableNumber>();

  useEffect(() => {
    console.log('useEffect AddNewItem');
    if (selectedFood) {
      setCalories(selectedFood.calories);
      setProtein(selectedFood.protein);
      setFibre(selectedFood.fibre);
    }
    if (isUpdateMode) {
      setServing(selectedFoodServing);
    }
  }, [selectedFood, isUpdateMode]);

  const resetForm = () => {
    console.log('clear form');
    setCalories(null);
    setProtein(null);
    setFibre(null);
    setServing(null);
  };
  const handleDiscard = () => {
    resetForm();
    close();
  };

  const handleSubmit = () => {
    if (serving) {
      handleSave(serving, calories || null, protein || null, fibre || null);
    }
    resetForm();
  };

  const getTitle = () => {
    console.log(mode);
    switch (mode) {
      case MODES.MANUAL:
        return `New Entry: ${name}`;
      case MODES.CALCULATE:
        return `New Item: ${name}`;
      case MODES.UPDATE:
        return `Update Entry: ${selectedFood?.name}`;
      default:
        break;
    }
  };

  return isVisible ? (
    <NewItemModal id="foodObjectForm" action={handleSubmit}>
      <ItemName>{getTitle()}</ItemName>
      <ItemAttributes>
        <EntryBox>Amount Eaten</EntryBox>

        <EntryBox>
          <AttributeInput
            id="serving"
            type="number"
            value={serving || ''}
            onChange={(e) => setServing(parseInt(e.target.value))}
          />
          <TextDisplay>{isManualMode ? 'Serving' : 'grams'}</TextDisplay>
        </EntryBox>
        <EntryBox>Nutrition {isManualMode ? 'Per Serving: ' : 'Per 100g: '}</EntryBox>
        <EntryBox>
          <AttributeInput
            id="calories"
            type="number"
            value={calories || ''}
            onChange={(e) => setCalories(parseInt(e.target.value))}
          />
          <TextDisplay>Calories</TextDisplay>
        </EntryBox>
        <EntryBox>
          <AttributeInput
            id="protein"
            type="number"
            value={protein || ''}
            onChange={(e) => setProtein(parseInt(e.target.value))}
          />
          <TextDisplay>Protein</TextDisplay>
        </EntryBox>
        <EntryBox>
          <AttributeInput
            id="fibre"
            type="number"
            value={fibre || ''}
            onChange={(e) => setFibre(parseInt(e.target.value))}
          />
          <TextDisplay>Fibre</TextDisplay>
        </EntryBox>
      </ItemAttributes>
      <Actions>
        <DiscardAction onClick={handleDiscard}>
          {isUpdateMode ? 'Discard Changes' : 'Discard'}
        </DiscardAction>
        <SaveAction type={'submit'} disabled={serving == null}>
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
  ) : (
    <></>
  );
};

export default AddNewItem;
