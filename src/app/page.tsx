'use client';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { AddNewItem, DatePicker, MainDisplay, SearchBar, Summary } from '@/components';
import { DiaryData } from '@/interfaces/DailyData';
import { ItemMode, MODES, NullableNumber } from '@/interfaces/ItemModes';
import { deleteFood, getFood, postFood } from '@/api/food';
import { DefinedFoodObject, FoodObject } from '@/interfaces/FoodObject';
import { deleteDiary, getDiary, postDiary, updateDiary } from '@/api/diary';

export const DEBUGMODE = true;

export default function Home() {
  const [dailyData, setDailyData] = useState<DiaryData[]>([]);
  const [displayDate, setDisplayDate] = useState(moment());
  const [searchValue, setSearchValue] = useState('');
  const [searchResponse, setSearchResponse] = useState<DefinedFoodObject[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodObject>();
  const [selectedFoodServing, setSelectedFoodServing] = useState<number>();
  const [selectedDiaryEntry, setSelectedDiaryEntry] = useState<string>();
  const [showAddNewItem, setShowAddNewItem] = useState<ItemMode>(null);

  const resetSelection = () => {
    console.log('resetSelection')
    setSelectedFood(undefined)
    setSelectedFoodServing(undefined)
    setSelectedDiaryEntry(undefined)
    setSearchValue('');
    setShowAddNewItem(null);
  }

  async function getDropdownOptions() {
    const response = await getFood('01', searchValue);
    setSearchResponse(response);
  }

  async function fetchDaily() {
    const response = await getDiary('01', moment(displayDate).format('YYYY-MM-DD'));
    // console.log('response', response)
    setDailyData(response);
  }

  // Initial Load
  useEffect(() => {
    fetchDaily();
  }, []);

  useEffect(() => {
    // console.log('date changed', displayDate);
  }, [displayDate]);

  // Search as typing happens
  useEffect(() => {
    if (searchValue !== '') {
      getDropdownOptions();
    }
    if (searchValue == '') {
      setSearchResponse([]);
    }
  }, [searchValue]);

  const handleDeleteFoodEntry = async (foodId: string) => {
    // console.log('food id', foodId);
    const x = await deleteFood(foodId);
    await getDropdownOptions();
  };

  const handleSaveDiaryEntry = async (
    serving: number,
    calories: NullableNumber,
    protein: NullableNumber,
    fibre: NullableNumber,
  ) => {
    const isCompleteEntry = !!calories && !!protein && !!fibre;
    const isManualMode = showAddNewItem === MODES.MANUAL;

    if (isCompleteEntry && !isManualMode) {
      // console.log('Save full nutritional data per 100g');
      await postFood('01', {
        name: searchValue,
        calories: calories,
        protein: protein,
        fibre: fibre,
      });
    }

    if (showAddNewItem === MODES.UPDATE) {
      const diaryUpdate: Partial<DiaryData> = {
        did: selectedDiaryEntry,
        uid: '01',
        serving,
        foodEntry: {
          name: selectedFood?.name || 'error',
          calories: calories as number,
          protein: protein as number,
          fibre: fibre as number,
        },
      };
      await updateDiary(diaryUpdate);
    } else {
      const diaryEntry: Omit<DiaryData, 'did'> = {
        uid: '01',
        date: moment(displayDate).format('YYYY-MM-DD'),
        serving: serving || 0,
        isDirectEntry: isManualMode,
        isCompleteEntry: isCompleteEntry,
        foodEntry: {
          name: searchValue,
          calories: calories as number,
          protein: protein as number,
          fibre: fibre as number,
        },
      };
      await postDiary(diaryEntry);
    }

    resetSelection()
    // setSearchValue('');
    await fetchDaily();
  };

  const handleDeleteDiaryEntry = async (diaryId: string) => {
    await deleteDiary(diaryId);
    await fetchDaily();
  };

  const handleModifyDiaryEntry = async (
    diaryId: string,
    currentServing: number,
    update: FoodObject,
  ) => {
    setSelectedFood(update);
    setSelectedDiaryEntry(diaryId);
    setSelectedFoodServing(currentServing);
    setShowAddNewItem(MODES.UPDATE);
  };

  return (
    <>
      <DatePicker date={displayDate} />
      <MainDisplay
        data={dailyData}
        modifyEntry={handleModifyDiaryEntry}
        deleteEntry={handleDeleteDiaryEntry}
      />
      <AddNewItem
        date={displayDate}
        isVisible={!!showAddNewItem}
        mode={showAddNewItem}
        name={searchValue}
        selectedFood={selectedFood}
        selectedFoodServing={selectedFoodServing}
        handleSave={handleSaveDiaryEntry}
        close={resetSelection}
      />
      <SearchBar
        value={searchValue}
        setValue={setSearchValue}
        response={searchResponse}
        addNewItem={setShowAddNewItem}
        setSelectedFood={setSelectedFood}
        handleDelete={handleDeleteFoodEntry}
      />
      <Summary data={dailyData} />

      {DEBUGMODE && (
        <div>
          <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            <br />
            <h4>dailyData</h4>
            <p>{JSON.stringify(dailyData)}</p>
            <br />
            <h4>displayDate</h4>
            <p>{displayDate.toString()}</p>
            <br />
            <h4>searchValue</h4>
            <p>{searchValue}</p>
            <br />
            <h4>searchResponse</h4>
            <p>{JSON.stringify(searchResponse)}</p>
            <br />
            <h4>selectedFood</h4>
            <p>{JSON.stringify(selectedFood)}</p>
            <br />
            <h4>selectedFoodServing</h4>
            <p>{selectedFoodServing}</p>
            <br />
            <h4>selectedDiaryEntry</h4>
            <p>{selectedDiaryEntry}</p>
            <br />
            <h4>searchResponse</h4>
            <p>{showAddNewItem}</p>
            <br />
          </div>
        </div>
      )}
    </>
  );
}
