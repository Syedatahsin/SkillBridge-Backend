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
      required: true,
      validator: { input: z.enum(["STUDENT", "TUTOR", "ADMIN"]) },
      input: true,
    },
    status: {
      type: "string",
      required: true,
      validator: { input: z.enum(["ACTIVE", "BANNED"]) },
      input: true,
    }
  }
}
,
  
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        console.log(process.env.APP_USER, process.env.APP_PASS);
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
  <title>Email Verification</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0b0b;
      font-family: Arial, Helvetica, sans-serif;
      color: #e5e5e5;
    }

    .container {
      max-width: 620px;
      margin: 50px auto;
      background-color: #ffffff;
      color: #111111;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
    }

    /* Header */
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 28px 20px;
      text-align: center;
      border-bottom: 4px solid #dc2626;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 0.5px;
    }

    /* Content */
    .content {
      padding: 36px;
      line-height: 1.7;
      font-size: 15px;
    }

    .content h2 {
      margin-top: 0;
      font-size: 22px;
      color: #000000;
      margin-bottom: 16px;
    }

    .content p {
      margin: 14px 0;
      color: #333333;
    }

    /* Button */
    .button-wrapper {
      text-align: center;
      margin: 34px 0;
    }

    .verify-button {
      background-color: #dc2626;
      color: #ffffff !important;
      padding: 15px 34px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 8px;
      display: inline-block;
      font-size: 15px;
      letter-spacing: 0.4px;
      box-shadow: 0 8px 20px rgba(220, 38, 38, 0.35);
    }

    .verify-button:hover {
      background-color: #b91c1c;
    }

    /* Link */
    .link {
      word-break: break-all;
      font-size: 13px;
      color: #dc2626;
      background: #f9fafb;
      padding: 12px;
      border-radius: 6px;
      border: 1px dashed #e5e7eb;
    }

    /* Footer */
    .footer {
      background-color: #000000;
      color: #9ca3af;
      padding: 22px;
      text-align: center;
      font-size: 12px;
      border-top: 1px solid #1f2937;
    }
  </style>
</head>

<body>
  <div class="container">

    <!-- Header -->
    <div class="header">
      <h1>Prisma Blog</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Verify Your Email Address</h2>

      <p>
        Hello ${user.name} <br /><br />
        Thank you for registering on <strong>Prisma Blog</strong>.
        Please confirm your email address to activate your account.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn’t work, copy and paste the link below into your browser:
      </p>

      <p class="link">
        ${url}
      </p>

      <p>
        This verification link will expire soon for security reasons.
        If you did not create an account, you can safely ignore this email.
      </p>

      <p>
        Regards, <br />
        <strong>Prisma Blog Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      © 2025 Prisma Blog. All rights reserved.
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

