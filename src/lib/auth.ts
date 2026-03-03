import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"
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
  // 1. ADDED: Tell Better Auth the Backend URL for redirects
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  // 2. MODIFIED: Dynamic origins to allow Vercel previews and local dev
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigins = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ].filter(Boolean) as string[];

    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return [origin];
    }
    return [];
  },

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
    }
  },
  
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
        const info = await transporter.sendMail({
          from: '"SkillBridge" <anikasyeda82@gmail.com>',
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
    .container { max-width: 600px; background-color: #0A0A0B; margin: 40px auto; border-radius: 32px; border: 1px solid #1f1f23; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); overflow: hidden; }
    .header { padding: 40px 20px; text-align: center; }
    .logo-text { font-size: 32px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; font-style: italic; color: #ffffff; margin: 0; }
    .logo-accent { color: #a855f7; }
    .content { padding: 0 40px 40px 40px; text-align: center; color: #e5e7eb; }
    .verify-button { background: linear-gradient(to right, #9333ea, #2563eb); color: #ffffff !important; padding: 18px 45px; text-decoration: none; font-weight: 900; border-radius: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 2px; }
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
        <h2>Verify your terminal</h2>
        <p>Hello <span class="user-name">${user.name}</span>, welcome to SkillBridge.</p>
        <div class="btn-container"><a href="${verificationUrl}" class="verify-button">Verify Identity</a></div>
        <div class="fallback-box"><a href="${url}" style="color:#a855f7; font-size:12px;">${url}</a></div>
      </div>
      <div class="footer"><p>© 2026 SKILLBRIDGE ECOSYSTEM</p></div>
    </div>
  </div>
</body>
</html>`
        });
        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },

  // 3. ADDED: Advanced settings for Production Cookies
  advanced: {
    cookiePrefix: "skillbridge-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    // Essential for cross-domain frontend/backend
    sameSiteCookie: "none", 
  },

  // 4. ADDED: Performance caching for sessions
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});