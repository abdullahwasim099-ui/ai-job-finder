export const safeFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const customKey = localStorage.getItem('gemini_api_key') || (import.meta.env as any).VITE_GEMINI_API_KEY || '';
  
  const safeInit: RequestInit = init ? { ...init } : {};
  const headersObj: Record<string, string> = {};

  if (safeInit.headers) {
    if (safeInit.headers instanceof Headers) {
      safeInit.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
    } else if (Array.isArray(safeInit.headers)) {
      safeInit.headers.forEach(([key, value]) => {
        headersObj[key] = value;
      });
    } else {
      Object.assign(headersObj, safeInit.headers);
    }
  }

  if (customKey) {
    headersObj['x-gemini-key'] = customKey;
  }

  safeInit.headers = headersObj;
  return fetch(input, safeInit);
};
