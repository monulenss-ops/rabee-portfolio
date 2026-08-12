require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const projectsRouter = require('./routes/projects');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/projects', projectsRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve the portfolio HTML file itself (optional convenience)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Rabee Captures backend running on http://localhost:${PORT}`);
});
