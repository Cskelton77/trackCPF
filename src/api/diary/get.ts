const getDiary = async (uuid: string, date: string) => {
    const res =  await fetch(`api/diary?user=${uuid}&date=${date}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    const response = await res.json()
    return response;
}

export default getDiary