// Formats a JS Date (or ISO string) as DD/MM/YY-HH:MM:SS, matching the
// display format requested for the app: 25/09/26-23:36:30
function formatTimestamp(date) {
  const d = date instanceof Date ? date : new Date(date);
  const pad = (n) => String(n).padStart(2, '0');

  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = pad(d.getFullYear() % 100);
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${day}/${month}/${year}-${hours}:${minutes}:${seconds}`;
}

module.exports = { formatTimestamp };
