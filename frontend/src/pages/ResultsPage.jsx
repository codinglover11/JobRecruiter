import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { listScrapeRuns } from '../api/scrapesApi';

const SOURCE_LABEL = { naukri: 'Naukri', linkedin: 'LinkedIn' };

export default function ResultsPage() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listScrapeRuns()
      .then(setRuns)
      .catch((err) => setError(err.response?.data?.message || 'Could not load past runs.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Past scrape runs</h1>

        {loading && <Loader />}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && runs.length === 0 && (
          <p className="text-slate-500">No scrapes yet — go run one from the dashboard.</p>
        )}

        <div className="space-y-3">
          {runs.map((run) => (
            <button
              key={run.id}
              onClick={() => navigate(`/results/${run.id}`)}
              className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-brand-500 hover:shadow-sm transition-all"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {SOURCE_LABEL[run.source] || run.source} — {run.item_count} results
                </p>
                <p className="text-sm text-slate-500">{run.formattedCreatedAt}</p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  run.status === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {run.status}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
