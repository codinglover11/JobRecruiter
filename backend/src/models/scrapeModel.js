const { query } = require('../config/db');

async function createRun({ source, inputParams, requestedBy }) {
  const { rows } = await query(
    `INSERT INTO scrape_runs (source, input_params, requested_by)
     VALUES ($1, $2, $3) RETURNING *`,
    [source, inputParams, requestedBy]
  );
  return rows[0];
}

async function finishRun(runId, { itemCount, status = 'success', errorMessage = null }) {
  const { rows } = await query(
    `UPDATE scrape_runs SET item_count = $2, status = $3, error_message = $4
     WHERE id = $1 RETURNING *`,
    [runId, itemCount, status, errorMessage]
  );
  return rows[0];
}

async function insertResults(runId, items) {
  if (!items.length) return 0;

  const columns = ['run_id', 'title', 'company', 'location', 'url', 'raw_data'];
  const rows = [];
  const params = [];

  items.forEach((item, i) => {
    const offset = i * columns.length;
    rows.push(`(${columns.map((_, j) => `$${offset + j + 1}`).join(', ')})`);
    params.push(runId, item.title || null, item.company || null, item.location || null, item.url || null, item.raw);
  });

  const sql = `INSERT INTO scrape_results (${columns.join(', ')}) VALUES ${rows.join(', ')}`;
  await query(sql, params);
  return items.length;
}

async function listRuns() {
  const { rows } = await query(
    `SELECT r.*, u.email AS requested_by_email
     FROM scrape_runs r
     LEFT JOIN users u ON u.id = r.requested_by
     ORDER BY r.created_at DESC`
  );
  return rows;
}

async function getRun(runId) {
  const { rows } = await query('SELECT * FROM scrape_runs WHERE id = $1', [runId]);
  return rows[0] || null;
}

async function getResultsForRun(runId) {
  const { rows } = await query(
    'SELECT * FROM scrape_results WHERE run_id = $1 ORDER BY id ASC',
    [runId]
  );
  return rows;
}

module.exports = {
  createRun,
  finishRun,
  insertResults,
  listRuns,
  getRun,
  getResultsForRun,
};
