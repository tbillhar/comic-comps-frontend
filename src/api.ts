import type { CertType, CompResponse } from './types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://comic-comps-backend-7tckae75qq-uc.a.run.app';

export async function fetchComps(query: string, certType: CertType): Promise<CompResponse> {
  const response = await fetch(`${API_BASE_URL}/comps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, cert_type: certType }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch comps.');
  }

  return (await response.json()) as CompResponse;
}
