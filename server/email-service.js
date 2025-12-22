const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'd.sushiftw@gmail.com',
    pass: 'ptlf wzjz pgto bsil' // Set this in your environment variables
  }
});

// Contact form endpoint
app.post('/api/send-contact-email', async (req, res) => {
  try {
    const { from_name, from_email, phone, subject, message, timestamp } = req.body;

    // Validate required fields
    if (!from_name || !from_email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from_email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Email content
    const mailOptions = {
      from: 'd.sushiftw@gmail.com',
      to: 'd.sushiftw@gmail.com',
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Informations du contact</h3>
            <p><strong>Nom:</strong> ${from_name}</p>
            <p><strong>Email:</strong> ${from_email}</p>
            <p><strong>Téléphone:</strong> ${phone || 'Non renseigné'}</p>
            <p><strong>Sujet:</strong> ${subject}</p>
            <p><strong>Date:</strong> ${timestamp}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px;">
            <p style="margin: 0; color: #991b1b; font-size: 14px;">
              <strong>Note:</strong> Ce message a été envoyé via le formulaire de contact du site web DSushi.
            </p>
          </div>
        </div>
      `,
      text: `
Nouveau message de contact

Nom: ${from_name}
Email: ${from_email}
Téléphone: ${phone || 'Non renseigné'}
Sujet: ${subject}
Date: ${timestamp}

Message:
${message}

---
Ce message a été envoyé via le formulaire de contact du site web DSushi.
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to customer
    const autoReplyOptions = {
      from: 'd.sushiftw@gmail.com',
      to: from_email,
      subject: 'Confirmation de réception - DSushi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Merci pour votre message !</h2>
          
          <p>Bonjour ${from_name},</p>
          
          <p>Nous avons bien reçu votre message concernant "<strong>${subject}</strong>" et nous vous remercions de nous avoir contactés.</p>
          
          <p>Notre équipe examinera votre demande et vous répondra dans les plus brefs délais.</p>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Récapitulatif de votre message:</strong></p>
            <p style="margin: 5px 0 0 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>En attendant, n'hésitez pas à découvrir nos délicieux sushis sur notre site web.</p>
          
          <p>Cordialement,<br>
          L'équipe DSushi</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #6b7280;">
            DSushi - Avenue de la Liberté, Tunis, Tunisie<br>
            Email: d.sushiftw@gmail.com | Téléphone: +216 00 000 000
          </p>
        </div>
      `
    };

    await transporter.sendMail(autoReplyOptions);

    res.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Email Service' });
});

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
});

module.exports = app;
