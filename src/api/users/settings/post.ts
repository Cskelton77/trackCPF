export const saveSettings = async ({ uid, settings }: { uid: string; settings: any }) => {
  const res = await fetch(`api/users/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid,
      settings,
    }),
  });
  const response = await res.json();
  return response;
};
