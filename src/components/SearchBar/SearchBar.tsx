import { ItemMode, MODES } from '@/interfaces/ItemModes';
import { Delete, PlantPoint } from '@/Icons';
import { ActionBlock, ResponseDropdown, ResponseRow, SearchBarInput } from './SearchBar.style';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import { ForwardedRef, forwardRef, useContext, useEffect, useState } from 'react';
import { deleteFood, getFood } from '@/api/food';
import { UserContext } from '@/context';
import { theme } from '@/theme';

interface SearchBarInterface {
  searchDbOnly?: boolean;
  handleClickResult?: (mode: ItemMode) => void;
  setSelectedFood: (food: DefinedFoodObject) => void;
  placeholder?: string;
}

const SearchBar = forwardRef(
  (
    { searchDbOnly = false, handleClickResult, setSelectedFood, placeholder }: SearchBarInterface,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const uid = useContext(UserContext);

    const [searchValue, setSearchValue] = useState('');
    const [searchResponse, setSearchResponse] = useState<DefinedFoodObject[]>([]);

    const [showDropdown, setShowDropdown] = useState(false);

    async function fetchFoodResults() {
      const response = await getFood(uid, searchValue);
      setSearchResponse(response);
    }

    useEffect(() => {
      if (searchValue !== '') {
        fetchFoodResults();
      }
      if (searchValue == '') {
        setSearchResponse([]);
      }
    }, [searchValue]);

    const handleAddNewItem = (mode: MODES) => {
      setSearchValue('');
      setSelectedFood({ fid: '', name: searchValue });
      if (handleClickResult) {
        handleClickResult(mode);
      }
    };

    const handleAddExistingItem = (response: DefinedFoodObject) => {
      setSelectedFood(response);
      setSearchValue('');
      if (handleClickResult) {
        handleClickResult(MODES.CALCULATE);
      }
    };

    const deleteFoodItem = async (foodId: string) => {
      await deleteFood(foodId);
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
          value={searchValue}
          placeholder={placeholder || 'Add a new food'}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => handleBlur()}
        />
        {showDropdown && (
          <ResponseDropdown>
            {searchValue && (
              <ResponseRow role="button" onClick={() => handleAddNewItem(MODES.CALCULATE)}>
                Add {searchValue} (p/100g)
              </ResponseRow>
            )}
            {searchValue && !searchDbOnly && (
              <ResponseRow role="button" onClick={() => handleAddNewItem(MODES.MANUAL)}>
                Add {searchValue} (p/serving)
              </ResponseRow>
            )}
            {searchResponse.map((response) => {
              return (
                <ResponseRow
                  role="button"
                  key={response.fid}
                  onClick={() => handleAddExistingItem(response)}
                >
                  {response.name} ({response.calories} cal/100g)
                  {/* {' '}
                    {response.plantPoints ? (
                      <PlantPoint style={{ fill: theme.colours.plantPoint }} />
                    ) : (
                      ''
                    )}{' '} */}
                  <ActionBlock>
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
