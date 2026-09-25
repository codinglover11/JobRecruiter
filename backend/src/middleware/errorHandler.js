// Centralized error handler. Any error passed to next(err) — or thrown
// inside an asyncHandler-wrapped route — ends up here.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);

  const status = err.status || 500;
  const message = err.expose ? err.message : (status < 500 ? err.message : 'Internal server error');

  res.status(status).json({ message });
}

function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
