require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GMAIL_USER = process.env.GMAIL_USER || 'njeximconsultants@gmail.com';
const GMAIL_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8000',
  'https://www.njeximconsultants.com',
  'https://njeximconsultants.com',
  'https://akhiljacobparapurathu.github.io'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  if (isAllowedOrigin || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post('/api/inquiry', async (req, res) => {
  const fields = req.body || {};
  const name = String(fields.name || '').trim();
  const phone = String(fields.phone || '').trim();
  const email = String(fields.email || '').trim();
  const service = String(fields.service || '').trim();
  const message = String(fields.message || '').trim();

  if (!name || !phone || !email || !service || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (name.length > 100 || phone.length > 20 || email.length > 254 || service.length > 100 || message.length > 3000) {
    return res.status(400).json({ success: false, message: 'One or more fields are too long.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  }

  if (!GMAIL_PASSWORD || GMAIL_PASSWORD === 'YOUR_GMAIL_APP_PASSWORD') {
    return res.status(500).json({
      success: false,
      message: 'Email backend is not configured yet. Set the Gmail app password in the environment before sending live inquiries.'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: GMAIL_USER,
      to: GMAIL_USER,
      subject: `New inquiry: ${service}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`,
      html: `
        <h3>New inquiry from NJ EXIM Consultants website</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Service:</strong> ${escapeHtml(service)}</p>
        <p><strong>Requirement:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: 'Inquiry submitted successfully.' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ success: false, message: 'Unable to send inquiry right now. Please call us directly.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'API is running' });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

