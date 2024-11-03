'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '@/context';
import { FoodEntry, ActionBlock, MenuBarContainer, MenuItem } from './page.style';
import { deleteFood, getFood } from '@/api/food';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import { Recipe, Delete, PlantPoint, Spinner } from '@/icons';
import ModifyFood from '@/components/ModifyItems/ModifyFood';
import patchFood from '@/api/food/patch';

export default function Home() {
  enum Filter {
    Ingredient = 'ingredient',
    Plant = 'plant',
  }

  const uid = useContext(UserContext);

  const [data, setAllData] = useState<DefinedFoodObject[]>([]);
  const [foodFilter, setFoodFilter] = useState<Filter>(Filter.Ingredient);
  const [selectedFood, setSelectedFood] = useState<DefinedFoodObject>();
  const [loadingData, setLoadingData] = useState(true);

  const addNewItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (addNewItemRef.current && selectedFood) {
      addNewItemRef.current.scrollIntoView();
    }
  }, [selectedFood]);

  useEffect(() => {
    setLoadingData(true);
    fetchAllFoodItems();
    setLoadingData(false);
  }, [foodFilter]);

  async function fetchAllFoodItems() {
    setSelectedFood(undefined);
    const response = await getFood(uid);
    console.log({ foodFilter });
    if (foodFilter == Filter.Ingredient) {
      const filteredFood = response.filter((item) => !item.plantPoints || item.plantPoints == 0);
      console.log({ filteredFood });

      setAllData(filteredFood);
    }
    if (foodFilter == Filter.Plant) {
      console.log(response);
      const filteredFood = response.filter((item) => item.plantPoints && item.plantPoints > 0);
      console.log({ filteredFood });
      setAllData(filteredFood);
    }
  }

  const handleSaveFoodToDatabase = async ({
    fid,
    name,
    calories,
    protein,
    fibre,
    plantPoints,
  }: DefinedFoodObject) => {
    if (selectedFood) {
      await patchFood({
        uid,
        fid,
        name,
        calories,
        protein,
        fibre,
        plantPoints,
      });
      fetchAllFoodItems();
    }
  };

  const handleModifyFoodEntry = (foodItem: DefinedFoodObject) => {
    setSelectedFood(foodItem);
  };

  const handleDeleteFoodEntry = async (foodId: string) => {
    await deleteFood(foodId);
    await fetchAllFoodItems();
  };

  return (
    <>
      <MenuBarContainer>
        <MenuItem
          $selected={foodFilter == Filter.Ingredient}
          onClick={() => setFoodFilter(Filter.Ingredient)}
        >
          Non-Veg
        </MenuItem>
        <MenuItem
          $selected={foodFilter == Filter.Plant}
          onClick={() => setFoodFilter(Filter.Plant)}
        >
          <PlantPoint />
          &nbsp;Fruit & Veg&nbsp;
          <PlantPoint />
        </MenuItem>
      </MenuBarContainer>
      {/* <hr /> */}
      {loadingData && <Spinner />}

      {data &&
        data.map((foodItem) => {
          return (
            <FoodEntry role="button" key={foodItem.fid}>
              <span onClick={() => handleModifyFoodEntry(foodItem)}>
                {foodItem.name || '[MISSING NAME]'} ({foodItem.calories || '[MISSING CALORIES]'}{' '}
                cal/100g)
                {foodItem.plantPoints ? <PlantPoint /> : ''}
              </span>
              <ActionBlock>
                <Delete
                  size={24}
                  label="Delete Item from Database"
                  onClick={(e: React.SyntheticEvent) => {
                    e.stopPropagation();
                    handleDeleteFoodEntry(foodItem.fid);
                  }}
                />
              </ActionBlock>
            </FoodEntry>
          );
        })}
      <ModifyFood
        ref={addNewItemRef}
        isVisible={!!selectedFood}
        selectedFood={selectedFood}
        handleSave={handleSaveFoodToDatabase}
        close={() => setSelectedFood(undefined)}
      />
    </>
  );
}
