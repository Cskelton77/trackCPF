const deleteFood = async (foodId: string) => {
    const res =  await fetch(`api/food?foodId=${foodId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    const response = await res.json()
    return response;
}

export default deleteFood