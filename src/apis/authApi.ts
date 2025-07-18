import { fetchWrapper } from './fetchWrapper';

const signIn = async (username: string, password: string): Promise<Response> => {
  return fetchWrapper('/api/auth/sign-in', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      username,
      password,
    },
  });
};

const me = async (): Promise<Response> => {
  return fetchWrapper('/api/auth/me', {
    credentials: 'include',
  });
};

export default { signIn, me };
