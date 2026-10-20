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

// Create the transporter once instead of creating it for every request.
const transporter =
  process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 20000,
        greetingTimeout: 20000,
        socketTimeout: 30000,
      })
    : null;

async function sendNotification(savedMessage, name, email, message) {
  if (!transporter) {
    console.warn("Message saved; Gmail SMTP is not configured.");
    return;
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  try {
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

    console.log("Contact notification email sent.");
  } catch (error) {
    console.error("Contact notification failed:", error.message);
  }
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

  // Respond immediately after MongoDB confirms the message is saved.
  res.status(201).json({
    ok: true,
    saved: true,
    emailSent: false,
  });

  // Attempt email delivery after sending the HTTP response.
  // This is best-effort and is not a durable background job.
  void sendNotification(savedMessage, name, email, message);
}

module.exports = { submitContact };
