import { DiaryData } from '@/interfaces/DailyData';

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
        name: foodEntry?.name,
        calories: foodEntry?.calories,
        protein: foodEntry?.protein,
        fibre: foodEntry?.fibre,
      },
    }),
  });
  const response = await res.json();
  return response;
};

export default updateDiary;
