// ========== 404 HANDLER ==========
// Handles all not found errors and creates structured error for rendering
const notFoundHandler = (req, res, next) => {
  const error = new Error('The page you are looking for does not exist.');
  error.status = 404;
  error.title = 'Page Not Found';
  error.details = 'The requested URL was not found on this server.';
  next(error);
};

// ========== ERROR HANDLER ==========
const errorHandler = (err, req, res, next) => {
  const status = Number.isInteger(err.status) ? err.status : 500;
  const isServerError = status >= 500;
  const wantsJson = req.originalUrl.startsWith('/api') || (req.headers.accept && req.headers.accept.includes('application/json'));

  // Always keep user-facing text minimal
  const message = isServerError
    ? 'Something went wrong. Please try again.'
    : (err.publicMessage || err.message || 'Request could not be completed.');
  const details = isServerError ? null : err.details || null;

  // Log technical details for troubleshooting without exposing them to clients
  if (isServerError) {
    console.error('Server Error:', {
      timestamp: new Date().toISOString(),
      status,
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }
  
  // Respond with JSON for API requests, otherwise render error page
  if (wantsJson) {
    return res.status(status).json({ status, message, ...(details ? { details } : {}) });
  }

  try {
    return res.status(status).render('errors/error', {
      title: err.title || (status === 500 ? 'Server Error' : 'Error'),
      status,
      message,
      details,
    });
  } catch (renderErr) {
    // Fallback JSON response
    return res.status(status).json({ status, message, ...(details ? { details } : {}) });
  }
};

module.exports = { notFoundHandler, errorHandler };

