// ========== 404 HANDLER ==========
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
  const message = err.message || 'Internal server error';
  try {
    return res.status(status).render('errors/error', {
      title: err.title || 'Something went wrong',
      status,
      message,
      details: err.details,
    });
  } catch (renderErr) {
    return res.status(status).json({ 
      status, 
      message,
      details: err.details 
    });
  }
};

module.exports = { notFoundHandler, errorHandler };
