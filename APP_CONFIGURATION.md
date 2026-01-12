// Global App Configuration (app.js)
//
// 1. Dependencies Setup
// - Express framework
// - EJS-Mate templating engine
// - Cookie parser middleware
// - dotenv for environment variables
//
// 2. View Engine
// - EJS templating language
// - Views directory: /views
//
// 3. Middleware Stack
// - Static files: /public
// - JSON parser
// - URL-encoded parser
// - Cookie parser
//
// 4. Route Management
// - GET / → renders home page
// - /user/* → user routes (register, login, profile)
//
// 5. Error Handling Pipeline
// - 404: "Page not found" handler
// - 500: Global error handler
// - JSON fallback for API requests
//
// 6. Export
// - Express app instance for server.js
