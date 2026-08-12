const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
// Ensure the data directory exists (GitHub/some hosts don't preserve empty folders)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'rabee_captures.db'));

db.pragma('journal_mode = WAL');

// Create the projects table if it doesn't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client TEXT NOT NULL,
    project TEXT NOT NULL,
    category TEXT,
    date TEXT,
    amount REAL DEFAULT 0,
    paid REAL DEFAULT 0,
    status TEXT DEFAULT 'Pending',
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed with sample data only if the table is empty (first run)
const count = db.prepare('SELECT COUNT(*) AS c FROM projects').get().c;
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO projects (client, project, category, date, amount, paid, status, notes)
    VALUES (@client, @project, @category, @date, @amount, @paid, @status, @notes)
  `);
  const seed = [
    { client: 'Client 01', project: 'Wedding Reel', category: 'Wedding', date: '2026-01-12', amount: 25000, paid: 15000, status: 'Pending', notes: 'Deposit received, final edit pending.' },
    { client: 'Client 02', project: 'Promo Video', category: 'Promotional', date: '2025-11-02', amount: 12000, paid: 12000, status: 'Completed', notes: 'Delivered and approved.' },
    { client: 'Client 03', project: 'Event Highlight Reel', category: 'Events', date: '2025-12-20', amount: 9000, paid: 4000, status: 'Pending', notes: 'Awaiting raw footage review.' },
  ];
  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  insertMany(seed);
}

module.exports = db;
