require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GMAIL_USER = process.env.GMAIL_USER || 'njeximconsultants@gmail.com';
const GMAIL_PASSWORD = process.env.GMAIL_APP_PASSWORD;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post('/api/inquiry', async (req, res) => {
  const { name, phone, email, service, message } = req.body || {};

  if (!name || !phone || !email || !service || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
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
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Requirement:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
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
