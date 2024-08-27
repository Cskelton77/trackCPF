'use client';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { AddNewItem, DatePicker, MainDisplay, SearchBar, Summary } from '@/components';
import { DailyData } from '@/interfaces/DailyData';
import getDailyData from '@/api/getDailyData';
import { ItemMode } from '@/interfaces/ItemModes';

export default function Home() {
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [displayDate, setDisplayDate] = useState(moment());
  const [searchValue, setSearchValue] = useState('');
  const [searchResponse, setSearchResponse] = useState<string[]>([]);
  const [showAddNewItem, setShowAddNewItem] = useState<ItemMode>(null);

  useEffect(() => {
    async function fetchDaily() {
      const response = await getDailyData('xyz')
      setDailyData(response);
    } 
    fetchDaily()
  }, []);

  useEffect(() => {
    console.log('date changed', displayDate);
  }, [displayDate]);

  useEffect(() => {
    if (searchValue !== '') {
      setSearchResponse(['abc', 'def', 'ghi']);
    }
  }, [searchValue]);

  return (
    <>
      <DatePicker date={displayDate} />
      <MainDisplay data={dailyData} />
      <AddNewItem isVisible={!!showAddNewItem} mode={showAddNewItem} name={searchValue} close={setShowAddNewItem} />
      <SearchBar
        value={searchValue}
        setValue={setSearchValue}
        response={searchResponse}
        addNewItem={setShowAddNewItem}
      />
      <Summary data={dailyData} />
    </>
  );
}
