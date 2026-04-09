import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import { z } from "zod";
import { oAuthProxy } from "better-auth/plugins/oauth-proxy";

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
  // --- BASE URL ---
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // --- TRUSTED ORIGINS ---
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigins = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ].filter(Boolean) as string[];

    if (!origin) return allowedOrigins;

    if (
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
       required: false, // Must be false so social login doesn't fail
        defaultValue: "STUDENT", // This is the magic line

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

  // --- GOOGLE LOGIN ---
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, token }) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        await transporter.sendMail({
          from: '"SkillBridge" <anikasyeda82@gmail.com>',
          to: user.email,
          subject: "Please verify your email!",
          html: `<p>Verify here: <a href="${verificationUrl}">Click</a></p>`,
        });
      } catch (err) {
        console.error("Email Verification Error:", err);
        throw err;
      }
    },
  },

  plugins: [oAuthProxy()],

  // --- FORCING IT TO WORK ---
  advanced: {
    cookiePrefix: "skillbridge-auth",
    useSecureCookies: true, // Required for SameSite: none
    // Apply permissive attributes to ALL cookies (including state)
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      path: "/",
    }
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    cookieOptions: {
      sameSite: "none",
      secure: true,
    }
  }
});