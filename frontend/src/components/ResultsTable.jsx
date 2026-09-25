import { Fragment, useState } from 'react';

function getRawFields(rawData) {
  if (!rawData) return [];

  let data = rawData;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return [['Details', data]];
    }
  }

  if (typeof data !== 'object' || Array.isArray(data)) {
    return [['Details', data]];
  }

  return Object.entries(data).filter(([, value]) => value !== null && value !== undefined && value !== '');
}

function formatDetailLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (character) => character.toUpperCase());
}

function formatDetailValue(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

export default function ResultsTable({ results }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!results?.length) {
    return <p className="text-sm text-slate-500 py-6">No results yet.</p>;
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-4 py-2 font-medium text-slate-600">Title</th>
            <th className="text-left px-4 py-2 font-medium text-slate-600">Company</th>
            <th className="text-left px-4 py-2 font-medium text-slate-600">Location</th>
            <th className="text-left px-4 py-2 font-medium text-slate-600">Scraped At</th>
            <th className="text-left px-4 py-2 font-medium text-slate-600">Link</th>
            <th className="text-left px-4 py-2 font-medium text-slate-600">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((r) => {
            const isExpanded = expandedId === r.id;
            const details = getRawFields(r.raw_data);
            const detailsId = `job-details-${r.id}`;

            return (
              <Fragment key={r.id}>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2">{r.title || '—'}</td>
                  <td className="px-4 py-2">{r.company || '—'}</td>
                  <td className="px-4 py-2">{r.location || '—'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-slate-500">
                    {r.formattedCreatedAt || r.created_at}
                  </td>
                  <td className="px-4 py-2">
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
                      className="text-brand-600 hover:underline"
                    >
                      {isExpanded ? 'Hide details' : 'Show details'}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr id={detailsId}>
                    <td colSpan={6} className="bg-slate-50 px-4 py-4">
                      {details.length ? (
                        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                          {details.map(([key, value]) => (
                            <div key={key} className="min-w-0">
                              <dt className="text-xs font-semibold uppercase text-slate-500">
                                {formatDetailLabel(key)}
                              </dt>
                              <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-800">
                                {formatDetailValue(value)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="text-sm text-slate-500">No additional fields were returned for this job.</p>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
