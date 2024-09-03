import { FoodObject } from "@/interfaces/FoodObject";

const postFood = async (uid: string, food: FoodObject) => {
  const res = await fetch(`api/food`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: uid,
      food: {
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        fibre: food.fibre,
      },
    }),
  });
  const response = await res.json();
  return response;
};

export default postFood;
