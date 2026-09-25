export default function ScraperCard({ title, description, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-brand-500 transition-all w-full"
    >
      <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
      <span className="inline-block mt-4 text-sm font-medium text-brand-600">
        Start scraping &rarr;
      </span>
    </button>
  );
}
