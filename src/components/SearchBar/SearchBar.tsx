import { ItemMode, MODES } from '@/interfaces/ItemModes';
import Delete from '../Icons/Delete';
import Edit from '../Icons/Edit';
import { SearchBarInput } from './SearchBar.style';
import styled from 'styled-components';
import { DefinedFoodObject, FoodObject } from '@/interfaces/FoodObject';
import { deleteFood } from '@/api/food';
import { useState } from 'react';

interface SearchBar {
  value: string;
  setValue: (val: string) => void;
  response: DefinedFoodObject[];
  addNewItem: (mode: ItemMode) => void;
  setSelectedFood: (food: FoodObject) => void;
  handleDelete: (foodId: string) => void;
}

const SearchBar = ({ value, setValue, response, addNewItem, setSelectedFood, handleDelete }: SearchBar) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const addExistingFoodItem = (response: FoodObject) => {
    setSelectedFood(response)
    addNewItem(MODES.CALCULATE)
  }

  const handleBlur = ()=> {
    setTimeout(() => {
        setShowDropdown(false)
    }, 150)
  }
  return (
    <>
      <SearchBarInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => handleBlur()}
      />
      {showDropdown && (
        <ResponseDropdown>
          {value && (
            <ResponseRow onClick={() => addNewItem(MODES.CALCULATE)}>
              Add {value} (p/100g)
            </ResponseRow>
          )}
          {value && (
            <ResponseRow onClick={() => addNewItem(MODES.MANUAL)}>
              Add {value} (p/serving)
            </ResponseRow>
          )}
          {response.map((response) => {
            return (
              <ResponseRow key={response.fid} onClick={()=> addExistingFoodItem(response)}>
                {response.name}
                <ActionBlock>
                  <Edit size={24} />
                  <Delete size={24} onClick={() => handleDelete(response.fid)} />
                </ActionBlock>
              </ResponseRow>
            );
          })}
        </ResponseDropdown>
      )}
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
