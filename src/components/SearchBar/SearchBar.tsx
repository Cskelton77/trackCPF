import { ItemMode, MODES } from '@/interfaces/ItemModes';
import { Delete } from '@/Icons';
import { ActionBlock, ResponseDropdown, ResponseRow, SearchBarInput } from './SearchBar.style';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import { ForwardedRef, forwardRef, useState } from 'react';

interface SearchBarInterface {
  value: string;
  setValue: (val: string) => void;
  response: DefinedFoodObject[];
  addNewItem: (mode: ItemMode) => void;
  setSelectedFood: (food: DefinedFoodObject) => void;
  deleteFoodItem: (foodId: string) => void;
}

const SearchBar = forwardRef(
  (
    { value, setValue, response, addNewItem, setSelectedFood, deleteFoodItem }: SearchBarInterface,
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
          id="searchForFood"
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
              <ResponseRow role="button" onClick={() => addNewItem(MODES.CALCULATE)}>
                Add {value} (p/100g)
              </ResponseRow>
            )}
            {value && (
              <ResponseRow role="button" onClick={() => addNewItem(MODES.MANUAL)}>
                Add {value} (p/serving)
              </ResponseRow>
            )}
            {response.map((response) => {
              return (
                <ResponseRow
                  role="button"
                  key={response.fid}
                  onClick={() => addExistingFoodItem(response)}
                >
                  {response.name} ({response.calories} cal/100g)
                  <ActionBlock>
                    {/* <Edit size={24} /> */}
                    <Delete
                      size={24}
                      label="Delete Item from Database"
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
