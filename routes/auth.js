const express = require('express');
const router = express.Router();

// POST /api/auth/verify — checks the organizer passcode
// Body: { passcode: "..." }
router.post('/verify', (req, res) => {
  const { passcode } = req.body;
  const correct = (process.env.ORG_PASSCODE || 'mr rabeeh').trim().toLowerCase();

  if (typeof passcode === 'string' && passcode.trim().toLowerCase() === correct) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, error: 'Incorrect passcode' });
});

module.exports = router;
