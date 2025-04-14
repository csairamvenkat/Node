const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// GET all accounts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email FROM Account');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ success: false, message: 'Error fetching accounts', error: error.message });
  }
});

// GET account by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email FROM Account WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ success: false, message: 'Error fetching account', error: error.message });
  }
});

// POST new account
router.post('/', authenticateToken, async (req, res) => {
  const { name, email } = req.body;

  try {
    const [result] = await db.query('INSERT INTO Account (name, email) VALUES (?, ?)', [name, email]);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { id: result.insertId, name, email }
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ success: false, message: 'Error creating account', error: error.message });
  }
});

// PUT update account
router.put('/:id', authenticateToken, async (req, res) => {
  const { name, email } = req.body;

  try {
    const [result] = await db.query('UPDATE Account SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.json({ success: true, message: 'Account updated successfully' });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ success: false, message: 'Error updating account', error: error.message });
  }
});

// DELETE account
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Account WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, message: 'Error deleting account', error: error.message });
  }
});

module.exports = router;
