import { useMemo, useState, type FormEvent } from 'react';
import { fetchComps } from './api';
import type { CompResponse } from './types';

const EXAMPLES = [
  'X-Men 1 CGC 4.0',
  'Amazing Spider-Man 50 CGC 6.5',
  'Avengers 1 CGC 3.0',
];

function currency(value: number | null | undefined): string {
  if (value == null) return '--';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function App() {
  const [query, setQuery] = useState('X-Men 1 CGC 4.0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CompResponse | null>(null);

  const hasResults = useMemo(() => (data?.sales?.length ?? 0) > 0, [data]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const next = await fetchComps(query.trim());
      setData(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Convention comp checker</p>
        <h1>Comic Comps</h1>
        <p className="subcopy">
          Mobile-first front end for your sold-comps backend. Built to fit a GitHub + Codex workflow.
        </p>

        <form onSubmit={handleSubmit} className="search-form">
          <label htmlFor="query" className="sr-only">
            Search query
          </label>
          <input
            id="query"
            name="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="X-Men 1 CGC 4.0"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Checking...' : 'Get comps'}
          </button>
        </form>

        <div className="chip-row">
          {EXAMPLES.map((example) => (
            <button key={example} type="button" className="chip" onClick={() => setQuery(example)}>
              {example}
            </button>
          ))}
        </div>
      </section>

      {error ? <section className="error-card">{error}</section> : null}

      {data ? (
        <section className="results-grid">
          <article className="stat-card">
            <p>Median</p>
            <strong>{currency(data.median)}</strong>
          </article>
          <article className="stat-card">
            <p>Range</p>
            <strong>
              {currency(data.low)} - {currency(data.high)}
            </strong>
          </article>
          <article className="stat-card">
            <p>Safe buy</p>
            <strong>{currency(data.safe_buy ?? null)}</strong>
          </article>
          <article className="stat-card">
            <p>Usable sales</p>
            <strong>{data.usable_count}</strong>
          </article>
        </section>
      ) : null}

      {hasResults ? (
        <section className="sales-card">
          <div className="sales-card-header">
            <h2>Recent usable comps</h2>
            <span>{data?.query}</span>
          </div>
          <ul className="sales-list">
            {data?.sales.map((sale) => (
              <li key={`${sale.title}-${sale.date}-${sale.price}`} className="sale-row">
                <div>
                  <p className="sale-price">{currency(sale.price)}</p>
                  <p className="sale-title">{sale.title}</p>
                </div>
                <div className="sale-meta">
                  <span>{sale.date}</span>
                  {sale.url ? (
                    <a href={sale.url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
