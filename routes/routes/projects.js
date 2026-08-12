const express = require('express');
const router = express.Router();
const db = require('../db');

function computeStatus(amount, paid) {
  return Number(paid) >= Number(amount) ? 'Completed' : 'Pending';
}

// GET /api/projects — list all projects
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  res.json(rows);
});

// GET /api/projects/:id — get a single project
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Project not found' });
  res.json(row);
});

// POST /api/projects — create a new project
router.post('/', (req, res) => {
  const { client, project, category, date, amount, paid, notes } = req.body;

  if (!client || !project) {
    return res.status(400).json({ error: 'client and project are required' });
  }

  const status = computeStatus(amount || 0, paid || 0);

  const stmt = db.prepare(`
    INSERT INTO projects (client, project, category, date, amount, paid, status, notes)
    VALUES (@client, @project, @category, @date, @amount, @paid, @status, @notes)
  `);
  const info = stmt.run({
    client,
    project,
    category: category || null,
    date: date || null,
    amount: Number(amount) || 0,
    paid: Number(paid) || 0,
    status,
    notes: notes || null,
  });

  const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/projects/:id — update an existing project
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  const { client, project, category, date, amount, paid, notes } = req.body;

  const merged = {
    client: client ?? existing.client,
    project: project ?? existing.project,
    category: category ?? existing.category,
    date: date ?? existing.date,
    amount: amount !== undefined ? Number(amount) : existing.amount,
    paid: paid !== undefined ? Number(paid) : existing.paid,
    notes: notes ?? existing.notes,
  };
  merged.status = computeStatus(merged.amount, merged.paid);

  db.prepare(`
    UPDATE projects
    SET client=@client, project=@project, category=@category, date=@date,
        amount=@amount, paid=@paid, status=@status, notes=@notes,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=@id
  `).run({ ...merged, id: req.params.id });

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/projects/:id — delete a project
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ success: true, id: Number(req.params.id) });
});

module.exports = router;
