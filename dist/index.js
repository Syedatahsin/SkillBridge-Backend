// src/app.ts
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  tutorProfile      TutorProfile?\n  bookingsAsStudent Booking[]     @relation("StudentBookings")\n  reviews           Review[]\n\n  role   String\n  status String\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nmodel TutorProfile {\n  id     String @id @default(uuid())\n  userId String @unique\n\n  bio          String\n  experience   Int\n  pricePerHour Float\n\n  isFeatured Boolean @default(false)\n\n  user         User            @relation(fields: [userId], references: [id])\n  categories   TutorCategory[]\n  availability Availability[]\n  bookings     Booking[]\n  reviews      Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Category {\n  id          String          @id @default(uuid())\n  name        String          @unique\n  description String?\n  tutors      TutorCategory[]\n  createdAt   DateTime        @default(now())\n}\n\nmodel TutorCategory {\n  tutorId    String\n  categoryId String\n  tutor      TutorProfile @relation(fields: [tutorId], references: [id])\n  category   Category     @relation(fields: [categoryId], references: [id])\n\n  @@id([tutorId, categoryId])\n}\n\nmodel Availability {\n  id        String       @id @default(uuid())\n  tutorId   String\n  startTime DateTime\n  endTime   DateTime\n  isBooked  Boolean      @default(false)\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id])\n  booking   Booking?\n  createdAt DateTime     @default(now())\n}\n\nmodel Booking {\n  id             String        @id @default(uuid())\n  studentId      String\n  tutorId        String\n  availabilityId String        @unique\n  meetingLink    String?\n  status         BookingStatus @default(CONFIRMED)\n  student        User          @relation("StudentBookings", fields: [studentId], references: [id])\n  tutor          TutorProfile  @relation(fields: [tutorId], references: [id])\n  availability   Availability  @relation(fields: [availabilityId], references: [id])\n  review         Review?\n  createdAt      DateTime      @default(now())\n}\n\nmodel Review {\n  id        String       @id @default(uuid())\n  bookingId String       @unique\n  studentId String\n  tutorId   String\n  rating    Int\n  comment   String?\n  booking   Booking      @relation(fields: [bookingId], references: [id])\n  student   User         @relation(fields: [studentId], references: [id])\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id])\n  createdAt DateTime     @default(now())\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"bookingsAsStudent","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"pricePerHour","kind":"scalar","type":"Float"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorCategory":{"fields":[{"name":"tutorId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"booking","kind":"object","type":"Booking","relationName":"AvailabilityToBooking"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"meetingLink","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToBooking"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
import { z } from "zod";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        validator: { input: z.enum(["STUDENT", "TUTOR", "ADMIN"]) },
        input: true
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
        validator: { input: z.enum(["ACTIVE", "BANNED"]) },
        input: true
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  advanced: {
    // Crucial for Render deployments
    useSecureCookies: true
  },
  cookie: {
    // This allows the cookie to be sent from your-backend.onrender.com 
    // to your-frontend.onrender.com
    sameSite: "none",
    secure: true,
    // Must be true for HTTPS
    httpOnly: true
    // Security best practice
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        console.log(process.env.APP_USER, process.env.APP_PASS);
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
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
        <p>\xA9 2026 SKILLBRIDGE ECOSYSTEM</p>
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
        console.error(err);
        throw err;
      }
    }
  }
});

// src/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  });
}

// src/categories/categories.routes.ts
import { Router } from "express";

// src/categories/categories.service.ts
var createCategory = async (data) => {
  const category = await prisma.category.create({
    data
  });
  return category;
};
var getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      tutors: true
    }
  });
  return category;
};
var getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: {
          tutors: true
        }
      }
    }
  });
};
var updateCategory = async (id, data) => {
  const updated = await prisma.category.update({
    where: { id },
    data
  });
  return updated;
};
var deleteCategory = async (id) => {
  const deleted = await prisma.category.delete({
    where: { id }
  });
  return deleted;
};
var categoryService = {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory
};

// src/categories/categories.controller.ts
var createCategoryController = async (req, res, next) => {
  try {
    const data = req.body;
    const category = await categoryService.createCategory(data);
    res.status(201).json(category);
  } catch (e) {
    next(e);
  }
};
var getCategoryByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const category = await categoryService.getCategoryById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    next(error);
  }
};
var getAllCategoriesController = async (_req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
var updateCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const data = req.body;
    const updated = await categoryService.updateCategory(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
var deleteCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const deleted = await categoryService.deleteCategory(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};

// src/categories/categories.routes.ts
var categoryrouter = Router();
categoryrouter.get("/get", getAllCategoriesController);
categoryrouter.get("/:id", getCategoryByIdController);
categoryrouter.delete("/:id", deleteCategoryController);
categoryrouter.post("/admin/categories", createCategoryController);
categoryrouter.put("/admin/categories/:id", updateCategoryController);
var categories_routes_default = categoryrouter;

// src/lib/supportemail.ts
import { Router as Router2 } from "express";
import nodemailer2 from "nodemailer";
var emailrouter = Router2();
emailrouter.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const transporter2 = nodemailer2.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS
      }
    });
    await transporter2.sendMail({
      from: email,
      to: process.env.APP_USER,
      subject: "New Contact Message from SkillBridge",
      text: `Name: ${name}
Email: ${email}
Message: ${message}`
    });
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});
var supportemail_default = emailrouter;

// src/tutors/tutors.routes.ts
import { Router as Router3 } from "express";

// src/tutors/tutors.service.ts
var createTutorProfile = async (data) => {
  return await prisma.tutorProfile.create({
    data: {
      userId: data.userId,
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      // This is the link to the middle table
      categories: {
        create: data.categoryIds.map((id) => ({
          categoryId: id
          // This refers to the field in the TutorCategory model
        }))
      }
    }
  });
};
var getTutorProfileById = async (id) => {
  return prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      categories: { include: { category: true } },
      availability: true,
      bookings: true,
      reviews: {
        // 1st Level: Get the reviews for this tutor
        include: {
          student: true
          // 2nd Level: Get the student details for EACH review
        }
      }
    }
  });
};
var findTutorIdByUserId = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  return profile;
};
var getFeaturedTutors = async () => {
  return await prisma.tutorProfile.findMany({
    where: {
      isFeatured: true
    },
    include: {
      user: true,
      categories: {
        include: {
          category: true
        }
      },
      reviews: true
    }
  });
};
var getAllTutorProfiles = async (page, limit) => {
  const queryOptions = {
    include: {
      user: true,
      categories: { include: { category: true } },
      availability: true,
      reviews: true
    },
    orderBy: {
      createdAt: "desc"
    }
  };
  if (limit > 0) {
    queryOptions.take = limit;
    queryOptions.skip = (page - 1) * limit;
  }
  const [data, totalCount] = await Promise.all([
    prisma.tutorProfile.findMany(queryOptions),
    prisma.tutorProfile.count()
  ]);
  return {
    data,
    meta: {
      total: totalCount,
      page,
      limit,
      lastPage: limit > 0 ? Math.ceil(totalCount / limit) : 1
    }
  };
};
var updateTutorFeatureService = async (userId, isFeatured) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }
  return prisma.tutorProfile.update({
    where: { userId },
    data: {
      isFeatured
    }
  });
};
var updateTutorProfile = async (id, data) => {
  const updateData = {
    bio: data.bio,
    experience: data.experience,
    pricePerHour: data.pricePerHour
  };
  if (data.categoryIds) {
    updateData.categories = {
      deleteMany: {},
      create: data.categoryIds.map((categoryId) => ({
        category: { connect: { id: categoryId } }
      }))
    };
  }
  return prisma.tutorProfile.update({
    where: { id },
    data: updateData,
    include: {
      user: true,
      categories: { include: { category: true } },
      availability: true,
      bookings: true,
      reviews: true
    }
  });
};
var updateFeaturedStatus = async (id, isFeatured) => {
  return await prisma.tutorProfile.update({
    where: { id },
    data: {
      isFeatured
    }
  });
};
var deleteTutorProfile = async (id) => {
  return prisma.tutorProfile.delete({
    where: { id }
  });
};
var getAllsearchTutors = async ({
  search,
  categories = [],
  minPrice,
  maxPrice,
  minRating
}) => {
  const andConditions = [];
  if (search && search.trim() !== "") {
    andConditions.push({
      OR: [
        { bio: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } }
      ]
    });
  }
  if (Array.isArray(categories) && categories.length > 0) {
    andConditions.push({
      categories: {
        some: {
          category: {
            name: { in: categories }
          }
        }
      }
    });
  }
  if (typeof minPrice === "number" && !isNaN(minPrice)) {
    andConditions.push({ pricePerHour: { gte: minPrice } });
  }
  if (typeof maxPrice === "number" && !isNaN(maxPrice)) {
    andConditions.push({ pricePerHour: { lte: maxPrice } });
  }
  const tutors = await prisma.tutorProfile.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
    include: {
      user: true,
      categories: { include: { category: true } },
      reviews: true
    }
  });
  if (typeof minRating === "number" && minRating > 0) {
    return tutors.filter((tutor) => {
      const avgRating = tutor.reviews.length > 0 ? tutor.reviews.reduce((sum, r) => sum + r.rating, 0) / tutor.reviews.length : 0;
      return avgRating >= minRating;
    });
  }
  return tutors;
};
var tutorProfileService = {
  createTutorProfile,
  getTutorProfileById,
  getAllTutorProfiles,
  updateTutorProfile,
  deleteTutorProfile,
  updateTutorFeatureService,
  getAllsearchTutors,
  getFeaturedTutors,
  findTutorIdByUserId
  // Make sure this matches the name used in controller
};

// src/tutors/tutors.controller.ts
var getTutorIdHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const profile = await tutorProfileService.findTutorIdByUserId(userId);
    if (!profile) {
      return res.status(404).json({
        message: "No tutor profile found for this user. Please create a profile first."
      });
    }
    return res.status(200).json({ tutorId: profile.id });
  } catch (error) {
    next(error);
  }
};
var toggleFeaturedTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid Tutor ID string is required"
      });
    }
    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isFeatured must be a boolean"
      });
    }
    const updatedTutor = await updateFeaturedStatus(id, isFeatured);
    return res.status(200).json({
      success: true,
      message: `Tutor ${isFeatured ? "featured" : "unfeatured"} successfully`,
      data: updatedTutor
    });
  } catch (error) {
    console.error("Error in toggleFeaturedTutor:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
var createTutorProfileController = async (req, res, next) => {
  try {
    const data = req.body;
    const profile = await tutorProfileService.createTutorProfile(data);
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
};
var updateTutorFeatureController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isFeatured must be a boolean"
      });
    }
    const tutorProfile = await tutorProfileService.updateTutorFeatureService(id, isFeatured);
    return res.status(200).json({
      success: true,
      message: `Tutor ${isFeatured ? "featured" : "unfeatured"} successfully`,
      data: tutorProfile
    });
  } catch (error) {
    next(error);
  }
};
var getAllsearchTutors2 = async (req, res, next) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : void 0;
    const categoriesRaw = req.query.categories;
    const categories = categoriesRaw ? categoriesRaw.split(",").filter((c) => c.trim() !== "") : [];
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : void 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : void 0;
    const minRating = req.query.minRating ? Number(req.query.minRating) : void 0;
    const result = await tutorProfileService.getAllsearchTutors({
      search,
      categories,
      minPrice,
      maxPrice,
      minRating
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var getTutorProfileByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }
    const profile = await tutorProfileService.getTutorProfileById(id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
var getFeaturedTutorsController = async (req, res, next) => {
  try {
    const result = await tutorProfileService.getFeaturedTutors();
    return res.status(200).json(result || []);
  } catch (error) {
    next(error);
  }
};
var getAllTutorsController = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 0;
    const result = await tutorProfileService.getAllTutorProfiles(page, limit);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};
var updateTutorProfileController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }
    const data = req.body;
    const updated = await tutorProfileService.updateTutorProfile(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
var deleteTutorProfileController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }
    const deleted = await tutorProfileService.deleteTutorProfile(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};

// src/tutors/tutors.routes.ts
var router = Router3();
router.post("/", createTutorProfileController);
router.get("/alltutor", getAllTutorsController);
router.put("/:id", updateTutorProfileController);
router.delete("/:id", deleteTutorProfileController);
router.patch(
  "admin/users/:id",
  updateTutorFeatureController
);
router.get("/public/getSEARCHtutors", getAllsearchTutors2);
router.get("/public/featured", getFeaturedTutorsController);
router.patch("/feature/:id", toggleFeaturedTutor);
router.get("/tutorid/:userId", getTutorIdHandler);
router.get("/public/:id", getTutorProfileByIdController);
router.post("/teacher/createprofile", createTutorProfileController);
router.patch("/update/:id", updateTutorProfileController);
var tutors_routes_default = router;

// src/availability/availability.routes.ts
import { Router as Router4 } from "express";

// src/availability/availability.service.ts
var createAvailability = async (data) => {
  const cleanId = data.tutorId.trim();
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  const overlap = await prisma.availability.findFirst({
    where: {
      tutorId: cleanId,
      OR: [
        {
          // New slot starts during an existing slot
          startTime: { lte: start },
          endTime: { gt: start }
        },
        {
          // New slot ends during an existing slot
          startTime: { lt: end },
          endTime: { gte: end }
        },
        {
          // New slot completely wraps around an existing slot
          startTime: { gte: start },
          endTime: { lte: end }
        }
      ]
    }
  });
  if (overlap) {
    throw new Error("This time slot overlaps with an existing availability.");
  }
  return await prisma.availability.create({
    data: {
      startTime: start,
      endTime: end,
      isBooked: false,
      tutor: {
        connect: { id: cleanId }
      }
    }
  });
};
var getAvailabilityById = async (id) => {
  return prisma.availability.findUnique({
    where: { id },
    include: { tutor: true, booking: true }
  });
};
var getAllAvailabilities = async () => {
  return prisma.availability.findMany({
    include: { tutor: true, booking: true }
  });
};
var updateAvailability = async (id, data) => {
  return prisma.availability.update({
    where: { id },
    data
  });
};
var deleteAvailability = async (id) => {
  return prisma.availability.delete({
    where: { id }
  });
};
var availabilityService = {
  createAvailability,
  getAvailabilityById,
  getAllAvailabilities,
  updateAvailability,
  deleteAvailability
};

// src/availability/availability.controller.ts
var createAvailabilityController = async (req, res, next) => {
  try {
    const data = req.body;
    const availability = await availabilityService.createAvailability(data);
    res.status(201).json(availability);
  } catch (error) {
    next(error);
  }
};
var getAvailabilityByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const availability = await availabilityService.getAvailabilityById(id);
    if (!availability) return res.status(404).json({ message: "Availability not found" });
    res.json(availability);
  } catch (error) {
    next(error);
  }
};
var getAllAvailabilitiesController = async (_req, res, next) => {
  try {
    const availabilities = await availabilityService.getAllAvailabilities();
    res.json(availabilities);
  } catch (error) {
    next(error);
  }
};
var updateAvailabilityController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const data = req.body;
    const updated = await availabilityService.updateAvailability(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
var deleteAvailabilityController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const deleted = await availabilityService.deleteAvailability(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};

// src/availability/availability.routes.ts
var availabilityrouter = Router4();
availabilityrouter.get("/", getAllAvailabilitiesController);
availabilityrouter.get("/:id", getAvailabilityByIdController);
availabilityrouter.put("/:id", updateAvailabilityController);
availabilityrouter.delete("/:id", deleteAvailabilityController);
availabilityrouter.post("/create", createAvailabilityController);
var availability_routes_default = availabilityrouter;

// src/bookings/bookings.routes.ts
import { Router as Router5 } from "express";

// src/bookings/bookings.service.ts
var studentBookingService = {
  // Logic to get the student's classes + Teacher's User Name
  async fetchStudentSchedule(studentUserId) {
    return await prisma.booking.findMany({
      where: {
        studentId: studentUserId
      },
      include: {
        availability: true,
        // For dates and times
        tutor: {
          include: {
            user: {
              select: {
                name: true,
                // This allows {session.tutor?.user?.name} in your UI
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  },
  // Logic to change status to CANCELLED
  async cancelBooking(bookingId) {
    return await prisma.booking.update({
      where: {
        id: bookingId
      },
      data: {
        status: "CANCELLED"
      }
    });
  }
};
var createBookingService = async (studentId, tutorId, availabilityId, meetingLink) => {
  const updatedSlot = await prisma.availability.updateMany({
    where: {
      id: availabilityId,
      isBooked: false
      // only update if not already booked
    },
    data: {
      isBooked: true
    }
  });
  if (updatedSlot.count === 0) {
    throw new Error("This slot has already been taken.");
  }
  const newBooking = await prisma.booking.create({
    data: {
      studentId,
      tutorId,
      availabilityId,
      meetingLink: meetingLink || null,
      status: "CONFIRMED"
    }
  });
  return newBooking;
};
var BookingService = {
  /**
   * Fetches all bookings for a teacher.
   * Handles both the User ID (auth) or the TutorProfile ID.
   */
  async getTeacherBookings(identifier) {
    const profile = await prisma.tutorProfile.findFirst({
      where: {
        OR: [
          { id: identifier },
          // e.g., "a26404ee-..."
          { userId: identifier }
          // e.g., "apWRppI6..."
        ]
      }
    });
    if (!profile) {
      console.log(`[Service] No TutorProfile found for: ${identifier}`);
      return [];
    }
    console.log(`[Service] Fetching bookings for TutorProfile: ${profile.id}`);
    return await prisma.booking.findMany({
      where: {
        tutorId: profile.id
      },
      include: {
        // Direct relation to User model in your schema
        student: {
          select: {
            name: true,
            image: true,
            email: true
          }
        },
        // Link to the specific time slot
        availability: {
          select: {
            startTime: true,
            endTime: true
          }
        }
      },
      orderBy: {
        availability: {
          startTime: "asc"
        }
      }
    });
  },
  /**
   * Updates a specific booking status to COMPLETED
   */
  async markAsCompleted(bookingId) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) {
      throw new Error("Booking record not found in database");
    }
    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED"
        // Must match your Enum exactly
      }
    });
  }
  /**
   * Optional: Cancel a booking and release the availability slot
   */
};
var getBookingById = async (id) => {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      student: true,
      tutor: true,
      availability: true,
      review: true
    }
  });
};
var getAllBookings = async (page, limit) => {
  const queryOptions = {
    include: {
      student: {
        select: { name: true, image: true, email: true }
      },
      tutor: {
        include: { user: { select: { name: true } } }
      },
      availability: true,
      review: true
    },
    orderBy: {
      createdAt: "desc"
    }
  };
  if (limit > 0) {
    queryOptions.take = limit;
    queryOptions.skip = (page - 1) * limit;
  }
  const [data, totalCount] = await Promise.all([
    prisma.booking.findMany(queryOptions),
    prisma.booking.count()
  ]);
  return {
    data,
    meta: {
      total: totalCount,
      page,
      limit,
      lastPage: limit > 0 ? Math.ceil(totalCount / limit) : 1
    }
  };
};
var updateBooking = async (id, data) => {
  const updated = await prisma.booking.update({
    where: { id },
    data,
    include: {
      student: true,
      tutor: true,
      availability: true,
      review: true
    }
  });
  return updated;
};
var deleteBooking = async (id) => {
  return prisma.booking.delete({
    where: { id }
  });
};
var bookingService = {
  createBookingService,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking
};

// src/bookings/bookings.controller.ts
var studentBookingController = {
  // GET: Fetch sessions where the logged-in user is the student
  async getStudentBookings(req, res, next) {
    try {
      const { userId } = req.query;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "Valid Student User ID is required" });
      }
      const bookings = await studentBookingService.fetchStudentSchedule(userId);
      return res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },
  // PATCH: Cancel a booking
  async cancelByStudent(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Booking ID is required" });
      }
      const cancelledBooking = await studentBookingService.cancelBooking(id);
      return res.status(200).json({
        success: true,
        message: "Booking has been cancelled",
        data: cancelledBooking
      });
    } catch (error) {
      next(error);
    }
  }
};
var BookingController = {
  async getMyBookings(req, res, next) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const bookings = await BookingService.getTeacherBookings(String(userId));
      return res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },
  async completeBooking(req, res, next) {
    try {
      const { id } = req.params;
      const result = await BookingService.markAsCompleted(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
var createBookingController = async (req, res, next) => {
  try {
    const { studentId, tutorId, availabilityId, meetingLink } = req.body;
    if (!studentId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in."
      });
    }
    const booking = await bookingService.createBookingService(
      studentId,
      tutorId,
      availabilityId,
      meetingLink
    );
    return res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
var getBookingByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const booking = await bookingService.getBookingById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};
var getAllBookingsController = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 0;
    const page = Number(req.query.page) || 1;
    const result = await bookingService.getAllBookings(page, limit);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};
var updateBookingController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const data = req.body;
    const updated = await bookingService.updateBooking(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
var deleteBookingController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const deleted = await bookingService.deleteBooking(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};

// src/bookings/bookings.routes.ts
var bookingrouter = Router5();
bookingrouter.get("/bookings", getAllBookingsController);
bookingrouter.get("/tutorbookings", BookingController.getMyBookings);
bookingrouter.get("/studentbookings", studentBookingController.getStudentBookings);
bookingrouter.patch("/tutorbookings/complete/:id", BookingController.completeBooking);
bookingrouter.patch("/studentbookings/cancel/:id", studentBookingController.cancelByStudent);
bookingrouter.post("/", createBookingController);
bookingrouter.get("/:id", getBookingByIdController);
bookingrouter.put("/:id", updateBookingController);
bookingrouter.delete("/:id", deleteBookingController);
var bookings_routes_default = bookingrouter;

// src/reviews/reviews.routes.ts
import { Router as Router6 } from "express";

// src/reviews/reviews.service.ts
var createReview = async (data) => {
  const review = await prisma.review.create({
    data
  });
  return review;
};
var getReviewById = async (id) => {
  return prisma.review.findUnique({
    where: { id },
    include: {
      student: true,
      tutor: true,
      booking: true
    }
  });
};
var ReviewServicee = {
  async getTutorReviewStats(tutorId) {
    const stats = await prisma.review.aggregate({
      where: { tutorId },
      _avg: { rating: true },
      _count: { id: true }
    });
    const latestReviews = await prisma.review.findMany({
      where: { tutorId },
      take: 2,
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: { name: true, image: true }
        }
      }
    });
    return {
      averageRating: stats._avg.rating?.toFixed(1) || "0.0",
      totalReviews: stats._count.id,
      latestReviews
    };
  }
};
var getAllReviews = async () => {
  return prisma.review.findMany({
    include: {
      student: true,
      tutor: true,
      booking: true
    }
  });
};
var updateReview = async (id, data) => {
  return prisma.review.update({
    where: { id },
    data
  });
};
var deleteReview = async (id) => {
  return prisma.review.delete({
    where: { id }
  });
};
var reviewService = {
  createReview,
  getReviewById,
  getAllReviews,
  updateReview,
  deleteReview
};

// src/reviews/reviews.controller.ts
var getReviewStats = async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    const data = await ReviewServicee.getTutorReviewStats(tutorId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
var createReviewController = async (req, res, next) => {
  try {
    const data = req.body;
    const review = await reviewService.createReview(data);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};
var getReviewByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const review = await reviewService.getReviewById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    next(error);
  }
};
var getAllReviewsController = async (_req, res, next) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
var updateReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const data = req.body;
    const updated = await reviewService.updateReview(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
var deleteReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const deleted = await reviewService.deleteReview(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};

// src/reviews/reviews.routes.ts
var router2 = Router6();
router2.get("/", getAllReviewsController);
router2.post("/", createReviewController);
router2.get("/:id", getReviewByIdController);
router2.put("/:id", updateReviewController);
router2.delete("/:id", deleteReviewController);
router2.get("/:id", getReviewByIdController);
router2.get("/stats/:tutorId", getReviewStats);
var reviews_routes_default = router2;

// src/users/users.routes.ts
import { Router as Router7 } from "express";

// src/users/users.service.ts
var updateUserBanStatus = async (userId, isBanned) => {
  const newStatus = isBanned ? "BANNED" : "ACTIVE";
  return await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: newStatus
    }
  });
};
var createUser = async (data) => {
  const result = await prisma.user.create({
    data
  });
  return result;
};
var getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      sessions: true,
      accounts: true,
      tutorProfile: true,
      bookingsAsStudent: true,
      reviews: true
    }
  });
  return user;
};
var getAllUsers = async (page, limit) => {
  const queryOptions = {
    include: {
      sessions: true,
      accounts: true,
      tutorProfile: true,
      bookingsAsStudent: true,
      reviews: true
    },
    orderBy: {
      createdAt: "desc"
    }
  };
  if (limit > 0) {
    queryOptions.take = limit;
    queryOptions.skip = (page - 1) * limit;
  }
  const [data, totalCount] = await Promise.all([
    prisma.user.findMany(queryOptions),
    prisma.user.count()
  ]);
  return {
    data,
    meta: {
      total: totalCount,
      limit,
      // Since you only pass limit, lastPage helps UI know if there's more
      lastPage: limit > 0 ? Math.ceil(totalCount / limit) : 1
    }
  };
};
var updateUser = async (id, data) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data
  });
  return updatedUser;
};
var deleteUser = async (id) => {
  const deletedUser = await prisma.user.delete({
    where: { id }
  });
  return deletedUser;
};
var userService = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserBanStatus
};

// src/users/users.controller.ts
var toggleTutorBanStatus = async (req, res, next) => {
  try {
    const targetId = req.body.id || req.body.userId;
    const { status } = req.body;
    if (!targetId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const isBanned = status === "BANNED";
    const updatedUser = await userService.updateUserBanStatus(targetId, isBanned);
    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
var getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
var updateUser2 = async (req, res, next) => {
  const id = req.params.id;
  const { name } = req.body;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid User ID provided" });
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name }
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
var getAllUsersController = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 0;
    const result = await userService.getAllUsers(1, limit);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};
var updateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const updatedUser = await userService.updateUser(id, data);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// src/users/users.routes.ts
var userrouter = Router7();
userrouter.get("/", getAllUsersController);
userrouter.post("/update-status", toggleTutorBanStatus);
userrouter.patch("/update/:id", updateUser2);
userrouter.get("/:id", getUserByIdController);
userrouter.patch("/:id", updateUserController);
var users_routes_default = userrouter;

// src/app.ts
dotenv.config();
var app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/categories", categories_routes_default);
app.use("/api/tutor", tutors_routes_default);
app.use("/api/support", supportemail_default);
app.use("/api/availability", availability_routes_default);
app.use("/api/bookings", bookings_routes_default);
app.use("/api/reviews", reviews_routes_default);
app.use("/api/users", users_routes_default);
app.use(notFound);
var app_default = app;

// src/index.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app_default.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
