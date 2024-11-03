import { DiaryData } from '@/interfaces/DailyData';
import { v4 as uuidv4 } from 'uuid';

const updateDiary = async ({ did, uid, serving, foodEntry }: Partial<DiaryData>) => {
  const res = await fetch(`api/diary`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      did,
      uid,
      serving,
      foodEntry: {
        fid: foodEntry?.fid || uuidv4(),
        name: foodEntry?.name,
        calories: foodEntry?.calories,
        protein: foodEntry?.protein,
        fibre: foodEntry?.fibre,
        plantPoints: foodEntry?.plantPoints,
        ...(foodEntry?.recipeWeight && { recipeWeight: foodEntry.recipeWeight }),
      },
    }),
  });
  const response = await res.json();
  return response;
};

export default updateDiary;
