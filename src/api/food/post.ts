import { FoodObject } from "@/interfaces/FoodObject";

interface PostFood extends FoodObject {
  uid: string;
}

const postFood = async ({ uid, name, calories, protein, fibre, plantPoints }: PostFood) => {
  const res = await fetch(`api/food`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: uid,
      food: {
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

export default postFood;
