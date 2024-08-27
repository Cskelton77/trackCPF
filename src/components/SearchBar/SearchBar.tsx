import { ItemMode, MODES } from '@/interfaces/ItemModes';
import Delete from '../Icons/Delete';
import Edit from '../Icons/Edit';
import { SearchBarInput } from './SearchBar.style';
import styled from 'styled-components';

interface SearchBar {
  value: string;
  setValue: (val: string) => void;
  response: string[];
  addNewItem: (mode: ItemMode) => void;
}

const SearchBar = ({ value, setValue, response, addNewItem }: SearchBar) => {
  return (
    <>
      <SearchBarInput value={value} onChange={(e) => setValue(e.target.value)} />
      <ResponseDropdown>
        {value && <ResponseRow onClick={()=> addNewItem(MODES.CALCULATE)}>Add {value} (p/100g)</ResponseRow>}
        {value && <ResponseRow onClick={()=> addNewItem(MODES.MANUAL)}>Add {value} (p/serving)</ResponseRow>}
        {response.map((response) => {
          console.log('response', response);
          return (
            <ResponseRow key={response}>
              {response}
              <ActionBlock>
                <Edit size={24} />
                <Delete  size={24}/>
              </ActionBlock>
            </ResponseRow>
          );
        })}
      </ResponseDropdown>
    </>
  );
};

export default SearchBar;

const ResponseDropdown = styled.div`
  margin: 0 auto;
  width: 85%;
`;

const ResponseRow = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: 'pointer';
  width: 100%;
  height: 36px;
  font-size: 24px;
  padding: 6px;
  color: #000;
  background-color: #fee;
  border-bottom: 1px solid black;
`;

const ActionBlock = styled.div`
  display: flex;
`;
