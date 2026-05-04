import type { CertType, CompResponse, RangeCompResponse } from './types';

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

export async function fetchRangeComps(
  series: string,
  issueStart: number,
  issueEnd: number,
  certType: CertType,
  maxResultsPerGroup: number
): Promise<RangeCompResponse> {
  const response = await fetch(`${API_BASE_URL}/comps/range`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      series,
      issue_start: issueStart,
      issue_end: issueEnd,
      cert_type: certType,
      max_results_per_group: maxResultsPerGroup,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch range comps.');
  }

  return (await response.json()) as RangeCompResponse;
}
