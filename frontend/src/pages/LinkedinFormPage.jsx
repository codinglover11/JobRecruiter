import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { runLinkedinScrape } from '../api/linkedinApi';

export default function LinkedinFormPage() {
  const navigate = useNavigate();

  const [searchUrl, setSearchUrl] = useState('');
  const [count, setCount] = useState(25);
  const [scrapeCompany, setScrapeCompany] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { run } = await runLinkedinScrape({ searchUrl, count, scrapeCompany });
      navigate(`/results/${run.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Scrape failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">LinkedIn Scraper</h1>
        <p className="text-slate-500 mb-6">
          Go to{' '}
          <a
            href="https://www.linkedin.com/jobs/search/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 hover:underline"
          >
            linkedin.com/jobs/search
          </a>
          , apply your filters, then paste the resulting URL below.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn search URL</label>
            <textarea
              required
              rows={3}
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
              placeholder="https://www.linkedin.com/jobs/search/?keywords=...&location=..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Number of jobs</label>
              <input
                type="number"
                min="10"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={scrapeCompany}
                  onChange={(e) => setScrapeCompany(e.target.checked)}
                />
                Also scrape company details
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium rounded-lg py-2.5"
          >
            {loading ? 'Scraping…' : 'Run LinkedIn scrape'}
          </button>

          {loading && <Loader label="Talking to Apify — this can take a minute…" />}
        </form>
      </main>
    </div>
  );
}
