const nodemailer = require("nodemailer");
const Message = require("../models/Message");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTransporter() {
  const { SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

async function submitContact(req, res) {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const message = String(req.body?.message || "").trim();

  if (!name || name.length > 100) {
    return res.status(400).json({
      error: "Please enter a valid name.",
    });
  }

  if (!emailPattern.test(email) || email.length > 200) {
    return res.status(400).json({
      error: "Please enter a valid email.",
    });
  }

  if (!message) {
    return res.status(400).json({
      error: "Please enter a message.",
    });
  }

  if (message.length > 3000) {
    return res.status(400).json({
      error: "Message is too long. Please keep it under 3000 characters.",
    });
  }

  // Save to MongoDB before attempting to send the email.
  let savedMessage;

  try {
    savedMessage = await Message.create({
      name,
      email,
      message,
      emailSent: false,
    });
  } catch (error) {
    console.error("MongoDB message save failed:", error.message);

    return res.status(500).json({
      error: "Could not save your message. Please try again.",
    });
  }

  // A saved message remains in MongoDB even if Gmail fails.
  try {
    const transporter = getTransporter();

    if (!transporter) {
      console.warn("Message saved; Gmail SMTP is not configured.");
      return res.status(201).json({
        ok: true,
        saved: true,
        emailSent: false,
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <h2>New portfolio message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    await Message.findByIdAndUpdate(savedMessage._id, {
      emailSent: true,
    });

    return res.status(201).json({
      ok: true,
      saved: true,
      emailSent: true,
    });
  } catch (error) {
    console.error("Email notification failed:", error.message);

    // The database save already succeeded.
    return res.status(201).json({
      ok: true,
      saved: true,
      emailSent: false,
    });
  }
}

module.exports = { submitContact };