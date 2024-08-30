const postUser = async (email: string) => {
  const res = await fetch(`api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });
  const response = await res.json();
  return response;
};

export default postUser