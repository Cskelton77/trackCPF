import { ItemMode, MODES } from '@/interfaces/ItemModes';
import Delete from '../Icons/Delete';
import { ActionBlock, ResponseDropdown, ResponseRow, SearchBarInput } from './SearchBar.style';
import { DefinedFoodObject, FoodObject } from '@/interfaces/FoodObject';
import { ForwardedRef, forwardRef, useState } from 'react';

interface SearchBar {
  value: string;
  setValue: (val: string) => void;
  response: DefinedFoodObject[];
  addNewItem: (mode: ItemMode) => void;
  setSelectedFood: (food: DefinedFoodObject) => void;
  deleteFoodItem: (foodId: string) => void;
}

const SearchBar = forwardRef(
  (
    { value, setValue, response, addNewItem, setSelectedFood, deleteFoodItem }: SearchBar,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [showDropdown, setShowDropdown] = useState(false);

  const addExistingFoodItem = (response: DefinedFoodObject) => {
    setSelectedFood(response);
    addNewItem(MODES.CALCULATE);
  };

    const handleBlur = () => {
      setTimeout(() => {
        setShowDropdown(false);
      }, 150);
    };
    return (
      <>
        <SearchBarInput
          ref={ref}
          value={value}
          placeholder={'Add a new food'}
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
                <ResponseRow key={response.fid} onClick={() => addExistingFoodItem(response)}>
                  {response.name} ({response.calories} cal/100g)
                  <ActionBlock>
                    {/* <Edit size={24} /> */}
                    <Delete
                      size={24}
                      onClick={(e: React.SyntheticEvent) => {
                        e.stopPropagation();
                        deleteFoodItem(response.fid);
                      }}
                    />
                  </ActionBlock>
                </ResponseRow>
              );
            })}
          </ResponseDropdown>
        )}
      </>
    );
  },
);

export default SearchBar;
