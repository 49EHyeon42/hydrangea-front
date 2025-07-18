type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

interface FetchOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: T;
  credentials?: RequestCredentials;
}

export const fetchWrapper = async <T extends Record<string, unknown>>(
  path: string,
  options: FetchOptions<T> = {},
): Promise<Response> => {
  const { method = 'GET', headers, body, credentials = 'omit' } = options;

  const init: RequestInit = {
    method,
    headers,
    credentials,
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, init);

    if (response.status >= 500 && response.status < 600) {
      // TODO: 500번대 에러, 서버 기록
    }

    return response;
  } catch (error) {
    // TODO: 네트워크 오류, 서버 기록

    throw error;
  }
};
