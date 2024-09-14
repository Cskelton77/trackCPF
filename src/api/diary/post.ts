import { DiaryData } from '@/interfaces/DailyData';

const postDiary = async ({uid, date, serving, isDirectEntry, foodEntry}: Omit<DiaryData, 'did'>) => {
  const res = await fetch(`api/diary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: uid,
      date,
      serving,
      isDirectEntry,
      foodEntry: {
        fid: foodEntry.fid,
        name: foodEntry.name,
        calories: foodEntry.calories,
        protein: foodEntry.protein,
        fibre: foodEntry.fibre,
        plantPoints: foodEntry.plantPoints,
      },
    }),
  });
  const response = await res.json();
  return response;
};

export default postDiary;
