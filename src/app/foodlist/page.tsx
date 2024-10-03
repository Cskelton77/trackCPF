'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { Settings, MenuBar } from '@/components';
import { useRouter } from 'next/navigation';
import { SettingsContext, SettingsContextInterface, UserContext, defaultSettings } from '@/context';
import { getSettings } from '@/api/users/settings';
import { PageWrapper, Header, FoodEntry, ActionBlock } from './page.style';
import { deleteFood, getFood } from '@/api/food';
import { DefinedFoodObject, FoodObject } from '@/interfaces/FoodObject';
import { Delete, PlantPoint } from '@/Icons';
import { theme } from '@/theme';
import ModifyFood from '@/components/ModifyItems/ModifyFood';
import patchFood from '@/api/food/patch';

export default function Home() {
  const uid = useContext(UserContext);

  const [data, setAllData] = useState<DefinedFoodObject[]>([]);
  const [selectedFood, setSelectedFood] = useState<DefinedFoodObject>();

  const addNewItemRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (addNewItemRef.current && selectedFood) {
      addNewItemRef.current.scrollIntoView();
    }
  }, [selectedFood]);

  useEffect(() => {
    fetchAllFoodItems();
  }, []);

  async function fetchAllFoodItems() {
    setSelectedFood(undefined);
    const response = await getFood(uid);
    setAllData(response);
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
      {data &&
        data.map((foodItem) => {
          console.log(foodItem);
          return (
            <FoodEntry role="button" key={foodItem.fid}>
              <span onClick={() => handleModifyFoodEntry(foodItem)}>
                {foodItem.name || '[MISSING NAME]'} ({foodItem.calories || '[MISSING CALORIES]'}{' '}
                cal/100g)
                {foodItem.plantPoints ? (
                  <PlantPoint style={{ fill: theme.colours.plantPoint }} />
                ) : (
                  ''
                )}
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
