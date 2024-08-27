import { ItemMode, MODES } from '@/interfaces/ItemModes';
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

interface AddNewItem {
  name: string;
  isVisible: boolean;
  mode: ItemMode;
  close: (mode: null) => void;
}
const AddNewItem = ({ name, isVisible, mode, close }: AddNewItem) => {
  console.log('name', name);

  const handleDiscard = () => {
    close(null);
  };
  const handleSave = () => {
    close(null);
  };

  const isManualMode = mode === MODES.MANUAL

  return isVisible ? (
    <NewItemModal>
      <ItemName>New item: {name}</ItemName>
      <ItemAttributes>
        <EntryBox>{isManualMode ? 'Per Serving: ' : 'Per 100g: '}</EntryBox>
        <EntryBox>
          <AttributeInput />
          <TextDisplay>Calories</TextDisplay>
        </EntryBox>
        <EntryBox>
          <AttributeInput />

          <TextDisplay>Protein</TextDisplay>
        </EntryBox>
        <EntryBox>
          <AttributeInput />

          <TextDisplay>Fibre</TextDisplay>
        </EntryBox>
      </ItemAttributes>
      <Actions>
        <DiscardAction onClick={handleDiscard}>Discard</DiscardAction>
        <SaveAction onClick={handleSave}>Save</SaveAction>
      </Actions>
    </NewItemModal>
  ) : (
    <></>
  );
};

export default AddNewItem;
