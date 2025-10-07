const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Data semua student');
});

module.exports = router;
