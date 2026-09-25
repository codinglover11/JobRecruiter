import axiosClient from './axiosClient';

export async function listScrapeRuns() {
  const { data } = await axiosClient.get('/scrapes');
  return data.runs;
}

export async function getScrapeRun(runId) {
  const { data } = await axiosClient.get(`/scrapes/${runId}`);
  return data;
}

export async function downloadScrapeRunCsv(runId, filename) {
  const response = await axiosClient.get(`/scrapes/${runId}/export`, { responseType: 'blob' });

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', filename || `scrape-run-${runId}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}
