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

export function safeParseJSON(rawText: string): any {
  if (!rawText) return null;
  try {
    // Remove markdown code fences if present
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // Extract array or object using regex matching
    const match = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("JSON parse failed, returning structured fallback object:", err);
    return null;
  }
}

export interface DirectGeminiResponse {
  text: string;
  groundingMetadata?: {
    groundingChunks?: Array<{
      web?: {
        uri: string;
        title: string;
      }
    }>;
    searchEntryPoint?: {
      renderedContent?: string;
    };
  };
}

export async function callGeminiDirect(prompt: string, useSearchGrounding = false): Promise<DirectGeminiResponse> {
  const apiKey = localStorage.getItem('gemini_api_key') || (import.meta.env as any).VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_UNDEFINED');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const body: any = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  if (useSearchGrounding) {
    body.tools = [
      {
        googleSearch: {}
      }
    ];
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `Gemini API returned status ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const groundingMetadata = data?.candidates?.[0]?.groundingMetadata;

  return {
    text,
    groundingMetadata
  };
}
