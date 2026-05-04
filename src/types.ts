export type CertType = 'raw' | 'cgc';

export type Sale = {
  title: string;
  price: number;
  date: string;
  source?: string;
  url?: string;
};

export type CompRequest = {
  query: string;
  cert_type: CertType;
};

export type RangeCompRequest = {
  series: string;
  issue_start: number;
  issue_end: number;
  cert_type: CertType;
  max_results_per_group: number;
};

export type CompResponse = {
  query: string;
  cert_type: CertType;
  median: number | null;
  low: number | null;
  high: number | null;
  usable_count: number;
  safe_buy?: number | null;
  sales: Sale[];
};

export type RangeCompGroup = {
  issue_number: string;
  condition: string;
  median: number | null;
  low: number | null;
  high: number | null;
  usable_count: number;
  sales: Sale[];
};

export type RangeCompResponse = {
  series: string;
  issue_start: number;
  issue_end: number;
  cert_type: CertType;
  broad_query: string;
  raw_item_count: number;
  group_count: number;
  groups: RangeCompGroup[];
};
