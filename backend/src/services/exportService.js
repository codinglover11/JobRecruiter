const { Parser } = require('json2csv');

const EXPORT_FIELDS = [
  { label: 'Title', value: 'title' },
  { label: 'Company', value: 'company' },
  { label: 'Location', value: 'location' },
  { label: 'URL', value: 'url' },
  { label: 'Scraped At', value: 'formattedCreatedAt' },
];

function getRawData(rawData) {
  if (!rawData) return {};
  if (typeof rawData === 'object' && !Array.isArray(rawData)) return rawData;

  if (typeof rawData === 'string') {
    try {
      const parsed = JSON.parse(rawData);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : { details: parsed };
    } catch {
      return { details: rawData };
    }
  }

  return { details: rawData };
}

function formatCsvValue(value) {
  if (value === null || value === undefined) return '';
  return typeof value === 'object' ? JSON.stringify(value) : value;
}

function resultsToCsv(results) {
  const detailKeys = [...new Set(results.flatMap((result) => Object.keys(getRawData(result.raw_data))))];
  const fields = [
    ...EXPORT_FIELDS,
    ...detailKeys.map((key) => ({ label: `Apify: ${key}`, value: `apify_${key}` })),
  ];
  const rows = results.map((result) => {
    const rawData = getRawData(result.raw_data);
    const detailColumns = Object.fromEntries(
      detailKeys.map((key) => [`apify_${key}`, formatCsvValue(rawData[key])])
    );
    return { ...result, ...detailColumns };
  });

  return new Parser({ fields }).parse(rows);
}

module.exports = { resultsToCsv };
