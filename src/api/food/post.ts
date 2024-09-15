import { FoodObject } from "@/interfaces/FoodObject";

const postFood = async (uuid: string, food: FoodObject) => {
  const res = await fetch(`api/food`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: uuid,
      food: {
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        fibre: food.fibre,
        plantPoints: food.plantPoints,
      },
    }),
  });
  const response = await res.json();
  return response
};

export default postFood;
