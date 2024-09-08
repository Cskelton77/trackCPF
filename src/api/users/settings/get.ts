const getSettings = async (uid: string) => {
  const res = await fetch(`api/users/settings?user=${uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await res.json();
  return response;
};

export default getSettings;
