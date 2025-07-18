// TODO: fetch wrapper 구현

const signIn = async (username: string, password: string): Promise<Response> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  return response;
};

const me = async (): Promise<Response> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  return response;
};

export default { signIn, me };
