const deleteDiary = async (did: string) => {
    const res =  await fetch(`api/diary?did=${did}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    const response = await res.json()
    return response;
}

export default deleteDiary