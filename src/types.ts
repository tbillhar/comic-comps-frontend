export type Sale = {
  title: string;
  price: number;
  date: string;
  url?: string;
};

export type CompResponse = {
  query: string;
  median: number | null;
  low: number | null;
  high: number | null;
  usable_count: number;
  safe_buy?: number | null;
  sales: Sale[];
};
