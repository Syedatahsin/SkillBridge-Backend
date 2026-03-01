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
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  
  trustedOrigins: [process.env.APP_URL!],
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
}
,
  
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  advanced: {
        // Crucial for Render deployments
        useSecureCookies: true, 
    },
    cookie: {
        // This allows the cookie to be sent from your-backend.onrender.com 
        // to your-frontend.onrender.com
        sameSite: "none", 
        secure: true,     // Must be true for HTTPS
        httpOnly: true,   // Security best practice
    },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        console.log(process.env.APP_USER, process.env.APP_PASS);
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
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
    /* Reset styles for email clients */
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #050505;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #050505;
      padding-bottom: 40px;
    }

    .container {
      max-width: 600px;
      background-color: #0A0A0B;
      margin: 40px auto;
      border-radius: 32px;
      border: 1px solid #1f1f23;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    /* Header with SkillBridge Branding */
    .header {
      padding: 40px 20px;
      text-align: center;
      background: linear-gradient(to bottom, #0A0A0B, #0f0f11);
    }

    .logo-text {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -1px;
      text-transform: uppercase;
      font-style: italic;
      color: #ffffff;
      margin: 0;
    }

    .logo-accent {
      color: #a855f7; /* Purple accent */
    }

    /* Content Area */
    .content {
      padding: 0 40px 40px 40px;
      text-align: center;
      color: #e5e7eb;
    }

    .content h2 {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #9ca3af;
      margin: 20px 0;
    }

    .user-name {
      color: #ffffff;
      font-weight: bold;
    }

    /* Enthusiastic Button */
    .btn-container {
      margin: 35px 0;
    }

    .verify-button {
      background: linear-gradient(to right, #9333ea, #2563eb);
      color: #ffffff !important;
      padding: 18px 45px;
      text-decoration: none;
      font-weight: 900;
      border-radius: 14px;
      display: inline-block;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    /* Fallback Link */
    .fallback-box {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid #1f1f23;
      padding: 15px;
      border-radius: 12px;
      margin-top: 30px;
    }

    .fallback-link {
      word-break: break-all;
      font-size: 12px;
      color: #a855f7;
      text-decoration: none;
    }

    /* Footer */
    .footer {
      padding: 30px;
      text-align: center;
      font-size: 12px;
      color: #4b5563;
      border-top: 1px solid #1f1f23;
    }

    .footer p {
      margin: 5px 0;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    @media only screen and (max-width: 600px) {
      .container {
        margin: 10px;
        border-radius: 20px;
      }
      .content {
        padding: 0 20px 30px 20px;
      }
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">
      
      <div class="header">
        <h1 class="logo-text">SKILL<span class="logo-accent">BRIDGE</span></h1>
        <p style="color: #6b7280; font-size: 10px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; margin-top: 5px;">
          Learners & Teachers Hub
        </p>
      </div>

      <div class="content">
        <h2>Verify your terminal</h2>
        <p>
          Hello <span class="user-name">${user.name}</span>,<br>
          Welcome to the SkillBridge ecosystem. To finalize your access and begin your journey, please verify your email address.
        </p>

        <div class="btn-container">
          <a href="${verificationUrl}" class="verify-button">Verify Identity</a>
            </div>

        <p style="font-size: 13px;">
          If the button above does not initialize, copy and paste this link into your browser:
        </p>
        
        <div class="fallback-box">
          <a href="${url}" class="fallback-link">${url}</a>
        </div>
      </div>

      <div class="footer">
        <p>© 2026 SKILLBRIDGE ECOSYSTEM</p>
        <p style="font-size: 10px;">If you did not request this, please disregard.</p>
      </div>

    </div>
  </div>
</body>
</html>
`
        });

        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err)
        throw err;
      }
    },
  },

 
});

