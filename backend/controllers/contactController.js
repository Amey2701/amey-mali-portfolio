
const { Resend } = require("resend");
const Message = require("../models/Message");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendNotification(savedMessage, name, email, message) {
  if (!resend) {
    console.error("Contact notification failed: RESEND_API_KEY is not configured.");
    return;
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  try {
    const result = await resend.emails.send({
      from: process.env.CONTACT_FROM || "onboarding@resend.dev",
      to: process.env.CONTACT_TO || "ameymali2@gmail.com",
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

    if (result.error) {
      throw new Error(result.error.message || "Resend email failed");
    }

    await Message.findByIdAndUpdate(savedMessage._id, {
      emailSent: true,
    });

    console.log("Contact notification accepted by Resend.");
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

  res.status(201).json({
    ok: true,
    saved: true,
    emailSent: false,
  });

  // Best-effort email attempt after the response.
  void sendNotification(savedMessage, name, email, message);
}

module.exports = { submitContact };