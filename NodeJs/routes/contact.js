const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// GET all contacts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email FROM Contact');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, message: 'Error fetching contacts', error: error.message });
  }
});

// GET contact by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email FROM Contact WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ success: false, message: 'Error fetching contact', error: error.message });
  }
});

// POST new contact
router.post('/', authenticateToken, async (req, res) => {
  const { name, email } = req.body;

  try {
    const [result] = await db.query('INSERT INTO Contact (name, email) VALUES (?, ?)', [name, email]);

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: { id: result.insertId, name, email }
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ success: false, message: 'Error creating contact', error: error.message });
  }
});

// PUT update contact
router.put('/:id', authenticateToken, async (req, res) => {
  const { name, email } = req.body;

  try {
    const [result] = await db.query('UPDATE Contact SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, message: 'Error updating contact', error: error.message });
  }
});

// DELETE contact
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Contact WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, message: 'Error deleting contact', error: error.message });
  }
});

module.exports = router;
