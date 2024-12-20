'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { AddNewItem, DatePicker, MainDisplay, SearchBar, Summary } from '@/components';
import { DiaryData } from '@/interfaces/DailyData';
import { ItemMode, MODES, NullableNumber } from '@/interfaces/ItemModes';
import { postFood } from '@/api/food';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import { deleteDiary, getDiary, postDiary, updateDiary } from '@/api/diary';
import { UserContext } from '@/context';
import { v4 as uuidv4 } from 'uuid';
import { Spinner } from '@/icons';
import DeleteFood from '@/components/ModifyItems/DeleteFood';

export default function Home() {
  const uid = useContext(UserContext);
  const [loadingData, setLoadingData] = useState(true);
  const [dailyData, setDailyData] = useState<DiaryData[]>([]);
  const [weeklyPlantPoints, setWeeklyPlantPoints] = useState(0);
  const [displayDate, setDisplayDate] = useState(moment());
  const [searchValue, setSearchValue] = useState('');

  const [selectedFood, setSelectedFood] = useState<DefinedFoodObject>();
  const [selectedFoodServing, setSelectedFoodServing] = useState<number>();
  const [selectedDiaryEntry, setSelectedDiaryEntry] = useState<string>();

  const [foodMode, setFoodMode] = useState<ItemMode>(null);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  const addNewItemRef = useRef<HTMLDivElement>(null);
  const deleteItemRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDaily();
  }, [displayDate, uid]);

  useEffect(() => {
    if (addNewItemRef.current && foodMode) {
      addNewItemRef.current.scrollIntoView();
    }
  }, [foodMode]);

  useEffect(() => {
    if (deleteItemRef.current && showDelete) {
      deleteItemRef.current.scrollIntoView();
    }
  }, [showDelete]);

  useEffect(() => {
    if (searchBarRef.current && !foodMode) {
      searchBarRef.current.scrollIntoView();
    }
  }, [foodMode]);

  const resetSelection = () => {
    setSelectedFood(undefined);
    setSelectedFoodServing(undefined);
    setSelectedDiaryEntry(undefined);
    setSearchValue('');
    setFoodMode(null);
    setShowDelete(false);
  };

  async function fetchDaily() {
    if (uid) {
      setLoadingData(true);
      const response = await getDiary(uid, moment(displayDate).format('YYYY-MM-DD'));
      setLoadingData(false);
      setDailyData(response.dailyData);
      setWeeklyPlantPoints(response.weeklyPlantPoints);
    }
  }

  // Diary API Calls
  const handleSaveDiaryEntry = async (
    name: string,
    serving: number,
    calories: NullableNumber,
    protein: NullableNumber,
    fibre: NullableNumber,
    plantPoints: NullableNumber,
    recipeWeight?: NullableNumber,
  ) => {
    // Add a new diary item with a food that should be saved to food DB
    const isCompleteEntry =
      !Number.isNaN(calories) && !Number.isNaN(protein) && !Number.isNaN(fibre);
    const isManualMode = foodMode === MODES.MANUAL;
    const isUpdateMode = foodMode === MODES.UPDATE;
    const isCalculateMode = foodMode === MODES.CALCULATE;
    const isCalculateNewFoodMode =
      foodMode === MODES.CALCULATE && isCompleteEntry && !selectedFood?.fid;
    if (isCalculateNewFoodMode) {
      // Save full nutritional data per 100g'
      const newFood = JSON.parse(
        await postFood({
          uid,
          name,
          calories,
          protein,
          fibre,
          plantPoints: plantPoints || 0,
        }),
      );
      const diaryEntry: Omit<DiaryData, 'did'> = {
        uid,
        date: moment(displayDate).format('YYYY-MM-DD'),
        serving: serving || 0,
        isDirectEntry: isManualMode,
        foodEntry: {
          fid: newFood?.fid || '',
          name: name,
          calories: calories as number,
          protein: protein as number,
          fibre: fibre as number,
          plantPoints: plantPoints as number,
        },
      };
      await postDiary(diaryEntry);
    }

    if (isUpdateMode) {
      const diaryUpdate: Partial<DiaryData> = {
        did: selectedDiaryEntry,
        uid,
        serving,
        foodEntry: {
          fid: selectedFood?.fid || '',
          name: selectedFood?.name || 'error',
          calories: calories as number,
          protein: protein as number,
          fibre: fibre as number,
          plantPoints: plantPoints as number,
          ...(recipeWeight && { recipeWeight }),
        },
      };
      await updateDiary(diaryUpdate);
    }

    // add a new diary item with a food that should not be saved
    // isManualMode
    if (isManualMode || (isCalculateMode && !isCalculateNewFoodMode)) {
      const diaryEntry: Omit<DiaryData, 'did'> = {
        uid,
        date: moment(displayDate).format('YYYY-MM-DD'),
        serving: serving || 0,
        isDirectEntry: isManualMode,
        foodEntry: {
          fid: selectedFood?.fid || uuidv4(),
          name: name,
          calories: calories as number,
          protein: protein as number,
          fibre: fibre as number,
          plantPoints: plantPoints as number,
        },
      };
      await postDiary(diaryEntry);
    }

    resetSelection();
    await fetchDaily();
  };

  const handleModifyDiaryEntry = async (
    diaryId: string,
    currentServing: number,
    update: DefinedFoodObject,
  ) => {
    setSelectedFood(update);
    setSelectedDiaryEntry(diaryId);
    setSelectedFoodServing(currentServing);
    setFoodMode(MODES.UPDATE);
  };

  const handleDeleteUnmodifiableEntry = (diaryId: string, item: DefinedFoodObject) => {
    setSelectedFood(item);
    setSelectedDiaryEntry(diaryId);
    setShowDelete(true);
  };

  const handleDeleteDiaryEntry = async (diaryId: string) => {
    await deleteDiary(diaryId);
    resetSelection();
    await fetchDaily();
  };

  return (
    <>
      <DatePicker date={displayDate} setDisplayDate={setDisplayDate} />
      {loadingData && <Spinner />}
      {!loadingData && (
        <>
          <MainDisplay
            data={dailyData}
            modifyEntry={handleModifyDiaryEntry}
            deleteEntry={handleDeleteUnmodifiableEntry}
          />
          <SearchBar
            ref={searchBarRef}
            handleClickResult={setFoodMode}
            setSelectedFood={setSelectedFood}
          />
          <Summary date={displayDate} data={dailyData} plantPoints={weeklyPlantPoints} />
        </>
      )}

      <AddNewItem
        ref={addNewItemRef}
        isVisible={!!foodMode}
        mode={foodMode}
        selectedFood={selectedFood}
        selectedFoodServing={selectedFoodServing}
        handleSave={handleSaveDiaryEntry}
        diaryEntryId={selectedDiaryEntry}
        deleteDiaryEntry={handleDeleteDiaryEntry}
        close={resetSelection}
      />

      <DeleteFood
        ref={deleteItemRef}
        isVisible={showDelete}
        selectedFood={selectedFood}
        diaryEntryId={selectedDiaryEntry || ''}
        deleteDiaryEntry={handleDeleteDiaryEntry}
        close={resetSelection}
      />
    </>
  );
}
