import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';
import 'dotenv/config';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app-specific password
  }
});

// Send contact form submission
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Save to database
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });
    await contact.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Contacting Agarwal Matrimonial Punjab',
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>We have received your message and will get back to you soon.</p>
        <p><strong>Your Message Details:</strong></p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <p><strong>Message:</strong> ${message}</p>
        <p>Best regards,<br>Agarwal Matrimonial Punjab Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully! A confirmation email has been sent.' });
  } catch (error) {
    console.error('Error in sendContactMessage:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

// Fetch all contact messages
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error in getAllContacts:', error);
    res.status(500).json({ error: 'An error occurred while fetching contact messages' });
  }
};

// Delete a contact message by ID
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Contact message not found' });
    }
    res.status(200).json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error in deleteContactMessage:', error);
    res.status(500).json({ error: 'An error occurred while deleting the contact message' });
  }
};