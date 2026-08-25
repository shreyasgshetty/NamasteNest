const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const contact = await Contact.create({ name, email, phone, message });
    res.status(201).json({ success: true, message: 'Message received! We will get back to you soon.', data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
