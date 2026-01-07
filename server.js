
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 IMEER.ai Server running on http://localhost:${PORT}`)
);
