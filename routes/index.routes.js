const express = require("express");
const router = express.Router({ mergeParams: true });

// Home page route
router.get('/', (req, res) => {
  res.render('pages/home', { title: "IMEER.ai" });
});

// Add your other main routes here

module.exports = router;
