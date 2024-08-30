const getFood = async (uuid: string, query: string) => {
    const res =  await fetch(`api/food?user=${uuid}&q=${query}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    const response = await res.json()
    return response;
}

export default getFood