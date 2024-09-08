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
import { SettingsContext, SettingsContextInterface } from '@/context';

export default function Home() {
  const router = useRouter();

  const [uid, setUid] = useState<string>('');
  const [userSettings, setUserSettings] = useState<SettingsContextInterface>();
  const [email, setEmail] = useState<string>('');
  const [dailyData, setDailyData] = useState<DiaryData[]>([]);
  const [displayDate, setDisplayDate] = useState(moment());
  const [searchValue, setSearchValue] = useState('');
  const [searchResponse, setSearchResponse] = useState<DefinedFoodObject[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodObject>();
  const [selectedFoodServing, setSelectedFoodServing] = useState<number>();
  const [selectedDiaryEntry, setSelectedDiaryEntry] = useState<string>();
  const [showAddNewItem, setShowAddNewItem] = useState<ItemMode>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const resetSelection = () => {
    setSelectedFood(undefined);
    setSelectedFoodServing(undefined);
    setSelectedDiaryEntry(undefined);
    setSearchValue('');
    setShowAddNewItem(null);
  };

  async function getDropdownOptions() {
    const response = await getFood(uid, searchValue);
    setSearchResponse(response);
  }

  async function fetchDaily() {
    const response = await getDiary(uid, moment(displayDate).format('YYYY-MM-DD'));
    setDailyData(response);
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
    console.log('fetchDaily updated uid', uid);
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
  ) => {
    const isCompleteEntry = !!calories && !!protein && !!fibre;
    const isManualMode = showAddNewItem === MODES.MANUAL;

    if (isCompleteEntry && !isManualMode && !selectedFood) {
      // Save full nutritional data per 100g'
      await postFood(uid, {
        name: name,
        calories: calories,
        protein: protein,
        fibre: fibre,
      });
    }

    if (showAddNewItem === MODES.UPDATE) {
      const diaryUpdate: Partial<DiaryData> = {
        did: selectedDiaryEntry,
        uid,
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
        uid,
        date: moment(displayDate).format('YYYY-MM-DD'),
        serving: serving || 0,
        isDirectEntry: isManualMode,
        foodEntry: {
          name: name,
          calories: calories as number,
          protein: protein as number,
          fibre: fibre as number,
        },
      };
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
    update: FoodObject,
  ) => {
    setSelectedFood(update);
    setSelectedDiaryEntry(diaryId);
    setSelectedFoodServing(currentServing);
    setShowAddNewItem(MODES.UPDATE);
  };

  const openSettings = () => {
    console.log('open settings');
    setSettingsOpen(true);
  };
  const closeSettings = () => {
    console.log('close settings');

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
        deleteFoodItem={handleDeleteFoodEntry}
      />
      <Summary data={dailyData} />

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
            <p>{showAddNewItem}</p>
            <br />
          </div>
        </div>
      )}
    </SettingsContext.Provider>
  );
}
