'use client';
import { createContext, useEffect, useState } from 'react';
import moment from 'moment';
import { AddNewItem, DatePicker, MainDisplay, SearchBar, Summary } from '@/components';
import { DiaryData } from '@/interfaces/DailyData';
import { ItemMode, MODES, NullableNumber } from '@/interfaces/ItemModes';
import { deleteFood, getFood, postFood } from '@/api/food';
import { DefinedFoodObject, FoodObject } from '@/interfaces/FoodObject';
import { deleteDiary, getDiary, postDiary, updateDiary } from '@/api/diary';
import { useRouter } from 'next/navigation';
import { DEBUGMODE } from '@/config';
import Modal from '@/components/_Modal/Modal';
import { Settings } from '@/components/Settings/Settings';
import getSettings from '@/api/users/settings/get';
import { SettingsContext, SettingsContextInterface, defaultSettings } from '@/context';

export default function Home() {
  const router = useRouter();

  const [uid, setUid] = useState<string>('');
  const [userSettings, setUserSettings] = useState<SettingsContextInterface>(defaultSettings);
  const [email, setEmail] = useState<string>('');
  const [dailyData, setDailyData] = useState<DiaryData[]>([]);
  const [weeklyPlantPoints, setWeeklyPlantPoints] = useState(0);
  const [displayDate, setDisplayDate] = useState(moment());
  const [searchValue, setSearchValue] = useState('');
  const [searchResponse, setSearchResponse] = useState<DefinedFoodObject[]>([]);

  const [selectedFood, setSelectedFood] = useState<DefinedFoodObject>();
  const [selectedFoodServing, setSelectedFoodServing] = useState<number>();
  const [selectedDiaryEntry, setSelectedDiaryEntry] = useState<string>();

  const [newItemMode, setNewItemMode] = useState<ItemMode>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const resetSelection = () => {
    setSelectedFood(undefined);
    setSelectedFoodServing(undefined);
    setSelectedDiaryEntry(undefined);
    setSearchValue('');
    setNewItemMode(null);
  };

  async function getDropdownOptions() {
    const response = await getFood(uid, searchValue);
    setSearchResponse(response);
  }

  async function fetchDaily() {
    const response = await getDiary(uid, moment(displayDate).format('YYYY-MM-DD'));
    console.log('response', response);
    setDailyData(response.dailyData);
    setWeeklyPlantPoints(response.weeklyPlantPoints);
  }

  async function fetchSettings() {
    const settings = await getSettings(uid);
    setUserSettings(settings);
  }

  // Initial Load to retreive UID & Email
  useEffect(() => {
    if (uid !== 'ERROR') {
      setUid(localStorage.getItem('uid') || 'ERROR');
      setEmail(localStorage.getItem('email') || 'ERROR');
    } else {
      logout();
    }
  }, []);

  // Use UID to pull user data
  useEffect(() => {
    if (uid == 'ERROR') {
      logout();
    } else {
      if (uid != '') {
        fetchSettings();
        fetchDaily();
      }
    }
  }, [uid, displayDate]);

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
    const x = await deleteFood(foodId);
    await getDropdownOptions();
  };

  const handleSaveDiaryEntry = async (
    name: string,
    serving: number,
    calories: NullableNumber,
    protein: NullableNumber,
    fibre: NullableNumber,
    plantPoints: NullableNumber,
  ) => {
    // Add a new diary item with a food that should be saved to food DB
    const isCompleteEntry = !!calories && !!protein && !!fibre && !!plantPoints;
    const isManualMode = newItemMode === MODES.MANUAL;
    const isUpdateMode = newItemMode === MODES.UPDATE;
    const isCalculateMode = newItemMode === MODES.CALCULATE && selectedFood;

    // Complete Entry means we have a full piece of food
    // Not manual mode means we can save info for /100g
    // Not update mode means we are going to PUT not PATCH
    // No selected food means we did not select an item from the existing dropdown
    if (isCompleteEntry && !isManualMode && !isUpdateMode && !selectedFood) {
      // Save full nutritional data per 100g'
      const newFood = JSON.parse(
        await postFood(uid, {
          name: name,
          calories: calories,
          protein: protein,
          fibre: fibre,
          plantPoints: plantPoints,
        }),
      );
      console.log('newFood', newFood);
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
      console.log('diaryEntry', diaryEntry);
      await postDiary(diaryEntry);
    }

    // Update an existing diary item
    // isUpdateMode
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
        },
      };
      await updateDiary(diaryUpdate);
    }

    // add a new diary item with a food that should not be saved
    // isManualMode
    if (isManualMode || isCalculateMode) {
      const diaryEntry: Omit<DiaryData, 'did'> = {
        uid,
        date: moment(displayDate).format('YYYY-MM-DD'),
        serving: serving || 0,
        isDirectEntry: isManualMode,
        foodEntry: {
          fid: selectedFood?.fid || '',
          name: name,
          calories: calories as number,
          protein: protein as number,
          fibre: fibre as number,
          plantPoints: plantPoints as number,
        },
      };
      console.log('diaryEntry', diaryEntry);
      await postDiary(diaryEntry);
    }

    resetSelection();
    await fetchDaily();
  };

  const handleDeleteDiaryEntry = async (diaryId: string) => {
    await deleteDiary(diaryId);
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
    setNewItemMode(MODES.UPDATE);
  };

  const openSettings = () => {
    setSettingsOpen(true);
  };
  const closeSettings = () => {
    setSettingsOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('email');
    router.push('/');
  };
  return (
    <SettingsContext.Provider value={userSettings}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '6px',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <span onClick={() => openSettings()}>User: {email}</span>
        <button onClick={() => logout()}>Log Out</button>
      </div>
      <DatePicker date={displayDate} setDisplayDate={setDisplayDate} />
      <MainDisplay
        data={dailyData}
        modifyEntry={handleModifyDiaryEntry}
        deleteEntry={handleDeleteDiaryEntry}
      />
      <AddNewItem
        date={displayDate}
        isVisible={!!newItemMode}
        mode={newItemMode}
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
        addNewItem={setNewItemMode}
        setSelectedFood={setSelectedFood}
        deleteFoodItem={handleDeleteFoodEntry}
      />
      <Summary data={dailyData} plantPoints={weeklyPlantPoints} />

      <Settings title="User Settings" isVisible={settingsOpen} close={closeSettings} uid={uid} />

      {DEBUGMODE && (
        <div>
          <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            <br />
            <h4>uid</h4>
            <p>{uid}</p>
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
            <p>{newItemMode}</p>
            <br />
          </div>
        </div>
      )}
    </SettingsContext.Provider>
  );
}
