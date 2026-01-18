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
  const status = err.status || 500;
  
  // Sanitize error message - don't leak sensitive info in production
  let message = err.message || 'An error occurred';
  let details = err.details || null;
  
  // In production, don't reveal technical details
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Internal Server Error';
    details = 'An unexpected error occurred. Our team has been notified.';
    // Log actual error for debugging
    console.error('Server Error:', {
      timestamp: new Date().toISOString(),
      status,
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
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
    return res.status(status).json({ 
      status, 
      message: process.env.NODE_ENV === 'production' && status === 500 ? 'Internal Server Error' : message,
      ...(process.env.NODE_ENV !== 'production' && { details })
    });
  }
};

module.exports = { notFoundHandler, errorHandler };

