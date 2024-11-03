import { DefinedFoodObject } from '@/interfaces/FoodObject';

const getFood = async (uid: string, query?: string): Promise<DefinedFoodObject[]> => {
  const url = `api/food?user=${uid}${query ? `&q=${query}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await res.json();
  return response;
};

export default getFood;
