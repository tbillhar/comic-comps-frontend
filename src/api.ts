import type { CompResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export async function fetchComps(query: string): Promise<CompResponse> {
  const response = await fetch(`${API_BASE_URL}/comps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch comps.');
  }

  return (await response.json()) as CompResponse;
}
