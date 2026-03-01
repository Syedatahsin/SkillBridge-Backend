import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import { z } from "zod";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // FIX: Clean the URL and add explicit frontend origin to stop CORS errors
  trustedOrigins: [
    process.env.APP_URL?.replace(/\/$/, "") || "", 
    "https://skillbridge-frontend-6qu0.onrender.com"
  ],

  // Better-Auth needs its own URL to handle internal redirects
  baseURL: process.env.BETTER_AUTH_URL,

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        validator: { input: z.enum(["STUDENT", "TUTOR", "ADMIN"]) },
        input: true,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
        validator: { input: z.enum(["ACTIVE", "BANNED"]) },
        input: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  advanced: {
    // Required for Render's HTTPS environment
    useSecureCookies: true,
  },

  cookie: {
    // Allows cookies to work between frontend and backend on different URLs
    sameSite: "none",
    secure: true,
    httpOnly: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        // Clean URL for verification link
        const cleanBaseUrl = process.env.APP_URL?.replace(/\/$/, "");
        const verificationUrl = `${cleanBaseUrl}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: `"SkillBridge" <${process.env.APP_USER}>`,
          to: user.email,
          subject: "Please verify your email!",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SkillBridge Verification</title>
  <style>
    body { margin: 0; padding: 0; width: 100% !important; background-color: #050505; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #050505; padding-bottom: 40px; }
    .container { max-width: 600px; background-color: #0A0A0B; margin: 40px auto; border-radius: 32px; border: 1px solid #1f1f23; overflow: hidden; }
    .header { padding: 40px 20px; text-align: center; background: linear-gradient(to bottom, #0A0A0B, #0f0f11); }
    .logo-text { font-size: 32px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; font-style: italic; color: #ffffff; margin: 0; }
    .logo-accent { color: #a855f7; }
    .content { padding: 0 40px 40px 40px; text-align: center; color: #e5e7eb; }
    .verify-button { background: linear-gradient(to right, #9333ea, #2563eb); color: #ffffff !important; padding: 18px 45px; text-decoration: none; font-weight: 900; border-radius: 14px; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
    .footer { padding: 30px; text-align: center; font-size: 12px; color: #4b5563; border-top: 1px solid #1f1f23; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="logo-text">SKILL<span class="logo-accent">BRIDGE</span></h1>
      </div>
      <div class="content">
        <h2>Verify your identity</h2>
        <p>Hello <strong>${user.name}</strong>, please verify your email to access the SkillBridge ecosystem.</p>
        <div style="margin: 35px 0;">
          <a href="${verificationUrl}" class="verify-button">Verify Identity</a>
        </div>
        <p style="font-size: 12px; color: #6b7280;">If the button fails, copy this: ${verificationUrl}</p>
      </div>
      <div class="footer">
        <p>© 2026 SKILLBRIDGE ECOSYSTEM</p>
      </div>
    </div>
  </div>
</body>
</html>`,
        });

        console.log("Verification email sent:", info.messageId);
      } catch (err) {
        console.error("Email error:", err);
        throw err;
      }
    },
  },
});