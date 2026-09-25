import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScraperCard from '../components/ScraperCard';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Choose a scraper</h1>
        <p className="text-slate-500 mt-1 mb-8">
          Pick a source, fill in your search filters, and we&apos;ll fetch the jobs via Apify.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
          <ScraperCard
            title="Naukri Scraper"
            description="Search Naukri.com jobs by keyword, location, experience and more."
            icon="🧭"
            onClick={() => navigate('/scrape/naukri')}
          />
          <ScraperCard
            title="LinkedIn Scraper"
            description="Paste a LinkedIn jobs search URL and pull the matching postings."
            icon="💼"
            onClick={() => navigate('/scrape/linkedin')}
          />
        </div>

        <div className="mt-10">
          <button
            onClick={() => navigate('/results')}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            View past scrape results &rarr;
          </button>
        </div>
      </main>
    </div>
  );
}
