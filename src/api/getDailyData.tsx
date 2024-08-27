const getDailyData = async (uuid: string) => {
    const res =  await fetch(`api/dailyData/${uuid}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    const response = await res.json()
    return JSON.parse(response);
}

export default getDailyData