// src/pages/NaukriFormPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { runNaukriScrape } from '../api/naukriApi';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date', label: 'Date' },
];

const FRESHNESS_OPTIONS = [
  { value: 'all', label: 'Any time' },
  { value: '1', label: '1 day' },
  { value: '3', label: '3 days' },
  { value: '7', label: '7 days' },
  { value: '15', label: '15 days' },
  { value: '30', label: '30 days' },
];

const EXPERIENCE_OPTIONS = ['all', ...Array.from({ length: 31 }, (_, i) => String(i))];

const WORK_MODE_OPTIONS = [
  { value: 'office', label: 'Office' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

const POSTED_BY_OPTIONS = [
  { value: '1', label: 'Company' },
  { value: '2', label: 'Consultant' },
];

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function NaukriFormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    jobBoard: 'naukri',
    keyword: '',
    searchUrl: '',
    sortBy: 'relevance',
    experience: 'all',
    freshness: 'all',
    fetchDetails: true,
    workMode: [],
    postedBy: [],
    location: '', // NaukriGulf only
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isGulf = form.jobBoard === 'naukrigulf';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.keyword.trim() && !form.searchUrl.trim()) {
      setError('Enter a keyword or paste a search URL.');
      return;
    }

    setLoading(true);
    try {
      // Only send board-relevant fields — mirrors the actor's own rule that
      // Naukri.com filters (workMode/postedBy) and NaukriGulf filters
      // (location) don't apply to the other board.
      const payload = {
        jobBoard: form.jobBoard,
        keyword: form.keyword || undefined,
        searchUrl: form.searchUrl || undefined,
        sortBy: form.sortBy,
        experience: form.experience,
        freshness: form.freshness,
        fetchDetails: form.fetchDetails,
        ...(isGulf
          ? { location: form.location || undefined }
          : {
              workMode: form.workMode.length ? form.workMode : undefined,
              postedBy: form.postedBy.length ? form.postedBy : undefined,
            }),
      };

      const { run } = await runNaukriScrape(payload);
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
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Naukri Scraper</h1>
        <p className="text-slate-500 mb-6">
          Fill in your filters — we&apos;ll build the search and run it via Apify.
          Apify returns up to 50 jobs per run. Full job details are enabled by
          default and can be turned off to make the scrape faster.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job board</label>
            <select
              value={form.jobBoard}
              onChange={(e) => setForm({ ...form, jobBoard: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="naukri">Naukri.com (India)</option>
              <option value="naukrigulf">NaukriGulf.com (Gulf)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Search term (keyword)</label>
            <input
              value={form.keyword}
              onChange={(e) => setForm({ ...form, keyword: e.target.value })}
              placeholder="e.g. Software Developer"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Search URL <span className="text-slate-400 font-normal">(optional — overrides keyword)</span>
            </label>
            <textarea
              rows={2}
              value={form.searchUrl}
              onChange={(e) => setForm({ ...form, searchUrl: e.target.value })}
              placeholder="https://www.naukri.com/software-developer-jobs-in-bengaluru"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
            />
          </div>

          {isGulf && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location (Gulf)</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Dubai, Abu Dhabi, Saudi Arabia"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sort by</label>
              <select
                value={form.sortBy}
                onChange={(e) => setForm({ ...form, sortBy: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job freshness</label>
              <select
                value={form.freshness}
                onChange={(e) => setForm({ ...form, freshness: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {FRESHNESS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Experience (years)</label>
            <select
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {EXPERIENCE_OPTIONS.map((val) => (
                <option key={val} value={val}>{val === 'all' ? 'Any' : `${val} yrs`}</option>
              ))}
            </select>
          </div>

          {!isGulf && (
            <>
              <div>
                <span className="block text-sm font-medium text-slate-700 mb-2">Work mode</span>
                <div className="flex gap-4">
                  {WORK_MODE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={form.workMode.includes(opt.value)}
                        onChange={() => setForm({ ...form, workMode: toggleValue(form.workMode, opt.value) })}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-slate-700 mb-2">Posted by</span>
                <div className="flex gap-4">
                  {POSTED_BY_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={form.postedBy.includes(opt.value)}
                        onChange={() => setForm({ ...form, postedBy: toggleValue(form.postedBy, opt.value) })}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.fetchDetails}
              onChange={(e) => setForm({ ...form, fetchDetails: e.target.checked })}
            />
            Fetch full job details (slower, more complete data)
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium rounded-lg py-2.5"
          >
            {loading ? 'Scraping…' : 'Run Naukri scrape'}
          </button>

          {loading && <Loader label="Talking to Apify — this can take a minute…" />}
        </form>
      </main>
    </div>
  );
}
