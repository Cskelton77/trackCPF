import { DefinedFoodObject, FoodObject } from '@/interfaces/FoodObject';

interface PatchFood extends DefinedFoodObject {
  uid: string;
}

const patchFood = async ({ uid, fid, name, calories, protein, fibre, plantPoints }: PatchFood) => {
  const res = await fetch(`api/food`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid,
      food: {
        fid,
        name,
        calories,
        protein,
        fibre,
        plantPoints,
      },
    }),
  });
  const response = await res.json();
  return response;
};

export default patchFood;
