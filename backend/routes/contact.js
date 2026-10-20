const express = require("express");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages. Please try again later." },
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Stops visitors from injecting HTML into the email
function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getTransporter() {
  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

router.post("/", limiter, async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || name.length > 100) {
    return res.status(400).json({ error: "Please enter a valid name." });
  }
  if (!emailPattern.test(email) || email.length > 200) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }
  if (message.length < 10 || message.length > 3000) {
    return res
      .status(400)
      .json({ error: "Message must be between 10 and 3000 characters." });
  }

  const transporter = getTransporter();

  if (!transporter) {
    console.log("--- New contact message (SMTP not configured) ---");
    console.log({ name, email, message });
    return res.json({ ok: true });
  }

  try {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const receivedAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const html = `
<div style="background:#f8f7f2;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#171717;">
  <div style="max-width:560px;margin:0 auto;background:#fffef9;border:1px solid #171717;border-radius:8px;box-shadow:3px 3px 0 #171717;overflow:hidden;">
    <div style="background:#f2d528;padding:18px 24px;border-bottom:1px solid #171717;">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;">Portfolio</div>
      <div style="font-size:22px;font-weight:700;margin-top:4px;">New message</div>
    </div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:6px 0;color:#686762;width:70px;">From</td>
          <td style="padding:6px 0;font-weight:700;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#686762;">Email</td>
          <td style="padding:6px 0;"><a href="mailto:${safeEmail}" style="color:#171717;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#686762;">Received</td>
          <td style="padding:6px 0;">${receivedAt} IST</td>
        </tr>
      </table>
      <div style="margin:20px 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#686762;">Message</div>
      <div style="background:#f8f7f2;border:1px solid #bdbbb3;border-radius:6px;padding:16px;font-size:14px;line-height:1.6;">${safeMessage}</div>
      <a href="mailto:${safeEmail}?subject=Re: Your message on my portfolio"
         style="display:inline-block;margin-top:22px;background:#171717;color:#f8f7f2;text-decoration:none;padding:10px 20px;border-radius:999px;font-size:13px;">
        Reply to ${safeName} &rarr;
      </a>
    </div>
  </div>
</div>`;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html,
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Email send failed:", err.message);
    return res.status(500).json({ error: "Could not send message." });
  }
});

module.exports = router;
