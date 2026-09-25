import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import ResultsTable from '../components/ResultsTable';
import { getScrapeRun, downloadScrapeRunCsv } from '../api/scrapesApi';

export default function RunResultsPage() {
  const { runId } = useParams();
  const navigate = useNavigate();

  const [run, setRun] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    getScrapeRun(runId)
      .then((data) => {
        setRun(data.run);
        setResults(data.results);
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load this run.'))
      .finally(() => setLoading(false));
  }, [runId]);

  async function handleExport() {
    setExporting(true);
    try {
      await downloadScrapeRunCsv(runId, `${run?.source || 'scrape'}-run-${runId}.csv`);
    } catch (err) {
      setError(err.response?.data?.message || 'Export failed.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/results')}
          className="text-sm text-brand-600 hover:underline mb-4"
        >
          &larr; All runs
        </button>

        {loading && <Loader />}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {run && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 capitalize">{run.source} results</h1>
                <p className="text-slate-500 text-sm">
                  {run.formattedCreatedAt} · {run.item_count} jobs
                </p>
              </div>
              <button
                onClick={handleExport}
                disabled={exporting || !results.length}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2"
              >
                {exporting ? 'Exporting…' : 'Export CSV'}
              </button>
            </div>

            <ResultsTable results={results} />
          </>
        )}
      </main>
    </div>
  );
}
