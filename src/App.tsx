import { useMemo, useState, type FormEvent } from 'react';
import { fetchComps, fetchRangeComps } from './api';
import type { CertType, CompResponse, RangeCompResponse } from './types';

const EXAMPLES = [
  'X-Men 1 CGC 4.0',
  'Amazing Spider-Man 50 CGC 6.5',
  'Avengers 1 CGC 3.0',
];

type SearchMode = 'single' | 'range';

function currency(value: number | null | undefined): string {
  if (value == null) return '--';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function App() {
  const [mode, setMode] = useState<SearchMode>('single');
  const [query, setQuery] = useState('X-Men 1 CGC 4.0');
  const [certType, setCertType] = useState<CertType>('cgc');
  const [series, setSeries] = useState('X-Men');
  const [issueStart, setIssueStart] = useState('1');
  const [issueEnd, setIssueEnd] = useState('10');
  const [maxResultsPerGroup, setMaxResultsPerGroup] = useState('20');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [singleData, setSingleData] = useState<CompResponse | null>(null);
  const [rangeData, setRangeData] = useState<RangeCompResponse | null>(null);

  const hasSingleResults = useMemo(() => (singleData?.sales?.length ?? 0) > 0, [singleData]);
  const hasRangeResults = useMemo(() => (rangeData?.groups?.length ?? 0) > 0, [rangeData]);

  async function handleSingleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const next = await fetchComps(query.trim(), certType);
      setSingleData(next);
      setRangeData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSingleData(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleRangeSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const next = await fetchRangeComps(
        series.trim(),
        Number(issueStart),
        Number(issueEnd),
        certType,
        Number(maxResultsPerGroup)
      );
      setRangeData(next);
      setSingleData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setRangeData(null);
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

        <div className="mode-toggle" role="tablist" aria-label="Search mode">
          <button
            type="button"
            className={mode === 'single' ? 'active' : ''}
            onClick={() => setMode('single')}
          >
            Single
          </button>
          <button
            type="button"
            className={mode === 'range' ? 'active' : ''}
            onClick={() => setMode('range')}
          >
            Range
          </button>
        </div>

        <fieldset className="cert-toggle" aria-label="Certification type">
          <label className={certType === 'raw' ? 'active' : ''}>
            <input
              type="radio"
              name="cert_type"
              value="raw"
              checked={certType === 'raw'}
              onChange={() => setCertType('raw')}
            />
            Raw
          </label>
          <label className={certType === 'cgc' ? 'active' : ''}>
            <input
              type="radio"
              name="cert_type"
              value="cgc"
              checked={certType === 'cgc'}
              onChange={() => setCertType('cgc')}
            />
            CGC
          </label>
        </fieldset>

        {mode === 'single' ? (
          <>
            <form onSubmit={handleSingleSubmit} className="search-form">
              <div className="query-control">
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
              </div>

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
          </>
        ) : (
          <form onSubmit={handleRangeSubmit} className="range-form">
            <div className="range-grid">
              <div className="field-control">
                <label htmlFor="series">Series</label>
                <input
                  id="series"
                  name="series"
                  type="text"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  placeholder="X-Men"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>

              <div className="field-control">
                <label htmlFor="issue_start">Issue start</label>
                <input
                  id="issue_start"
                  name="issue_start"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={issueStart}
                  onChange={(e) => setIssueStart(e.target.value)}
                />
              </div>

              <div className="field-control">
                <label htmlFor="issue_end">Issue end</label>
                <input
                  id="issue_end"
                  name="issue_end"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={issueEnd}
                  onChange={(e) => setIssueEnd(e.target.value)}
                />
              </div>

              <div className="field-control">
                <label htmlFor="max_results_per_group">Max per group</label>
                <input
                  id="max_results_per_group"
                  name="max_results_per_group"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={maxResultsPerGroup}
                  onChange={(e) => setMaxResultsPerGroup(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !series.trim() ||
                !issueStart.trim() ||
                !issueEnd.trim() ||
                !maxResultsPerGroup.trim()
              }
            >
              {loading ? 'Checking...' : 'Run range search'}
            </button>
          </form>
        )}
      </section>

      {error ? <section className="error-card">{error}</section> : null}

      {singleData ? (
        <section className="results-grid">
          <article className="stat-card">
            <p>Median</p>
            <strong>{currency(singleData.median)}</strong>
          </article>
          <article className="stat-card">
            <p>Range</p>
            <strong>
              {currency(singleData.low)} - {currency(singleData.high)}
            </strong>
          </article>
          <article className="stat-card">
            <p>Usable sales</p>
            <strong>{singleData.usable_count}</strong>
          </article>
          <article className="stat-card">
            <p>Type</p>
            <strong>{singleData.cert_type.toUpperCase()}</strong>
          </article>
        </section>
      ) : null}

      {hasSingleResults ? (
        <section className="sales-card">
          <div className="sales-card-header">
            <h2>Sales</h2>
            <span>{singleData?.query}</span>
          </div>
          <div className="sales-table-wrap">
            <table className="sales-table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Price</th>
                  <th scope="col">Date</th>
                  <th scope="col">Source</th>
                  <th scope="col">Link</th>
                </tr>
              </thead>
              <tbody>
                {singleData?.sales.map((sale) => (
                  <tr key={`${sale.title}-${sale.date}-${sale.price}`}>
                    <td>{sale.title}</td>
                    <td>{currency(sale.price)}</td>
                    <td>{sale.date}</td>
                    <td>{sale.source ?? '--'}</td>
                    <td>
                      {sale.url ? (
                        <a href={sale.url} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      ) : (
                        '--'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {rangeData ? (
        <section className="results-grid">
          <article className="stat-card">
            <p>Series</p>
            <strong>{rangeData.series}</strong>
          </article>
          <article className="stat-card">
            <p>Range</p>
            <strong>
              #{rangeData.issue_start} - #{rangeData.issue_end}
            </strong>
          </article>
          <article className="stat-card">
            <p>Raw items</p>
            <strong>{rangeData.raw_item_count}</strong>
          </article>
          <article className="stat-card">
            <p>Groups</p>
            <strong>{rangeData.group_count}</strong>
          </article>
        </section>
      ) : null}

      {hasRangeResults ? (
        <section className="range-results">
          <div className="sales-card range-summary-card">
            <div className="sales-card-header">
              <h2>Grouped Results</h2>
              <span>{rangeData?.broad_query}</span>
            </div>
            <p className="range-summary-copy">
              Inspect each issue and condition group to catch unrelated books and parsing misses.
            </p>
          </div>

          {rangeData?.groups.map((group) => (
            <article
              key={`${group.issue_number}-${group.condition}`}
              className="sales-card range-group-card"
            >
              <div className="sales-card-header">
                <h2>
                  Issue #{group.issue_number} / {group.condition}
                </h2>
                <span>{group.usable_count} usable</span>
              </div>

              <div className="group-stats-grid">
                <article className="stat-card">
                  <p>Median</p>
                  <strong>{currency(group.median)}</strong>
                </article>
                <article className="stat-card">
                  <p>Low</p>
                  <strong>{currency(group.low)}</strong>
                </article>
                <article className="stat-card">
                  <p>High</p>
                  <strong>{currency(group.high)}</strong>
                </article>
                <article className="stat-card">
                  <p>Usable sales</p>
                  <strong>{group.usable_count}</strong>
                </article>
              </div>

              <div className="sales-table-wrap">
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Price</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.sales.map((sale) => (
                      <tr key={`${group.issue_number}-${group.condition}-${sale.title}-${sale.date}`}>
                        <td>{sale.title}</td>
                        <td>{currency(sale.price)}</td>
                        <td>{sale.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
