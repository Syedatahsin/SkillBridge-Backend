var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import cors from "cors";
import express3 from "express";
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
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id                String        @id\n  name              String\n  email             String        @unique\n  emailVerified     Boolean       @default(false)\n  image             String?\n  createdAt         DateTime      @default(now())\n  updatedAt         DateTime      @updatedAt\n  role              String        @default("STUDENT") // Added default\n  status            String        @default("ACTIVE") // Added default\n  bookingsAsStudent Booking[]     @relation("StudentBookings")\n  reviews           Review[]\n  tutorProfile      TutorProfile?\n  accounts          Account[]\n  sessions          Session[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel TutorProfile {\n  id                String   @id @default(uuid())\n  userId            String   @unique\n  bio               String\n  experience        Int\n  pricePerHour      Float\n  isFeatured        Boolean  @default(false)\n  createdAt         DateTime @default(now())\n  updatedAt         DateTime @updatedAt\n  bankAccountNumber String? // Added as optional to avoid migration errors\n\n  availability Availability[]\n  bookings     Booking[]\n  reviews      Review[]\n  categories   TutorCategory[]\n  user         User            @relation(fields: [userId], references: [id])\n}\n\nmodel Category {\n  id          String          @id @default(uuid())\n  name        String          @unique\n  description String?\n  createdAt   DateTime        @default(now())\n  tutors      TutorCategory[]\n}\n\nmodel TutorCategory {\n  tutorId    String\n  categoryId String\n  category   Category     @relation(fields: [categoryId], references: [id])\n  tutor      TutorProfile @relation(fields: [tutorId], references: [id])\n\n  @@id([tutorId, categoryId])\n}\n\nmodel Availability {\n  id        String       @id @default(uuid())\n  tutorId   String\n  startTime DateTime\n  endTime   DateTime\n  isBooked  Boolean      @default(false)\n  createdAt DateTime     @default(now())\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id])\n  booking   Booking?\n}\n\nmodel Booking {\n  id              String           @id @default(uuid())\n  studentId       String\n  tutorId         String\n  availabilityId  String           @unique\n  meetingLink     String?\n  status          BookingStatus    @default(PENDING)\n  createdAt       DateTime         @default(now())\n  availability    Availability     @relation(fields: [availabilityId], references: [id])\n  student         User             @relation("StudentBookings", fields: [studentId], references: [id])\n  tutor           TutorProfile     @relation(fields: [tutorId], references: [id])\n  payment         Payment?\n  review          Review?\n  sessionResource SessionResource?\n}\n\nmodel SessionResource {\n  id             String   @id @default(uuid())\n  bookingId      String   @unique\n  transcriptText String   @db.Text\n  quizData       Json?\n  updatedAt      DateTime @updatedAt\n  booking        Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n}\n\nmodel Payment {\n  id              String   @id @default(uuid())\n  bookingId       String   @unique\n  stripeSessionId String   @unique\n  amount          Float\n  status          String\n  createdAt       DateTime @default(now())\n  updatedAt       DateTime @updatedAt\n  booking         Booking  @relation(fields: [bookingId], references: [id])\n}\n\nmodel Review {\n  id        String       @id @default(uuid())\n  bookingId String       @unique\n  studentId String\n  tutorId   String\n  rating    Int\n  comment   String?\n  createdAt DateTime     @default(now())\n  booking   Booking      @relation(fields: [bookingId], references: [id])\n  student   User         @relation(fields: [studentId], references: [id])\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id])\n}\n\nenum BookingStatus {\n  PENDING\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"bookingsAsStudent","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"pricePerHour","kind":"scalar","type":"Float"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bankAccountNumber","kind":"scalar","type":"String"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"}],"dbName":null},"TutorCategory":{"fields":[{"name":"tutorId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"booking","kind":"object","type":"Booking","relationName":"AvailabilityToBooking"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"meetingLink","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToBooking"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"sessionResource","kind":"object","type":"SessionResource","relationName":"BookingToSessionResource"}],"dbName":null},"SessionResource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"transcriptText","kind":"scalar","type":"String"},{"name":"quizData","kind":"scalar","type":"Json"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToSessionResource"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","availability","bookings","booking","student","tutor","reviews","tutors","_count","category","categories","user","payment","review","sessionResource","bookingsAsStudent","tutorProfile","accounts","sessions","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","TutorProfile.findUnique","TutorProfile.findUniqueOrThrow","TutorProfile.findFirst","TutorProfile.findFirstOrThrow","TutorProfile.findMany","TutorProfile.createOne","TutorProfile.createMany","TutorProfile.createManyAndReturn","TutorProfile.updateOne","TutorProfile.updateMany","TutorProfile.updateManyAndReturn","TutorProfile.upsertOne","TutorProfile.deleteOne","TutorProfile.deleteMany","_avg","_sum","TutorProfile.groupBy","TutorProfile.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","TutorCategory.findUnique","TutorCategory.findUniqueOrThrow","TutorCategory.findFirst","TutorCategory.findFirstOrThrow","TutorCategory.findMany","TutorCategory.createOne","TutorCategory.createMany","TutorCategory.createManyAndReturn","TutorCategory.updateOne","TutorCategory.updateMany","TutorCategory.updateManyAndReturn","TutorCategory.upsertOne","TutorCategory.deleteOne","TutorCategory.deleteMany","TutorCategory.groupBy","TutorCategory.aggregate","Availability.findUnique","Availability.findUniqueOrThrow","Availability.findFirst","Availability.findFirstOrThrow","Availability.findMany","Availability.createOne","Availability.createMany","Availability.createManyAndReturn","Availability.updateOne","Availability.updateMany","Availability.updateManyAndReturn","Availability.upsertOne","Availability.deleteOne","Availability.deleteMany","Availability.groupBy","Availability.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","SessionResource.findUnique","SessionResource.findUniqueOrThrow","SessionResource.findFirst","SessionResource.findFirstOrThrow","SessionResource.findMany","SessionResource.createOne","SessionResource.createMany","SessionResource.createManyAndReturn","SessionResource.updateOne","SessionResource.updateMany","SessionResource.updateManyAndReturn","SessionResource.upsertOne","SessionResource.deleteOne","SessionResource.deleteMany","SessionResource.groupBy","SessionResource.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","bookingId","studentId","tutorId","rating","comment","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","stripeSessionId","amount","status","updatedAt","transcriptText","quizData","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","availabilityId","meetingLink","BookingStatus","startTime","endTime","isBooked","categoryId","name","description","every","some","none","userId","bio","experience","pricePerHour","isFeatured","bankAccountNumber","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","tutorId_categoryId","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "1AVqwAERCAAA8wIAIBEAAPICACASAAD-AgAgEwAA_wIAIBQAAIADACDdAQAA_QIAMN4BAAAwABDfAQAA_QIAMOABAQAAAAHmAUAA2QIAIfQBAQDYAgAh9QFAANkCACGFAgEA2AIAIZ8CAQAAAAGgAiAA8AIAIaECAQDrAgAhogIBANgCACEBAAAAAQAgEAMAAI0DACAGAAD0AgAgBwAAhwMAIA4AAI4DACAPAACPAwAgEAAAkAMAIN0BAACLAwAw3gEAAAMAEN8BAACLAwAw4AEBANgCACHiAQEA2AIAIeMBAQDYAgAh5gFAANkCACH0AQAAjAOBAiL-AQEA2AIAIf8BAQDrAgAhBwMAAIIFACAGAACzBAAgBwAA_gQAIA4AAIMFACAPAACEBQAgEAAAhQUAIP8BAACRAwAgEAMAAI0DACAGAAD0AgAgBwAAhwMAIA4AAI4DACAPAACPAwAgEAAAkAMAIN0BAACLAwAw3gEAAAMAEN8BAACLAwAw4AEBAAAAAeIBAQDYAgAh4wEBANgCACHmAUAA2QIAIfQBAACMA4ECIv4BAQAAAAH_AQEA6wIAIQMAAAADACABAAAEADACAAAFACALBQAAigMAIAcAAIcDACDdAQAAiQMAMN4BAAAHABDfAQAAiQMAMOABAQDYAgAh4wEBANgCACHmAUAA2QIAIYECQADZAgAhggJAANkCACGDAiAA8AIAIQIFAACpAwAgBwAA_gQAIAsFAACKAwAgBwAAhwMAIN0BAACJAwAw3gEAAAcAEN8BAACJAwAw4AEBAAAAAeMBAQDYAgAh5gFAANkCACGBAkAA2QIAIYICQADZAgAhgwIgAPACACEDAAAABwAgAQAACAAwAgAACQAgAwAAAAMAIAEAAAQAMAIAAAUAIA0FAADaAgAgBgAA9AIAIAcAAIcDACDdAQAAiAMAMN4BAAAMABDfAQAAiAMAMOABAQDYAgAh4QEBANgCACHiAQEA2AIAIeMBAQDYAgAh5AECAO8CACHlAQEA6wIAIeYBQADZAgAhBAUAAKkDACAGAACzBAAgBwAA_gQAIOUBAACRAwAgDQUAANoCACAGAAD0AgAgBwAAhwMAIN0BAACIAwAw3gEAAAwAEN8BAACIAwAw4AEBAAAAAeEBAQAAAAHiAQEA2AIAIeMBAQDYAgAh5AECAO8CACHlAQEA6wIAIeYBQADZAgAhAwAAAAwAIAEAAA0AMAIAAA4AIAcHAACHAwAgCwAAhgMAIN0BAACFAwAw3gEAABAAEN8BAACFAwAw4wEBANgCACGEAgEA2AIAIQIHAAD-BAAgCwAAgQUAIAgHAACHAwAgCwAAhgMAIN0BAACFAwAw3gEAABAAEN8BAACFAwAw4wEBANgCACGEAgEA2AIAIaMCAACEAwAgAwAAABAAIAEAABEAMAIAABIAIAMAAAAQACABAAARADACAAASACABAAAAEAAgAQAAAAcAIAEAAAADACABAAAADAAgAQAAABAAIAEAAAADACALBQAA2gIAIN0BAADWAgAw3gEAABsAEN8BAADWAgAw4AEBANgCACHhAQEA2AIAIeYBQADZAgAh8gEBANgCACHzAQgA1wIAIfQBAQDYAgAh9QFAANkCACEBAAAAGwAgAQAAAAwAIAkFAADaAgAg3QEAAN4CADDeAQAAHgAQ3wEAAN4CADDgAQEA2AIAIeEBAQDYAgAh9QFAANkCACH2AQEA2AIAIfcBAADfAgAgAQAAAB4AIAMAAAAMACABAAANADACAAAOACARAwAA8QIAIAQAAPICACAIAADzAgAgDAAA7AIAIA0AAPQCACDdAQAA7gIAMN4BAAAhABDfAQAA7gIAMOABAQDYAgAh5gFAANkCACH1AUAA2QIAIYoCAQDYAgAhiwIBANgCACGMAgIA7wIAIY0CCADXAgAhjgIgAPACACGPAgEA6wIAIQEAAAAhACARDQAA9AIAIN0BAACCAwAw3gEAACMAEN8BAACCAwAw4AEBANgCACHmAUAA2QIAIfUBQADZAgAhigIBANgCACGTAgEA2AIAIZQCAQDYAgAhlQIBAOsCACGWAgEA6wIAIZcCAQDrAgAhmAJAAIMDACGZAkAAgwMAIZoCAQDrAgAhmwIBAOsCACEIDQAAswQAIJUCAACRAwAglgIAAJEDACCXAgAAkQMAIJgCAACRAwAgmQIAAJEDACCaAgAAkQMAIJsCAACRAwAgEQ0AAPQCACDdAQAAggMAMN4BAAAjABDfAQAAggMAMOABAQAAAAHmAUAA2QIAIfUBQADZAgAhigIBANgCACGTAgEA2AIAIZQCAQDYAgAhlQIBAOsCACGWAgEA6wIAIZcCAQDrAgAhmAJAAIMDACGZAkAAgwMAIZoCAQDrAgAhmwIBAOsCACEDAAAAIwAgAQAAJAAwAgAAJQAgDA0AAPQCACDdAQAAgQMAMN4BAAAnABDfAQAAgQMAMOABAQDYAgAh5gFAANkCACH1AUAA2QIAIYoCAQDYAgAhkgJAANkCACGcAgEA2AIAIZ0CAQDrAgAhngIBAOsCACEDDQAAswQAIJ0CAACRAwAgngIAAJEDACAMDQAA9AIAIN0BAACBAwAw3gEAACcAEN8BAACBAwAw4AEBAAAAAeYBQADZAgAh9QFAANkCACGKAgEA2AIAIZICQADZAgAhnAIBAAAAAZ0CAQDrAgAhngIBAOsCACEDAAAAJwAgAQAAKAAwAgAAKQAgAQAAAAMAIAEAAAAMACABAAAAIwAgAQAAACcAIAEAAAABACARCAAA8wIAIBEAAPICACASAAD-AgAgEwAA_wIAIBQAAIADACDdAQAA_QIAMN4BAAAwABDfAQAA_QIAMOABAQDYAgAh5gFAANkCACH0AQEA2AIAIfUBQADZAgAhhQIBANgCACGfAgEA2AIAIaACIADwAgAhoQIBAOsCACGiAgEA2AIAIQYIAACyBAAgEQAAsQQAIBIAAP4EACATAAD_BAAgFAAAgAUAIKECAACRAwAgAwAAADAAIAEAADEAMAIAAAEAIAMAAAAwACABAAAxADACAAABACADAAAAMAAgAQAAMQAwAgAAAQAgDggAAPoEACARAAD5BAAgEgAA-wQAIBMAAPwEACAUAAD9BAAg4AEBAAAAAeYBQAAAAAH0AQEAAAAB9QFAAAAAAYUCAQAAAAGfAgEAAAABoAIgAAAAAaECAQAAAAGiAgEAAAABARoAADUAIAngAQEAAAAB5gFAAAAAAfQBAQAAAAH1AUAAAAABhQIBAAAAAZ8CAQAAAAGgAiAAAAABoQIBAAAAAaICAQAAAAEBGgAANwAwARoAADcAMA4IAADGBAAgEQAAxQQAIBIAAMcEACATAADIBAAgFAAAyQQAIOABAQCXAwAh5gFAAJoDACH0AQEAlwMAIfUBQACaAwAhhQIBAJcDACGfAgEAlwMAIaACIADRAwAhoQIBAJkDACGiAgEAlwMAIQIAAAABACAaAAA6ACAJ4AEBAJcDACHmAUAAmgMAIfQBAQCXAwAh9QFAAJoDACGFAgEAlwMAIZ8CAQCXAwAhoAIgANEDACGhAgEAmQMAIaICAQCXAwAhAgAAADAAIBoAADwAIAIAAAAwACAaAAA8ACADAAAAAQAgIQAANQAgIgAAOgAgAQAAAAEAIAEAAAAwACAECgAAwgQAICcAAMQEACAoAADDBAAgoQIAAJEDACAM3QEAAPwCADDeAQAAQwAQ3wEAAPwCADDgAQEAxQIAIeYBQADIAgAh9AEBAMUCACH1AUAAyAIAIYUCAQDFAgAhnwIBAMUCACGgAiAA5QIAIaECAQDHAgAhogIBAMUCACEDAAAAMAAgAQAAQgAwJgAAQwAgAwAAADAAIAEAADEAMAIAAAEAIAEAAAApACABAAAAKQAgAwAAACcAIAEAACgAMAIAACkAIAMAAAAnACABAAAoADACAAApACADAAAAJwAgAQAAKAAwAgAAKQAgCQ0AAMEEACDgAQEAAAAB5gFAAAAAAfUBQAAAAAGKAgEAAAABkgJAAAAAAZwCAQAAAAGdAgEAAAABngIBAAAAAQEaAABLACAI4AEBAAAAAeYBQAAAAAH1AUAAAAABigIBAAAAAZICQAAAAAGcAgEAAAABnQIBAAAAAZ4CAQAAAAEBGgAATQAwARoAAE0AMAkNAADABAAg4AEBAJcDACHmAUAAmgMAIfUBQACaAwAhigIBAJcDACGSAkAAmgMAIZwCAQCXAwAhnQIBAJkDACGeAgEAmQMAIQIAAAApACAaAABQACAI4AEBAJcDACHmAUAAmgMAIfUBQACaAwAhigIBAJcDACGSAkAAmgMAIZwCAQCXAwAhnQIBAJkDACGeAgEAmQMAIQIAAAAnACAaAABSACACAAAAJwAgGgAAUgAgAwAAACkAICEAAEsAICIAAFAAIAEAAAApACABAAAAJwAgBQoAAL0EACAnAAC_BAAgKAAAvgQAIJ0CAACRAwAgngIAAJEDACAL3QEAAPsCADDeAQAAWQAQ3wEAAPsCADDgAQEAxQIAIeYBQADIAgAh9QFAAMgCACGKAgEAxQIAIZICQADIAgAhnAIBAMUCACGdAgEAxwIAIZ4CAQDHAgAhAwAAACcAIAEAAFgAMCYAAFkAIAMAAAAnACABAAAoADACAAApACABAAAAJQAgAQAAACUAIAMAAAAjACABAAAkADACAAAlACADAAAAIwAgAQAAJAAwAgAAJQAgAwAAACMAIAEAACQAMAIAACUAIA4NAAC8BAAg4AEBAAAAAeYBQAAAAAH1AUAAAAABigIBAAAAAZMCAQAAAAGUAgEAAAABlQIBAAAAAZYCAQAAAAGXAgEAAAABmAJAAAAAAZkCQAAAAAGaAgEAAAABmwIBAAAAAQEaAABhACAN4AEBAAAAAeYBQAAAAAH1AUAAAAABigIBAAAAAZMCAQAAAAGUAgEAAAABlQIBAAAAAZYCAQAAAAGXAgEAAAABmAJAAAAAAZkCQAAAAAGaAgEAAAABmwIBAAAAAQEaAABjADABGgAAYwAwDg0AALsEACDgAQEAlwMAIeYBQACaAwAh9QFAAJoDACGKAgEAlwMAIZMCAQCXAwAhlAIBAJcDACGVAgEAmQMAIZYCAQCZAwAhlwIBAJkDACGYAkAAugQAIZkCQAC6BAAhmgIBAJkDACGbAgEAmQMAIQIAAAAlACAaAABmACAN4AEBAJcDACHmAUAAmgMAIfUBQACaAwAhigIBAJcDACGTAgEAlwMAIZQCAQCXAwAhlQIBAJkDACGWAgEAmQMAIZcCAQCZAwAhmAJAALoEACGZAkAAugQAIZoCAQCZAwAhmwIBAJkDACECAAAAIwAgGgAAaAAgAgAAACMAIBoAAGgAIAMAAAAlACAhAABhACAiAABmACABAAAAJQAgAQAAACMAIAoKAAC3BAAgJwAAuQQAICgAALgEACCVAgAAkQMAIJYCAACRAwAglwIAAJEDACCYAgAAkQMAIJkCAACRAwAgmgIAAJEDACCbAgAAkQMAIBDdAQAA9wIAMN4BAABvABDfAQAA9wIAMOABAQDFAgAh5gFAAMgCACH1AUAAyAIAIYoCAQDFAgAhkwIBAMUCACGUAgEAxQIAIZUCAQDHAgAhlgIBAMcCACGXAgEAxwIAIZgCQAD4AgAhmQJAAPgCACGaAgEAxwIAIZsCAQDHAgAhAwAAACMAIAEAAG4AMCYAAG8AIAMAAAAjACABAAAkADACAAAlACAJ3QEAAPYCADDeAQAAdQAQ3wEAAPYCADDgAQEAAAAB5gFAANkCACH1AUAA2QIAIZACAQDYAgAhkQIBANgCACGSAkAA2QIAIQEAAAByACABAAAAcgAgCd0BAAD2AgAw3gEAAHUAEN8BAAD2AgAw4AEBANgCACHmAUAA2QIAIfUBQADZAgAhkAIBANgCACGRAgEA2AIAIZICQADZAgAhAAMAAAB1ACABAAB2ADACAAByACADAAAAdQAgAQAAdgAwAgAAcgAgAwAAAHUAIAEAAHYAMAIAAHIAIAbgAQEAAAAB5gFAAAAAAfUBQAAAAAGQAgEAAAABkQIBAAAAAZICQAAAAAEBGgAAegAgBuABAQAAAAHmAUAAAAAB9QFAAAAAAZACAQAAAAGRAgEAAAABkgJAAAAAAQEaAAB8ADABGgAAfAAwBuABAQCXAwAh5gFAAJoDACH1AUAAmgMAIZACAQCXAwAhkQIBAJcDACGSAkAAmgMAIQIAAAByACAaAAB_ACAG4AEBAJcDACHmAUAAmgMAIfUBQACaAwAhkAIBAJcDACGRAgEAlwMAIZICQACaAwAhAgAAAHUAIBoAAIEBACACAAAAdQAgGgAAgQEAIAMAAAByACAhAAB6ACAiAAB_ACABAAAAcgAgAQAAAHUAIAMKAAC0BAAgJwAAtgQAICgAALUEACAJ3QEAAPUCADDeAQAAiAEAEN8BAAD1AgAw4AEBAMUCACHmAUAAyAIAIfUBQADIAgAhkAIBAMUCACGRAgEAxQIAIZICQADIAgAhAwAAAHUAIAEAAIcBADAmAACIAQAgAwAAAHUAIAEAAHYAMAIAAHIAIBEDAADxAgAgBAAA8gIAIAgAAPMCACAMAADsAgAgDQAA9AIAIN0BAADuAgAw3gEAACEAEN8BAADuAgAw4AEBAAAAAeYBQADZAgAh9QFAANkCACGKAgEAAAABiwIBANgCACGMAgIA7wIAIY0CCADXAgAhjgIgAPACACGPAgEA6wIAIQEAAACLAQAgAQAAAIsBACAGAwAAsAQAIAQAALEEACAIAACyBAAgDAAA8wMAIA0AALMEACCPAgAAkQMAIAMAAAAhACABAACOAQAwAgAAiwEAIAMAAAAhACABAACOAQAwAgAAiwEAIAMAAAAhACABAACOAQAwAgAAiwEAIA4DAACrBAAgBAAArAQAIAgAAK0EACAMAACuBAAgDQAArwQAIOABAQAAAAHmAUAAAAAB9QFAAAAAAYoCAQAAAAGLAgEAAAABjAICAAAAAY0CCAAAAAGOAiAAAAABjwIBAAAAAQEaAACSAQAgCeABAQAAAAHmAUAAAAAB9QFAAAAAAYoCAQAAAAGLAgEAAAABjAICAAAAAY0CCAAAAAGOAiAAAAABjwIBAAAAAQEaAACUAQAwARoAAJQBADAOAwAA-QMAIAQAAPoDACAIAAD7AwAgDAAA_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_gEBAAAAAf8BAQAAAAEBGgAA7QEAIAfgAQEAAAAB4gEBAAAAAeMBAQAAAAHmAUAAAAAB9AEAAACBAgL-AQEAAAAB_wEBAAAAAQEaAADvAQAwARoAAO8BADANAwAAswMAIAYAALQDACAHAAC1AwAgDgAAtgMAIA8AALcDACAQAAC4AwAg4AEBAJcDACHiAQEAlwMAIeMBAQCXAwAh5gFAAJoDACH0AQAAsgOBAiL-AQEAlwMAIf8BAQCZAwAhAgAAAAUAIBoAAPIBACAH4AEBAJcDACHiAQEAlwMAIeMBAQCXAwAh5gFAAJoDACH0AQAAsgOBAiL-AQEAlwMAIf8BAQCZAwAhAgAAAAMAIBoAAPQBACACAAAAAwAgGgAA9AEAIAMAAAAFACAhAADtAQAgIgAA8gEAIAEAAAAFACABAAAAAwAgBAoAAK8DACAnAACxAwAgKAAAsAMAIP8BAACRAwAgCt0BAADgAgAw3gEAAPsBABDfAQAA4AIAMOABAQDFAgAh4gEBAMUCACHjAQEAxQIAIeYBQADIAgAh9AEAAOECgQIi_gEBAMUCACH_AQEAxwIAIQMAAAADACABAAD6AQAwJgAA-wEAIAMAAAADACABAAAEADACAAAFACAJBQAA2gIAIN0BAADeAgAw3gEAAB4AEN8BAADeAgAw4AEBAAAAAeEBAQAAAAH1AUAA2QIAIfYBAQDYAgAh9wEAAN8CACABAAAA_gEAIAEAAAD-AQAgAgUAAKkDACD3AQAAkQMAIAMAAAAeACABAACBAgAwAgAA_gEAIAMAAAAeACABAACBAgAwAgAA_gEAIAMAAAAeACABAACBAgAwAgAA_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_gEBANgCACH_AQEA6wIAIaQCAAADACClAgAAAwAgCN0BAADbAgAw3gEAAJMCABDfAQAA2wIAMOABAQDFAgAh4QEBAMUCACH1AUAAyAIAIfYBAQDFAgAh9wEAANwCACAPCgAAzQIAICcAAN0CACAoAADdAgAg5wGAAAAAAeoBgAAAAAHrAYAAAAAB7AGAAAAAAe0BgAAAAAHuAYAAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB-wGAAAAAAfwBgAAAAAH9AYAAAAABDOcBgAAAAAHqAYAAAAAB6wGAAAAAAewBgAAAAAHtAYAAAAAB7gGAAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAfsBgAAAAAH8AYAAAAAB_QGAAAAAAQkFAADaAgAg3QEAAN4CADDeAQAAHgAQ3wEAAN4CADDgAQEA2AIAIeEBAQDYAgAh9QFAANkCACH2AQEA2AIAIfcBAADfAgAgDOcBgAAAAAHqAYAAAAAB6wGAAAAAAewBgAAAAAHtAYAAAAAB7gGAAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAfsBgAAAAAH8AYAAAAAB_QGAAAAAAQrdAQAA4AIAMN4BAAD7AQAQ3wEAAOACADDgAQEAxQIAIeIBAQDFAgAh4wEBAMUCACHmAUAAyAIAIfQBAADhAoECIv4BAQDFAgAh_wEBAMcCACEHCgAAygIAICcAAOMCACAoAADjAgAg5wEAAACBAgLoAQAAAIECCOkBAAAAgQII7gEAAOICgQIiBwoAAMoCACAnAADjAgAgKAAA4wIAIOcBAAAAgQIC6AEAAACBAgjpAQAAAIECCO4BAADiAoECIgTnAQAAAIECAugBAAAAgQII6QEAAACBAgjuAQAA4wKBAiIJ3QEAAOQCADDeAQAA5QEAEN8BAADkAgAw4AEBAMUCACHjAQEAxQIAIeYBQADIAgAhgQJAAMgCACGCAkAAyAIAIYMCIADlAgAhBQoAAMoCACAnAADnAgAgKAAA5wIAIOcBIAAAAAHuASAA5gIAIQUKAADKAgAgJwAA5wIAICgAAOcCACDnASAAAAAB7gEgAOYCACEC5wEgAAAAAe4BIADnAgAhBd0BAADoAgAw3gEAAM8BABDfAQAA6AIAMOMBAQDFAgAhhAIBAMUCACEH3QEAAOkCADDeAQAAuQEAEN8BAADpAgAw4AEBAMUCACHmAUAAyAIAIYUCAQDFAgAhhgIBAMcCACEICQAA7AIAIN0BAADqAgAw3gEAAKYBABDfAQAA6gIAMOABAQDYAgAh5gFAANkCACGFAgEA2AIAIYYCAQDrAgAhC-cBAQAAAAHoAQEAAAAF6QEBAAAABeoBAQAAAAHrAQEAAAAB7AEBAAAAAe0BAQAAAAHuAQEAzgIAIe8BAQAAAAHwAQEAAAAB8QEBAAAAAQOHAgAAEAAgiAIAABAAIIkCAAAQACAM3QEAAO0CADDeAQAAoAEAEN8BAADtAgAw4AEBAMUCACHmAUAAyAIAIfUBQADIAgAhigIBAMUCACGLAgEAxQIAIYwCAgDGAgAhjQIIANQCACGOAiAA5QIAIY8CAQDHAgAhEQMAAPECACAEAADyAgAgCAAA8wIAIAwAAOwCACANAAD0AgAg3QEAAO4CADDeAQAAIQAQ3wEAAO4CADDgAQEA2AIAIeYBQADZAgAh9QFAANkCACGKAgEA2AIAIYsCAQDYAgAhjAICAO8CACGNAggA1wIAIY4CIADwAgAhjwIBAOsCACEI5wECAAAAAegBAgAAAATpAQIAAAAE6gECAAAAAesBAgAAAAHsAQIAAAAB7QECAAAAAe4BAgDKAgAhAucBIAAAAAHuASAA5wIAIQOHAgAABwAgiAIAAAcAIIkCAAAHACADhwIAAAMAIIgCAAADACCJAgAAAwAgA4cCAAAMACCIAgAADAAgiQIAAAwAIBMIAADzAgAgEQAA8gIAIBIAAP4CACATAAD_AgAgFAAAgAMAIN0BAAD9AgAw3gEAADAAEN8BAAD9AgAw4AEBANgCACHmAUAA2QIAIfQBAQDYAgAh9QFAANkCACGFAgEA2AIAIZ8CAQDYAgAhoAIgAPACACGhAgEA6wIAIaICAQDYAgAhpAIAADAAIKUCAAAwACAJ3QEAAPUCADDeAQAAiAEAEN8BAAD1AgAw4AEBAMUCACHmAUAAyAIAIfUBQADIAgAhkAIBAMUCACGRAgEAxQIAIZICQADIAgAhCd0BAAD2AgAw3gEAAHUAEN8BAAD2AgAw4AEBANgCACHmAUAA2QIAIfUBQADZAgAhkAIBANgCACGRAgEA2AIAIZICQADZAgAhEN0BAAD3AgAw3gEAAG8AEN8BAAD3AgAw4AEBAMUCACHmAUAAyAIAIfUBQADIAgAhigIBAMUCACGTAgEAxQIAIZQCAQDFAgAhlQIBAMcCACGWAgEAxwIAIZcCAQDHAgAhmAJAAPgCACGZAkAA-AIAIZoCAQDHAgAhmwIBAMcCACELCgAAzQIAICcAAPoCACAoAAD6AgAg5wFAAAAAAegBQAAAAAXpAUAAAAAF6gFAAAAAAesBQAAAAAHsAUAAAAAB7QFAAAAAAe4BQAD5AgAhCwoAAM0CACAnAAD6AgAgKAAA-gIAIOcBQAAAAAHoAUAAAAAF6QFAAAAABeoBQAAAAAHrAUAAAAAB7AFAAAAAAe0BQAAAAAHuAUAA-QIAIQjnAUAAAAAB6AFAAAAABekBQAAAAAXqAUAAAAAB6wFAAAAAAewBQAAAAAHtAUAAAAAB7gFAAPoCACEL3QEAAPsCADDeAQAAWQAQ3wEAAPsCADDgAQEAxQIAIeYBQADIAgAh9QFAAMgCACGKAgEAxQIAIZICQADIAgAhnAIBAMUCACGdAgEAxwIAIZ4CAQDHAgAhDN0BAAD8AgAw3gEAAEMAEN8BAAD8AgAw4AEBAMUCACHmAUAAyAIAIfQBAQDFAgAh9QFAAMgCACGFAgEAxQIAIZ8CAQDFAgAhoAIgAOUCACGhAgEAxwIAIaICAQDFAgAhEQgAAPMCACARAADyAgAgEgAA_gIAIBMAAP8CACAUAACAAwAg3QEAAP0CADDeAQAAMAAQ3wEAAP0CADDgAQEA2AIAIeYBQADZAgAh9AEBANgCACH1AUAA2QIAIYUCAQDYAgAhnwIBANgCACGgAiAA8AIAIaECAQDrAgAhogIBANgCACETAwAA8QIAIAQAAPICACAIAADzAgAgDAAA7AIAIA0AAPQCACDdAQAA7gIAMN4BAAAhABDfAQAA7gIAMOABAQDYAgAh5gFAANkCACH1AUAA2QIAIYoCAQDYAgAhiwIBANgCACGMAgIA7wIAIY0CCADXAgAhjgIgAPACACGPAgEA6wIAIaQCAAAhACClAgAAIQAgA4cCAAAjACCIAgAAIwAgiQIAACMAIAOHAgAAJwAgiAIAACcAIIkCAAAnACAMDQAA9AIAIN0BAACBAwAw3gEAACcAEN8BAACBAwAw4AEBANgCACHmAUAA2QIAIfUBQADZAgAhigIBANgCACGSAkAA2QIAIZwCAQDYAgAhnQIBAOsCACGeAgEA6wIAIRENAAD0AgAg3QEAAIIDADDeAQAAIwAQ3wEAAIIDADDgAQEA2AIAIeYBQADZAgAh9QFAANkCACGKAgEA2AIAIZMCAQDYAgAhlAIBANgCACGVAgEA6wIAIZYCAQDrAgAhlwIBAOsCACGYAkAAgwMAIZkCQACDAwAhmgIBAOsCACGbAgEA6wIAIQjnAUAAAAAB6AFAAAAABekBQAAAAAXqAUAAAAAB6wFAAAAAAewBQAAAAAHtAUAAAAAB7gFAAPoCACEC4wEBAAAAAYQCAQAAAAEHBwAAhwMAIAsAAIYDACDdAQAAhQMAMN4BAAAQABDfAQAAhQMAMOMBAQDYAgAhhAIBANgCACEKCQAA7AIAIN0BAADqAgAw3gEAAKYBABDfAQAA6gIAMOABAQDYAgAh5gFAANkCACGFAgEA2AIAIYYCAQDrAgAhpAIAAKYBACClAgAApgEAIBMDAADxAgAgBAAA8gIAIAgAAPMCACAMAADsAgAgDQAA9AIAIN0BAADuAgAw3gEAACEAEN8BAADuAgAw4AEBANgCACHmAUAA2QIAIfUBQADZAgAhigIBANgCACGLAgEA2AIAIYwCAgDvAgAhjQIIANcCACGOAiAA8AIAIY8CAQDrAgAhpAIAACEAIKUCAAAhACANBQAA2gIAIAYAAPQCACAHAACHAwAg3QEAAIgDADDeAQAADAAQ3wEAAIgDADDgAQEA2AIAIeEBAQDYAgAh4gEBANgCACHjAQEA2AIAIeQBAgDvAgAh5QEBAOsCACHmAUAA2QIAIQsFAACKAwAgBwAAhwMAIN0BAACJAwAw3gEAAAcAEN8BAACJAwAw4AEBANgCACHjAQEA2AIAIeYBQADZAgAhgQJAANkCACGCAkAA2QIAIYMCIADwAgAhEgMAAI0DACAGAAD0AgAgBwAAhwMAIA4AAI4DACAPAACPAwAgEAAAkAMAIN0BAACLAwAw3gEAAAMAEN8BAACLAwAw4AEBANgCACHiAQEA2AIAIeMBAQDYAgAh5gFAANkCACH0AQAAjAOBAiL-AQEA2AIAIf8BAQDrAgAhpAIAAAMAIKUCAAADACAQAwAAjQMAIAYAAPQCACAHAACHAwAgDgAAjgMAIA8AAI8DACAQAACQAwAg3QEAAIsDADDeAQAAAwAQ3wEAAIsDADDgAQEA2AIAIeIBAQDYAgAh4wEBANgCACHmAUAA2QIAIfQBAACMA4ECIv4BAQDYAgAh_wEBAOsCACEE5wEAAACBAgLoAQAAAIECCOkBAAAAgQII7gEAAOMCgQIiDQUAAIoDACAHAACHAwAg3QEAAIkDADDeAQAABwAQ3wEAAIkDADDgAQEA2AIAIeMBAQDYAgAh5gFAANkCACGBAkAA2QIAIYICQADZAgAhgwIgAPACACGkAgAABwAgpQIAAAcAIA0FAADaAgAg3QEAANYCADDeAQAAGwAQ3wEAANYCADDgAQEA2AIAIeEBAQDYAgAh5gFAANkCACHyAQEA2AIAIfMBCADXAgAh9AEBANgCACH1AUAA2QIAIaQCAAAbACClAgAAGwAgDwUAANoCACAGAAD0AgAgBwAAhwMAIN0BAACIAwAw3gEAAAwAEN8BAACIAwAw4AEBANgCACHhAQEA2AIAIeIBAQDYAgAh4wEBANgCACHkAQIA7wIAIeUBAQDrAgAh5gFAANkCACGkAgAADAAgpQIAAAwAIAsFAADaAgAg3QEAAN4CADDeAQAAHgAQ3wEAAN4CADDgAQEA2AIAIeEBAQDYAgAh9QFAANkCACH2AQEA2AIAIfcBAADfAgAgpAIAAB4AIKUCAAAeACAAAAAAAAABrAIBAAAAAQWsAgIAAAABrwICAAAAAbACAgAAAAGxAgIAAAABsgICAAAAAQGsAgEAAAABAawCQAAAAAEFIQAAygUAICIAANMFACCmAgAAywUAIKcCAADSBQAgqgIAAAUAIAUhAADIBQAgIgAA0AUAIKYCAADJBQAgpwIAAM8FACCqAgAAAQAgBSEAAMYFACAiAADNBQAgpgIAAMcFACCnAgAAzAUAIKoCAACLAQAgAyEAAMoFACCmAgAAywUAIKoCAAAFACADIQAAyAUAIKYCAADJBQAgqgIAAAEAIAMhAADGBQAgpgIAAMcFACCqAgAAiwEAIAAAAAAABawCCAAAAAGvAggAAAABsAIIAAAAAbECCAAAAAGyAggAAAABBSEAAMEFACAiAADEBQAgpgIAAMIFACCnAgAAwwUAIKoCAAAFACADIQAAwQUAIKYCAADCBQAgqgIAAAUAIAcDAACCBQAgBgAAswQAIAcAAP4EACAOAACDBQAgDwAAhAUAIBAAAIUFACD_AQAAkQMAIAAAAAUhAAC8BQAgIgAAvwUAIKYCAAC9BQAgpwIAAL4FACCqAgAABQAgAyEAALwFACCmAgAAvQUAIKoCAAAFACAAAAABrAIAAACBAgIFIQAAsQUAICIAALoFACCmAgAAsgUAIKcCAAC5BQAgqgIAAAkAIAUhAACvBQAgIgAAtwUAIKYCAACwBQAgpwIAALYFACCqAgAAAQAgBSEAAK0FACAiAAC0BQAgpgIAAK4FACCnAgAAswUAIKoCAACLAQAgByEAAMMDACAiAADGAwAgpgIAAMQDACCnAgAAxQMAIKgCAAAbACCpAgAAGwAgqgIAAJYCACAHIQAAvgMAICIAAMEDACCmAgAAvwMAIKcCAADAAwAgqAIAAAwAIKkCAAAMACCqAgAADgAgByEAALkDACAiAAC8AwAgpgIAALoDACCnAgAAuwMAIKgCAAAeACCpAgAAHgAgqgIAAP4BACAE4AEBAAAAAfUBQAAAAAH2AQEAAAAB9wGAAAAAAQIAAAD-AQAgIQAAuQMAIAMAAAAeACAhAAC5AwAgIgAAvQMAIAYAAAAeACAaAAC9AwAg4AEBAJcDACH1AUAAmgMAIfYBAQCXAwAh9wGAAAAAAQTgAQEAlwMAIfUBQACaAwAh9gEBAJcDACH3AYAAAAABCAYAAJ8DACAHAACgAwAg4AEBAAAAAeIBAQAAAAHjAQEAAAAB5AECAAAAAeUBAQAAAAHmAUAAAAABAgAAAA4AICEAAL4DACADAAAADAAgIQAAvgMAICIAAMIDACAKAAAADAAgBgAAnAMAIAcAAJ0DACAaAADCAwAg4AEBAJcDACHiAQEAlwMAIeMBAQCXAwAh5AECAJgDACHlAQEAmQMAIeYBQACaAwAhCAYAAJwDACAHAACdAwAg4AEBAJcDACHiAQEAlwMAIeMBAQCXAwAh5AECAJgDACHlAQEAmQMAIeYBQACaAwAhBuABAQAAAAHmAUAAAAAB8gEBAAAAAfMBCAAAAAH0AQEAAAAB9QFAAAAAAQIAAACWAgAgIQAAwwMAIAMAAAAbACAhAADDAwAgIgAAxwMAIAgAAAAbACAaAADHAwAg4AEBAJcDACHmAUAAmgMAIfIBAQCXAwAh8wEIAKYDACH0AQEAlwMAIfUBQACaAwAhBuABAQCXAwAh5gFAAJoDACHyAQEAlwMAIfMBCACmAwAh9AEBAJcDACH1AUAAmgMAIQMhAACxBQAgpgIAALIFACCqAgAACQAgAyEAAK8FACCmAgAAsAUAIKoCAAABACADIQAArQUAIKYCAACuBQAgqgIAAIsBACADIQAAwwMAIKYCAADEAwAgqgIAAJYCACADIQAAvgMAIKYCAAC_AwAgqgIAAA4AIAMhAAC5AwAgpgIAALoDACCqAgAA_gEAIAAAAAGsAiAAAAABBSEAAKgFACAiAACrBQAgpgIAAKkFACCnAgAAqgUAIKoCAACLAQAgByEAANQDACAiAADXAwAgpgIAANUDACCnAgAA1gMAIKgCAAADACCpAgAAAwAgqgIAAAUAIAsGAADJAwAgBwAAygMAIA4AAMsDACAPAADMAwAgEAAAzQMAIOABAQAAAAHiAQEAAAAB4wEBAAAAAeYBQAAAAAH0AQAAAIECAv8BAQAAAAECAAAABQAgIQAA1AMAIAMAAAADACAhAADUAwAgIgAA2AMAIA0AAAADACAGAAC0AwAgBwAAtQMAIA4AALYDACAPAAC3AwAgEAAAuAMAIBoAANgDACDgAQEAlwMAIeIBAQCXAwAh4wEBAJcDACHmAUAAmgMAIfQBAACyA4ECIv8BAQCZAwAhCwYAALQDACAHAAC1AwAgDgAAtgMAIA8AALcDACAQAAC4AwAg4AEBAJcDACHiAQEAlwMAIeMBAQCXAwAh5gFAAJoDACH0AQAAsgOBAiL_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_gEBAAAAAf8BAQAAAAECAAAABQAgIQAAngQAIAMAAAAFACAhAACeBAAgIgAAnQQAIAEaAACXBQAwEAMAAI0DACAGAAD0AgAgBwAAhwMAIA4AAI4DACAPAACPAwAgEAAAkAMAIN0BAACLAwAw3gEAAAMAEN8BAACLAwAw4AEBAAAAAeIBAQDYAgAh4wEBANgCACHmAUAA2QIAIfQBAACMA4ECIv4BAQAAAAH_AQEA6wIAIQIAAAAFACAaAACdBAAgAgAAAJsEACAaAACcBAAgCt0BAACaBAAw3gEAAJsEABDfAQAAmgQAMOABAQDYAgAh4gEBANgCACHjAQEA2AIAIeYBQADZAgAh9AEAAIwDgQIi_gEBANgCACH_AQEA6wIAIQrdAQAAmgQAMN4BAACbBAAQ3wEAAJoEADDgAQEA2AIAIeIBAQDYAgAh4wEBANgCACHmAUAA2QIAIfQBAACMA4ECIv4BAQDYAgAh_wEBAOsCACEG4AEBAJcDACHiAQEAlwMAIeYBQACaAwAh9AEAALIDgQIi_gEBAJcDACH_AQEAmQMAIQsDAACzAwAgBgAAtAMAIA4AALYDACAPAAC3AwAgEAAAuAMAIOABAQCXAwAh4gEBAJcDACHmAUAAmgMAIfQBAACyA4ECIv4BAQCXAwAh_wEBAJkDACELAwAAyAMAIAYAAMkDACAOAADLAwAgDwAAzAMAIBAAAM0DACDgAQEAAAAB4gEBAAAAAeYBQAAAAAH0AQAAAIECAv4BAQAAAAH_AQEAAAABBgUAANoDACDgAQEAAAAB5gFAAAAAAYECQAAAAAGCAkAAAAABgwIgAAAAAQIAAAAJACAhAACqBAAgAwAAAAkAICEAAKoEACAiAACpBAAgARoAAJYFADALBQAAigMAIAcAAIcDACDdAQAAiQMAMN4BAAAHABDfAQAAiQMAMOABAQAAAAHjAQEA2AIAIeYBQADZAgAhgQJAANkCACGCAkAA2QIAIYMCIADwAgAhAgAAAAkAIBoAAKkEACACAAAApwQAIBoAAKgEACAJ3QEAAKYEADDeAQAApwQAEN8BAACmBAAw4AEBANgCACHjAQEA2AIAIeYBQADZAgAhgQJAANkCACGCAkAA2QIAIYMCIADwAgAhCd0BAACmBAAw3gEAAKcEABDfAQAApgQAMOABAQDYAgAh4wEBANgCACHmAUAA2QIAIYECQADZAgAhggJAANkCACGDAiAA8AIAIQXgAQEAlwMAIeYBQACaAwAhgQJAAJoDACGCAkAAmgMAIYMCIADRAwAhBgUAANMDACDgAQEAlwMAIeYBQACaAwAhgQJAAJoDACGCAkAAmgMAIYMCIADRAwAhBgUAANoDACDgAQEAAAAB5gFAAAAAAYECQAAAAAGCAkAAAAABgwIgAAAAAQQhAACfBAAwpgIAAKAEADCqAgAAowQAMKsCAACiBAAgBCEAAJMEADCmAgAAlAQAMKoCAACXBAAwqwIAAJYEACAEIQAAhwQAMKYCAACIBAAwqgIAAIsEADCrAgAAigQAIAQhAAD-AwAwpgIAAP8DADCqAgAA6gMAMKsCAACBBAAgAyEAAJQFACCmAgAAlQUAIKoCAAABACAAAAAGCAAAsgQAIBEAALEEACASAAD-BAAgEwAA_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-QMAIAQAAPoDACAIAAD7AwAgDAAA_AMAIOABAQCXAwAh5gFAAJoDACH1AUAAmgMAIYsCAQCXAwAhjAICAJgDACGNAggApgMAIY4CIADRAwAhjwIBAJkDACEIBQAAngMAIAcAAKADACDgAQEAAAAB4QEBAAAAAeMBAQAAAAHkAQIAAAAB5QEBAAAAAeYBQAAAAAECAAAADgAgIQAA7wQAIAMAAAAOACAhAADvBAAgIgAA7gQAIAEaAACHBQAwAgAAAA4AIBoAAO4EACACAAAAjwQAIBoAAO0EACAG4AEBAJcDACHhAQEAlwMAIeMBAQCXAwAh5AECAJgDACHlAQEAmQMAIeYBQACaAwAhCAUAAJsDACAHAACdAwAg4AEBAJcDACHhAQEAlwMAIeMBAQCXAwAh5AECAJgDACHlAQEAmQMAIeYBQACaAwAhCAUAAJ4DACAHAACgAwAg4AEBAAAAAeEBAQAAAAHjAQEAAAAB5AECAAAAAeUBAQAAAAHmAUAAAAABCwMAAMgDACAHAADKAwAgDgAAywMAIA8AAMwDACAQAADNAwAg4AEBAAAAAeMBAQAAAAHmAUAAAAAB9AEAAACBAgL-AQEAAAAB_wEBAAAAAQIAAAAFACAhAAD4BAAgAwAAAAUAICEAAPgEACAiAAD3BAAgARoAAIYFADACAAAABQAgGgAA9wQAIAIAAACbBAAgGgAA9gQAIAbgAQEAlwMAIeMBAQCXAwAh5gFAAJoDACH0AQAAsgOBAiL-AQEAlwMAIf8BAQCZAwAhCwMAALMDACAHAAC1AwAgDgAAtgMAIA8AALcDACAQAAC4AwAg4AEBAJcDACHjAQEAlwMAIeYBQACaAwAh9AEAALIDgQIi_gEBAJcDACH_AQEAmQMAIQsDAADIAwAgBwAAygMAIA4AAMsDACAPAADMAwAgEAAAzQMAIOABAQAAAAHjAQEAAAAB5gFAAAAAAfQBAAAAgQIC_gEBAAAAAf8BAQAAAAEEIQAA8AQAMKYCAADxBAAwqgIAAJcEADCrAgAA8wQAIAQhAADnBAAwpgIAAOgEADCqAgAAiwQAMKsCAADqBAAgAyEAAOIEACCmAgAA4wQAIKoCAACLAQAgBCEAANYEADCmAgAA1wQAMKoCAADaBAAwqwIAANkEACAEIQAAygQAMKYCAADLBAAwqgIAAM4EADCrAgAAzQQAIAYDAACwBAAgBAAAsQQAIAgAALIEACAMAADzAwAgDQAAswQAII8CAACRAwAgAAACCQAA8wMAIIYCAACRAwAgAgUAAKkDACAHAAD-BAAgAQUAAKkDACAEBQAAqQMAIAYAALMEACAHAAD-BAAg5QEAAJEDACACBQAAqQMAIPcBAACRAwAgBuABAQAAAAHjAQEAAAAB5gFAAAAAAfQBAAAAgQIC_gEBAAAAAf8BAQAAAAEG4AEBAAAAAeEBAQAAAAHjAQEAAAAB5AECAAAAAeUBAQAAAAHmAUAAAAABDOABAQAAAAHmAUAAAAAB9QFAAAAAAZMCAQAAAAGUAgEAAAABlQIBAAAAAZYCAQAAAAGXAgEAAAABmAJAAAAAAZkCQAAAAAGaAgEAAAABmwIBAAAAAQfgAQEAAAAB5gFAAAAAAfUBQAAAAAGSAkAAAAABnAIBAAAAAZ0CAQAAAAGeAgEAAAABDQgAAPoEACARAAD5BAAgEgAA-wQAIBMAAPwEACDgAQEAAAAB5gFAAAAAAfQBAQAAAAH1AUAAAAABhQIBAAAAAZ8CAQAAAAGgAiAAAAABoQIBAAAAAaICAQAAAAECAAAAAQAgIQAAigUAIAMAAAAwACAhAACKBQAgIgAAjgUAIA8AAAAwACAIAADGBAAgEQAAxQQAIBIAAMcEACATAADIBAAgGgAAjgUAIOABAQCXAwAh5gFAAJoDACH0AQEAlwMAIfUBQACaAwAhhQIBAJcDACGfAgEAlwMAIaACIADRAwAhoQIBAJkDACGiAgEAlwMAIQ0IAADGBAAgEQAAxQQAIBIAAMcEACATAADIBAAg4AEBAJcDACHmAUAAmgMAIfQBAQCXAwAh9QFAAJoDACGFAgEAlwMAIZ8CAQCXAwAhoAIgANEDACGhAgEAmQMAIaICAQCXAwAhDQgAAPoEACARAAD5BAAgEgAA-wQAIBQAAP0EACDgAQEAAAAB5gFAAAAAAfQBAQAAAAH1AUAAAAABhQIBAAAAAZ8CAQAAAAGgAiAAAAABoQIBAAAAAaICAQAAAAECAAAAAQAgIQAAjwUAIAMAAAAwACAhAACPBQAgIgAAkwUAIA8AAAAwACAIAADGBAAgEQAAxQQAIBIAAMcEACAUAADJBAAgGgAAkwUAIOABAQCXAwAh5gFAAJoDACH0AQEAlwMAIfUBQACaAwAhhQIBAJcDACGfAgEAlwMAIaACIADRAwAhoQIBAJkDACGiAgEAlwMAIQ0IAADGBAAgEQAAxQQAIBIAAMcEACAUAADJBAAg4AEBAJcDACHmAUAAmgMAIfQBAQCXAwAh9QFAAJoDACGFAgEAlwMAIZ8CAQCXAwAhoAIgANEDACGhAgEAmQMAIaICAQCXAwAhDQgAAPoEACARAAD5BAAgEwAA_AQAIBQAAP0EACDgAQEAAAAB5gFAAAAAAfQBAQAAAAH1AUAAAAABhQIBAAAAAZ8CAQAAAAGgAiAAAAABoQIBAAAAAaICAQAAAAECAAAAAQAgIQAAlAUAIAXgAQEAAAAB5gFAAAAAAYECQAAAAAGCAkAAAAABgwIgAAAAAQbgAQEAAAAB4gEBAAAAAeYBQAAAAAH0AQAAAIECAv4BAQAAAAH_AQEAAAABBuABAQAAAAHhAQEAAAAB4gEBAAAAAeQBAgAAAAHlAQEAAAAB5gFAAAAAAQGEAgEAAAABAwAAADAAICEAAJQFACAiAACcBQAgDwAAADAAIAgAAMYEACARAADFBAAgEwAAyAQAIBQAAMkEACAaAACcBQAg4AEBAJcDACHmAUAAmgMAIfQBAQCXAwAh9QFAAJoDACGFAgEAlwMAIZ8CAQCXAwAhoAIgANEDACGhAgEAmQMAIaICAQCXAwAhDQgAAMYEACARAADFBAAgEwAAyAQAIBQAAMkEACDgAQEAlwMAIeYBQACaAwAh9AEBAJcDACH1AUAAmgMAIYUCAQCXAwAhnwIBAJcDACGgAiAA0QMAIaECAQCZAwAhogIBAJcDACEB4wEBAAAAAQ0DAACrBAAgBAAArAQAIAgAAK0EACANAACvBAAg4AEBAAAAAeYBQAAAAAH1AUAAAAABigIBAAAAAYsCAQAAAAGMAgIAAAABjQIIAAAAAY4CIAAAAAGPAgEAAAABAgAAAIsBACAhAACeBQAgBOABAQAAAAHmAUAAAAABhQIBAAAAAYYCAQAAAAECAAAAowEAICEAAKAFACADAAAAIQAgIQAAngUAICIAAKQFACAPAAAAIQAgAwAA-QMAIAQAAPoDACAIAAD7AwAgDQAA_QMAIBoAAKQFACDgAQEAlwMAIeYBQACaAwAh9QFAAJoDACGKAgEAlwMAIYsCAQCXAwAhjAICAJgDACGNAggApgMAIY4CIADRAwAhjwIBAJkDACENAwAA-QMAIAQAAPoDACAIAAD7AwAgDQAA_QMAIOABAQCXAwAh5gFAAJoDACH1AUAAmgMAIYoCAQCXAwAhiwIBAJcDACGMAgIAmAMAIY0CCACmAwAhjgIgANEDACGPAgEAmQMAIQMAAACmAQAgIQAAoAUAICIAAKcFACAGAAAApgEAIBoAAKcFACDgAQEAlwMAIeYBQACaAwAhhQIBAJcDACGGAgEAmQMAIQTgAQEAlwMAIeYBQACaAwAhhQIBAJcDACGGAgEAmQMAIQ0EAACsBAAgCAAArQQAIAwAAK4EACANAACvBAAg4AEBAAAAAeYBQAAAAAH1AUAAAAABigIBAAAAAYsCAQAAAAGMAgIAAAABjQIIAAAAAY4CIAAAAAGPAgEAAAABAgAAAIsBACAhAACoBQAgAwAAACEAICEAAKgFACAiAACsBQAgDwAAACEAIAQAAPoDACAIAAD7AwAgDAAA_AMAIA0AAP0DACAaAACsBQAg4AEBAJcDACHmAUAAmgMAIfUBQACaAwAhigIBAJcDACGLAgEAlwMAIYwCAgCYAwAhjQIIAKYDACGOAiAA0QMAIY8CAQCZAwAhDQQAAPoDACAIAAD7AwAgDAAA_AMAIA0AAP0DACDgAQEAlwMAIeYBQACaAwAh9QFAAJoDACGKAgEAlwMAIYsCAQCXAwAhjAICAJgDACGNAggApgMAIY4CIADRAwAhjwIBAJkDACENAwAAqwQAIAgAAK0EACAMAACuBAAgDQAArwQAIOABAQAAAAHmAUAAAAAB9QFAAAAAAYoCAQAAAAGLAgEAAAABjAICAAAAAY0CCAAAAAGOAiAAAAABjwIBAAAAAQIAAACLAQAgIQAArQUAIA0IAAD6BAAgEgAA-wQAIBMAAPwEACAUAAD9BAAg4AEBAAAAAeYBQAAAAAH0AQEAAAAB9QFAAAAAAYUCAQAAAAGfAgEAAAABoAIgAAAAAaECAQAAAAGiAgEAAAABAgAAAAEAICEAAK8FACAHBwAA2QMAIOABAQAAAAHjAQEAAAAB5gFAAAAAAYECQAAAAAGCAkAAAAABgwIgAAAAAQIAAAAJACAhAACxBQAgAwAAACEAICEAAK0FACAiAAC1BQAgDwAAACEAIAMAAPkDACAIAAD7AwAgDAAA_AMAIA0AAP0DACAaAAC1BQAg4AEBAJcDACHmAUAAmgMAIfUBQACaAwAhigIBAJcDACGLAgEAlwMAIYwCAgCYAwAhjQIIAKYDACGOAiAA0QMAIY8CAQCZAwAhDQMAAPkDACAIAAD7AwAgDAAA_AMAIA0AAP0DACDgAQEAlwMAIeYBQACaAwAh9QFAAJoDACGKAgEAlwMAIYsCAQCXAwAhjAICAJgDACGNAggApgMAIY4CIADRAwAhjwIBAJkDACEDAAAAMAAgIQAArwUAICIAALgFACAPAAAAMAAgCAAAxgQAIBIAAMcEACATAADIBAAgFAAAyQQAIBoAALgFACDgAQEAlwMAIeYBQACaAwAh9AEBAJcDACH1AUAAmgMAIYUCAQCXAwAhnwIBAJcDACGgAiAA0QMAIaECAQCZAwAhogIBAJcDACENCAAAxgQAIBIAAMcEACATAADIBAAgFAAAyQQAIOABAQCXAwAh5gFAAJoDACH0AQEAlwMAIfUBQACaAwAhhQIBAJcDACGfAgEAlwMAIaACIADRAwAhoQIBAJkDACGiAgEAlwMAIQMAAAAHACAhAACxBQAgIgAAuwUAIAkAAAAHACAHAADSAwAgGgAAuwUAIOABAQCXAwAh4wEBAJcDACHmAUAAmgMAIYECQACaAwAhggJAAJoDACGDAiAA0QMAIQcHAADSAwAg4AEBAJcDACHjAQEAlwMAIeYBQACaAwAhgQJAAJoDACGCAkAAmgMAIYMCIADRAwAhDAMAAMgDACAGAADJAwAgBwAAygMAIA4AAMsDACAPAADMAwAg4AEBAAAAAeIBAQAAAAHjAQEAAAAB5gFAAAAAAfQBAAAAgQIC_gEBAAAAAf8BAQAAAAECAAAABQAgIQAAvAUAIAMAAAADACAhAAC8BQAgIgAAwAUAIA4AAAADACADAACzAwAgBgAAtAMAIAcAALUDACAOAAC2AwAgDwAAtwMAIBoAAMAFACDgAQEAlwMAIeIBAQCXAwAh4wEBAJcDACHmAUAAmgMAIfQBAACyA4ECIv4BAQCXAwAh_wEBAJkDACEMAwAAswMAIAYAALQDACAHAAC1AwAgDgAAtgMAIA8AALcDACDgAQEAlwMAIeIBAQCXAwAh4wEBAJcDACHmAUAAmgMAIfQBAACyA4ECIv4BAQCXAwAh_wEBAJkDACEMAwAAyAMAIAYAAMkDACAHAADKAwAgDwAAzAMAIBAAAM0DACDgAQEAAAAB4gEBAAAAAeMBAQAAAAHmAUAAAAAB9AEAAACBAgL-AQEAAAAB_wEBAAAAAQIAAAAFACAhAADBBQAgAwAAAAMAICEAAMEFACAiAADFBQAgDgAAAAMAIAMAALMDACAGAAC0AwAgBwAAtQMAIA8AALcDACAQAAC4AwAgGgAAxQUAIOABAQCXAwAh4gEBAJcDACHjAQEAlwMAIeYBQACaAwAh9AEAALIDgQIi_gEBAJcDACH_AQEAmQMAIQwDAACzAwAgBgAAtAMAIAcAALUDACAPAAC3AwAgEAAAuAMAIOABAQCXAwAh4gEBAJcDACHjAQEAlwMAIeYBQACaAwAh9AEAALIDgQIi_gEBAJcDACH_AQEAmQMAIQ0DAACrBAAgBAAArAQAIAwAAK4EACANAACvBAAg4AEBAAAAAeYBQAAAAAH1AUAAAAABigIBAAAAAYsCAQAAAAGMAgIAAAABjQIIAAAAAY4CIAAAAAGPAgEAAAABAgAAAIsBACAhAADGBQAgDREAAPkEACASAAD7BAAgEwAA_AQAIBQAAP0EACDgAQEAAAAB5gFAAAAAAfQBAQAAAAH1AUAAAAABhQIBAAAAAZ8CAQAAAAGgAiAAAAABoQIBAAAAAaICAQAAAAECAAAAAQAgIQAAyAUAIAwDAADIAwAgBgAAyQMAIAcAAMoDACAOAADLAwAgEAAAzQMAIOABAQAAAAHiAQEAAAAB4wEBAAAAAeYBQAAAAAH0AQAAAIECAv4BAQAAAAH_AQEAAAABAgAAAAUAICEAAMoFACADAAAAIQAgIQAAxgUAICIAAM4FACAPAAAAIQAgAwAA-QMAIAQAAPoDACAMAAD8AwAgDQAA_QMAIBoAAM4FACDgAQEAlwMAIeYBQACaAwAh9QFAAJoDACGKAgEAlwMAIYsCAQCXAwAhjAICAJgDACGNAggApgMAIY4CIADRAwAhjwIBAJkDACENAwAA-QMAIAQAAPoDACAMAAD8AwAgDQAA_QMAIOABAQCXAwAh5gFAAJoDACH1AUAAmgMAIYoCAQCXAwAhiwIBAJcDACGMAgIAmAMAIY0CCACmAwAhjgIgANEDACGPAgEAmQMAIQMAAAAwACAhAADIBQAgIgAA0QUAIA8AAAAwACARAADFBAAgEgAAxwQAIBMAAMgEACAUAADJBAAgGgAA0QUAIOABAQCXAwAh5gFAAJoDACH0AQEAlwMAIfUBQACaAwAhhQIBAJcDACGfAgEAlwMAIaACIADRAwAhoQIBAJkDACGiAgEAlwMAIQ0RAADFBAAgEgAAxwQAIBMAAMgEACAUAADJBAAg4AEBAJcDACHmAUAAmgMAIfQBAQCXAwAh9QFAAJoDACGFAgEAlwMAIZ8CAQCXAwAhoAIgANEDACGhAgEAmQMAIaICAQCXAwAhAwAAAAMAICEAAMoFACAiAADUBQAgDgAAAAMAIAMAALMDACAGAAC0AwAgBwAAtQMAIA4AALYDACAQAAC4AwAgGgAA1AUAIOABAQCXAwAh4gEBAJcDACHjAQEAlwMAIeYBQACaAwAh9AEAALIDgQIi_gEBAJcDACH_AQEAmQMAIQwDAACzAwAgBgAAtAMAIAcAALUDACAOAAC2AwAgEAAAuAMAIOABAQCXAwAh4gEBAJcDACHjAQEAlwMAIeYBQACaAwAh9AEAALIDgQIi_gEBAJcDACH_AQEAmQMAIQYIIAUKAA4RBgISIgQTJgwUKg0GAwADBgABBwAEDhwKDx0FEB8LAgUaAgcABAYDCgMECwIIDwUKAAkMEwYNAAEDBQACBgABBwAEAgcABAsABwIJFAYKAAgBCRUABAMWAAQXAAgYAAwZAAEFAAIBBQACAQ0AAQENAAEECCwAESsAEy0AFC4AAAAAAwoAEycAFCgAFQAAAAMKABMnABQoABUBDQABAQ0AAQMKABonABsoABwAAAADCgAaJwAbKAAcAQ0AAQENAAEDCgAhJwAiKAAjAAAAAwoAIScAIigAIwAAAAMKACknACooACsAAAADCgApJwAqKAArAQ0AAQENAAEFCgAwJwAzKAA0aQAxagAyAAAAAAAFCgAwJwAzKAA0aQAxagAyAAADCgA5JwA6KAA7AAAAAwoAOScAOigAOwIHAAQLAAcCBwAECwAHAwoAQCcAQSgAQgAAAAMKAEAnAEEoAEIBBwAEAQcABAMKAEcnAEgoAEkAAAADCgBHJwBIKABJAwMAAwYAAQcABAMDAAMGAAEHAAQDCgBOJwBPKABQAAAAAwoATicATygAUAEFAAIBBQACAwoAVScAVigAVwAAAAMKAFUnAFYoAFcBBQACAQUAAgUKAFwnAF8oAGBpAF1qAF4AAAAAAAUKAFwnAF8oAGBpAF1qAF4DBQACBgABBwAEAwUAAgYAAQcABAUKAGUnAGgoAGlpAGZqAGcAAAAAAAUKAGUnAGgoAGlpAGZqAGcVAgEWLwEXMgEYMwEZNAEbNgEcOA8dORAeOwEfPQ8gPhEjPwEkQAElQQ8pRBIqRRYrRg0sRw0tSA0uSQ0vSg0wTA0xTg8yTxczUQ00Uw81VBg2VQ03Vg04Vw85Whk6Wx07XAw8XQw9Xgw-Xww_YAxAYgxBZA9CZR5DZwxEaQ9Fah9GawxHbAxIbQ9JcCBKcSRLcyVMdCVNdyVOeCVPeSVQeyVRfQ9SfiZTgAElVIIBD1WDASdWhAElV4UBJViGAQ9ZiQEoWooBLFuMAQRcjQEEXY8BBF6QAQRfkQEEYJMBBGGVAQ9ilgEtY5gBBGSaAQ9lmwEuZpwBBGedAQRongEPa6EBL2yiATVtpAEHbqUBB2-oAQdwqQEHcaoBB3KsAQdzrgEPdK8BNnWxAQd2swEPd7QBN3i1AQd5tgEHercBD3u6ATh8uwE8fbwBBn69AQZ_vgEGgAG_AQaBAcABBoIBwgEGgwHEAQ-EAcUBPYUBxwEGhgHJAQ-HAcoBPogBywEGiQHMAQaKAc0BD4sB0AE_jAHRAUONAdIBA44B0wEDjwHUAQOQAdUBA5EB1gEDkgHYAQOTAdoBD5QB2wFElQHdAQOWAd8BD5cB4AFFmAHhAQOZAeIBA5oB4wEPmwHmAUacAecBSp0B6AECngHpAQKfAeoBAqAB6wECoQHsAQKiAe4BAqMB8AEPpAHxAUulAfMBAqYB9QEPpwH2AUyoAfcBAqkB-AECqgH5AQ-rAfwBTawB_QFRrQH_AQuuAYACC68BggILsAGDAguxAYQCC7IBhgILswGIAg-0AYkCUrUBiwILtgGNAg-3AY4CU7gBjwILuQGQAgu6AZECD7sBlAJUvAGVAli9AZcCCr4BmAIKvwGaAgrAAZsCCsEBnAIKwgGeAgrDAaACD8QBoQJZxQGjAgrGAaUCD8cBpgJayAGnAgrJAagCCsoBqQIPywGsAlvMAa0CYc0BrgIFzgGvAgXPAbACBdABsQIF0QGyAgXSAbQCBdMBtgIP1AG3AmLVAbkCBdYBuwIP1wG8AmPYAb0CBdkBvgIF2gG_Ag_bAcICZNwBwwJq"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
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
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionResourceScalarFieldEnum: () => SessionResourceScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorCategoryScalarFieldEnum: () => TutorCategoryScalarFieldEnum,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.7.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  TutorProfile: "TutorProfile",
  Category: "Category",
  TutorCategory: "TutorCategory",
  Availability: "Availability",
  Booking: "Booking",
  SessionResource: "SessionResource",
  Payment: "Payment",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  experience: "experience",
  pricePerHour: "pricePerHour",
  isFeatured: "isFeatured",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  bankAccountNumber: "bankAccountNumber"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt"
};
var TutorCategoryScalarFieldEnum = {
  tutorId: "tutorId",
  categoryId: "categoryId"
};
var AvailabilityScalarFieldEnum = {
  id: "id",
  tutorId: "tutorId",
  startTime: "startTime",
  endTime: "endTime",
  isBooked: "isBooked",
  createdAt: "createdAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  availabilityId: "availabilityId",
  meetingLink: "meetingLink",
  status: "status",
  createdAt: "createdAt"
};
var SessionResourceScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  transcriptText: "transcriptText",
  quizData: "quizData",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  stripeSessionId: "stripeSessionId",
  amount: "amount",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  studentId: "studentId",
  tutorId: "tutorId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
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
import { oAuthProxy } from "better-auth/plugins/oauth-proxy";
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
  // --- BASE URL ---
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  // --- TRUSTED ORIGINS ---
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigins2 = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000"
    ].filter(Boolean);
    if (!origin) return allowedOrigins2;
    if (allowedOrigins2.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return [origin];
    }
    return [];
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        // Must be false so social login doesn't fail
        defaultValue: "STUDENT",
        // This is the magic line
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
  // --- GOOGLE LOGIN ---
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`
    }
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
          html: `<p>Verify here: <a href="${verificationUrl}">Click</a></p>`
        });
      } catch (err) {
        console.error("Email Verification Error:", err);
        throw err;
      }
    }
  },
  plugins: [oAuthProxy()],
  // --- FORCING IT TO WORK ---
  advanced: {
    cookiePrefix: "skillbridge-auth",
    useSecureCookies: true,
    // Required for SameSite: none
    // Apply permissive attributes to ALL cookies (including state)
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      path: "/"
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    },
    cookieOptions: {
      sameSite: "none",
      secure: true
    }
  }
});

// src/middlewares/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Something went wrong on our end. Please try again later.";
  let errorDetails = process.env.NODE_ENV === "development" ? {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    ...err
    // This spreads only serializable properties
  } : {};
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Invalid data provided. Please check your field types and required fields.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        errorMessage = `A record with this ${err.meta?.target || "unique field"} already exists.`;
        break;
      case "P2003":
        statusCode = 400;
        errorMessage = "Foreign key constraint failed. The related record does not exist.";
        break;
      case "P2025":
        statusCode = 404;
        errorMessage = "The requested record was not found.";
        break;
      case "P2014":
        statusCode = 400;
        errorMessage = "The change you are trying to make would violate a required relation.";
        break;
      default:
        statusCode = 400;
        errorMessage = `Database error: ${err.message}`;
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 503;
    if (err.errorCode === "P1001") {
      errorMessage = "Database server is unreachable. Check your network or database status.";
    } else if (err.errorCode === "P1017") {
      errorMessage = "Server has lost connection to the database.";
    } else {
      errorMessage = "Failed to initialize database connection.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError || err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage = "An unexpected database engine error occurred.";
  } else if (err instanceof Error) {
    errorMessage = err.message;
    if ("status" in err) {
      statusCode = err.status;
    } else if ("statusCode" in err) {
      statusCode = err.statusCode;
    }
  }
  if (res.headersSent) {
    return next(err);
  }
  console.error(`[Error] ${req.method} ${req.url}:`, errorMessage);
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: errorDetails
  });
}
var globalErrorHandler_default = errorHandler;

// src/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  });
}

// src/routes/chat.route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
var router = express.Router();
var genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
router.post("/chat", async (req, res) => {
  try {
    const { message, userRole = "guest", userName = "User" } = req.body;
    const model2 = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const context = `
      You are SKILLBOT, the exclusive AI guide for SkillBridge.
      
      === PLATFORM IDENTITY ===
      SkillBridge is a premium 1-to-1 mentoring portal. 
      PAYMENT: We use **Stripe** for secure, upfront payments. Once a student pays, the session is instantly 'Confirmed'.
      
      === CURRENT USER CONTEXT ===
      - Name: ${userName} | Role: ${userRole}
      (Guests must sign up via Google/Email to access booking.)

      === HOW TO BOOK & PAY ===
      1. Visit a Tutor's profile and pick an "Available Slot."
      2. Click "Reserve Spot" to trigger the black confirmation banner.
      3. Click "Confirm" to be redirected to the secure **Stripe Checkout**.
      4. After payment, your session will appear in your Dashboard under #bookings.

      === UI STATES & TROUBLESHOOTING ===
      - Grayscale Screen: If the UI is grey and unclickable, the account is "Suspended" by an Admin.
      - Missing Admin Tools: "Ban" or "Feature" buttons only appear for verified Admin roles.
      - Featured Badges: Tutors with a bouncing yellow Star are platform-verified for excellence.

      === BEHAVIOR ===
      - Tone: Bubbly, professional, and tech-savvy.
      - Constraint: NEVER exceed 4 sentences. Use emojis (\u{1F680}, \u2728, \u{1F4B3}).
      - Formatting: Use bullet points for steps.
    `;
    const result = await model2.generateContent(`${context}

User: ${message}`);
    const text = result.response.text();
    return res.json({ text });
  } catch (error) {
    console.error("SkillBot Log:", error.message);
    return res.status(500).json({ text: "I'm having a quick technical snack! \u26A1 Try again in a second! \u{1F4B3}" });
  }
});
var chat_route_default = router;

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
var getAllCategories = async (page, limit) => {
  const queryOptions = {
    include: {
      _count: {
        select: {
          tutors: true
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  };
  if (limit > 0) {
    queryOptions.take = limit;
    queryOptions.skip = (page - 1) * limit;
  }
  const [data, totalCount] = await Promise.all([
    prisma.category.findMany(queryOptions),
    prisma.category.count()
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
var getAllCategoriesController = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;
    const result = await categoryService.getAllCategories(page, limit);
    res.json(result);
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
      bankAccountNumber: data.bankAccountNumber,
      // Ensure this field is included in the create data  
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true
        }
      },
      categories: { include: { category: true } },
      availability: true,
      bookings: true,
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true
            }
          }
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
var getFeaturedTutors = async (page, limit) => {
  const queryOptions = {
    where: {
      isFeatured: true
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true
        }
      },
      categories: {
        include: {
          category: true
        }
      },
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
    prisma.tutorProfile.count({ where: { isFeatured: true } })
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
var getAllTutorProfiles = async (page, limit) => {
  const queryOptions = {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true
        }
      },
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true
        }
      },
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
  minRating,
  page = 1,
  limit = 10
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
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  const queryOptions = {
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true
        }
      },
      categories: { include: { category: true } },
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
  let tutors = await prisma.tutorProfile.findMany(queryOptions);
  let totalCount = await prisma.tutorProfile.count({ where });
  if (typeof minRating === "number" && minRating > 0) {
    tutors = tutors.filter((tutor) => {
      const avgRating = tutor.reviews.length > 0 ? tutor.reviews.reduce((sum, r) => sum + r.rating, 0) / tutor.reviews.length : 0;
      return avgRating >= minRating;
    });
  }
  return {
    data: tutors,
    meta: {
      total: totalCount,
      page,
      limit,
      lastPage: limit > 0 ? Math.ceil(totalCount / limit) : 1
    }
  };
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;
    const result = await tutorProfileService.getAllsearchTutors({
      search,
      categories,
      minPrice,
      maxPrice,
      minRating,
      page,
      limit
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;
    const result = await tutorProfileService.getFeaturedTutors(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var getAllTutorsController = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = req.query.limit !== void 0 ? Number(req.query.limit) : 8;
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
var router2 = Router3();
router2.post("/", createTutorProfileController);
router2.get("/alltutor", getAllTutorsController);
router2.put("/:id", updateTutorProfileController);
router2.delete("/:id", deleteTutorProfileController);
router2.patch(
  "admin/users/:id",
  updateTutorFeatureController
);
router2.get("/public/getSEARCHtutors", getAllsearchTutors2);
router2.get("/public/featured", getFeaturedTutorsController);
router2.patch("/feature/:id", toggleFeaturedTutor);
router2.get("/tutorid/:userId", getTutorIdHandler);
router2.get("/public/:id", getTutorProfileByIdController);
router2.post("/teacher/createprofile", createTutorProfileController);
router2.patch("/update/:id", updateTutorProfileController);
var tutors_routes_default = router2;

// src/availability/availability.routes.ts
import { Router as Router4 } from "express";

// src/availability/availability.service.ts
var createAvailability = async (data) => {
  const cleanId = data.tutorId.replace(/[^a-zA-Z0-9-]/g, "");
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  if (start >= end) {
    throw new Error("End time must be after start time.");
  }
  const profile = await prisma.tutorProfile.findFirst({
    where: {
      OR: [{ id: cleanId }, { userId: cleanId }]
    }
  });
  if (!profile) throw new Error(`Tutor profile not found.`);
  const existingOverlap = await prisma.availability.findFirst({
    where: {
      tutorId: profile.id,
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
          // New slot completely covers an existing slot
          startTime: { gte: start },
          endTime: { lte: end }
        }
      ]
    }
  });
  if (existingOverlap) {
    throw new Error("This time slot overlaps with an existing availability.");
  }
  return await prisma.availability.create({
    data: {
      startTime: start,
      endTime: end,
      isBooked: false,
      tutorId: profile.id
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
var createAvailabilityController = async (req, res) => {
  try {
    const data = req.body;
    console.log("Backend receiving:", data);
    const availability = await availabilityService.createAvailability(data);
    return res.status(201).json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error("PRISMA CRASH:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Database operation failed"
    });
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
availabilityrouter.post("/create", createAvailabilityController);
availabilityrouter.get("/", getAllAvailabilitiesController);
availabilityrouter.get("/:id", getAvailabilityByIdController);
availabilityrouter.put("/:id", updateAvailabilityController);
availabilityrouter.delete("/:id", deleteAvailabilityController);
var availability_routes_default = availabilityrouter;

// src/bookings/bookings.routes.ts
import { Router as Router5 } from "express";

// src/bookings/bookings.service.ts
var studentBookingService = {
  // Logic to get the student's classes + Teacher's User Name
  async fetchStudentSchedule(studentUserId, statusFilter, page = 1, limit = 4) {
    const whereClause = { studentId: studentUserId };
    if (statusFilter === "upcoming") {
      whereClause.status = { in: ["PENDING", "CONFIRMED"] };
    } else if (statusFilter === "completed") {
      whereClause.status = "COMPLETED";
    }
    const queryOptions = {
      where: whereClause,
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
    };
    if (limit > 0) {
      queryOptions.take = limit;
      queryOptions.skip = (page - 1) * limit;
    }
    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany(queryOptions),
      prisma.booking.count({ where: whereClause })
    ]);
    return {
      bookings,
      meta: {
        total: totalCount,
        page,
        limit,
        lastPage: limit > 0 ? Math.ceil(totalCount / limit) : 1
      }
    };
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
  const existingBooking = await prisma.booking.findUnique({
    where: { availabilityId }
  });
  if (existingBooking) {
    if (existingBooking.status === "CONFIRMED") {
      throw new Error("This session is already booked and paid for.");
    }
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1e3);
    const isOldBooking = existingBooking.createdAt < fifteenMinutesAgo;
    if (existingBooking.status === "PENDING") {
      if (existingBooking.studentId === studentId) {
        return existingBooking;
      }
      if (isOldBooking) {
        await prisma.booking.delete({ where: { id: existingBooking.id } });
      } else {
        throw new Error("Someone is currently in the middle of paying for this. Please try again in 15 minutes.");
      }
    }
  }
  const generatedLink = `https://meet.jit.si/skillbridge-${availabilityId.slice(0, 8)}`;
  return await prisma.booking.create({
    data: {
      studentId,
      tutorId,
      availabilityId,
      meetingLink: meetingLink || generatedLink,
      status: "PENDING"
    }
  });
};
var BookingService = {
  async getTeacherBookings(identifier, statusFilter, page = 1, limit = 4) {
    const profile = await prisma.tutorProfile.findFirst({
      where: {
        OR: [
          { id: identifier },
          { userId: identifier }
        ]
      }
    });
    if (!profile) {
      console.log(`[Service] No TutorProfile found for: ${identifier}`);
      return { bookings: [], totalEarnings: 0, meta: { total: 0, page, limit, lastPage: 1 } };
    }
    const whereClause = { tutorId: profile.id };
    if (statusFilter === "upcoming") {
      whereClause.status = { in: ["PENDING", "CONFIRMED"] };
    } else if (statusFilter === "completed") {
      whereClause.status = "COMPLETED";
    }
    const queryOptions = {
      where: whereClause,
      include: {
        student: {
          select: { name: true, image: true, email: true }
        },
        availability: {
          select: { startTime: true, endTime: true }
        },
        payment: true
      },
      orderBy: {
        availability: { startTime: "asc" }
      }
    };
    if (limit > 0) {
      queryOptions.take = limit;
      queryOptions.skip = (page - 1) * limit;
    }
    const allCompletedBookings = await prisma.booking.findMany({
      where: { tutorId: profile.id, status: "COMPLETED" },
      include: { payment: true }
    });
    const totalEarnings = allCompletedBookings.reduce((sum, booking) => {
      if (booking.payment && (booking.payment.status === "COMPLETED" || booking.payment.status === "PAID")) {
        return sum + (booking.payment.amount || 0);
      }
      return sum;
    }, 0);
    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany(queryOptions),
      prisma.booking.count({ where: whereClause })
    ]);
    return {
      bookings,
      totalEarnings,
      meta: {
        total: totalCount,
        page,
        limit,
        lastPage: limit > 0 ? Math.ceil(totalCount / limit) : 1
      }
    };
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
var getSessionsOverview = async (id) => {
  const confirmedBookings = await prisma.booking.findMany({
    where: {
      OR: [
        { studentId: id },
        { tutorId: id },
        { tutor: { userId: id } }
      ],
      status: {
        in: ["CONFIRMED", "COMPLETED"]
      }
    },
    include: {
      student: {
        select: { name: true, image: true, email: true }
      },
      tutor: {
        include: { user: { select: { name: true } } }
      },
      availability: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return {
    success: true,
    totalSessions: confirmedBookings.length,
    bookings: confirmedBookings
  };
};
var bookingService = {
  createBookingService,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getSessionsOverview
};

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Update from 'acacia' to 'dahlia'
  apiVersion: "2026-03-25.dahlia",
  typescript: true
});

// src/bookings/bookings.controller.ts
var studentBookingController = {
  // GET: Fetch sessions where the logged-in user is the student
  async getStudentBookings(req, res, next) {
    try {
      const { userId, status } = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 4;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "Valid Student User ID is required" });
      }
      const bookings = await studentBookingService.fetchStudentSchedule(userId, status, page, limit);
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
      const { userId, status } = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 4;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const bookings = await BookingService.getTeacherBookings(String(userId), status, page, limit);
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
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    const booking = await bookingService.createBookingService(
      studentId,
      tutorId,
      availabilityId,
      meetingLink
    );
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: { user: true }
      // to get the teacher's name for the Stripe UI
    });
    if (!tutor) throw new Error("Tutor not found");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `Session with ${tutor.user?.name || "Tutor"}`,
            description: `Booking ID: ${booking.id}`
          },
          unit_amount: Math.round(tutor.pricePerHour * 100)
          // Convert to cents
        },
        quantity: 1
      }],
      mode: "payment",
      // Where to send the user after they finish
      success_url: `${process.env.APP_URL}/payment-success`,
      cancel_url: `${process.env.APP_URL}/payment-failed`,
      // IMPORTANT: Hide the booking ID in metadata so the Webhook can find it later
      metadata: {
        bookingId: booking.id
      }
    });
    return res.status(201).json({
      success: true,
      url: session.url,
      // <--- This is the golden ticket!
      bookingId: booking.id
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
var getSessionsOverviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const overview = await bookingService.getSessionsOverview(id);
    res.status(200).json(overview);
  } catch (error) {
    next(error);
  }
};

// src/bookings/bookings.routes.ts
var bookingrouter = Router5();
bookingrouter.get("/bookings", getAllBookingsController);
bookingrouter.get("/tutorbookings", BookingController.getMyBookings);
bookingrouter.get("/studentbookings", studentBookingController.getStudentBookings);
bookingrouter.get("/overview/:id", getSessionsOverviewController);
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
var getReviewById = async (tutorId) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        tutorId
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        student: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Could not fetch reviews");
  }
};
var ReviewServicee = {
  async getTutorReviewStats(tutorId, page = 1, limit = 2) {
    const stats = await prisma.review.aggregate({
      where: { tutorId },
      _avg: { rating: true },
      _count: { id: true }
    });
    const skip = (page - 1) * limit;
    const latestReviews = await prisma.review.findMany({
      where: { tutorId },
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: { name: true, image: true }
        }
      }
    });
    const totalReviews = stats._count.id;
    const lastPage = Math.ceil(totalReviews / limit);
    return {
      averageRating: stats._avg.rating?.toFixed(1) || "0.0",
      totalReviews,
      latestReviews,
      meta: {
        total: totalReviews,
        page,
        limit,
        lastPage: lastPage > 0 ? lastPage : 1
      }
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
  getAllReviews,
  updateReview,
  deleteReview
};

// src/reviews/reviews.controller.ts
var getReviewStats = async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const data = await ReviewServicee.getTutorReviewStats(tutorId, page, limit);
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
var getReviewStatsHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await getReviewById(id);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
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
var router3 = Router6();
router3.get("/", getAllReviewsController);
router3.post("/", createReviewController);
router3.put("/:id", updateReviewController);
router3.delete("/:id", deleteReviewController);
router3.get("/:id", getReviewStatsHandler);
router3.get("/stats/:tutorId", getReviewStats);
var reviews_routes_default = router3;

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
var getAllUsers = async (page, limit, role) => {
  const queryOptions = {
    where: role ? { role } : {},
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      sessions: true,
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
    prisma.user.count({ where: role ? { role } : {} })
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
var getUserCounts = async () => {
  const [adminCount, studentCount, tutorCount, totalCount] = await Promise.all([
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TUTOR" } }),
    prisma.user.count()
    // Total count of all users
  ]);
  return {
    admin: adminCount,
    student: studentCount,
    teacher: tutorCount,
    // Labeled as teacher per user request
    total: totalCount
  };
};
var userService = {
  getUserCounts,
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
    const limit = req.query.limit !== void 0 ? Number(req.query.limit) : 8;
    const page = Number(req.query.page) || 1;
    const role = req.query.role;
    const result = await userService.getAllUsers(page, limit, role);
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
var getUserCountsController = async (req, res, next) => {
  try {
    const counts = await userService.getUserCounts();
    res.status(200).json({
      success: true,
      ...counts
    });
  } catch (error) {
    next(error);
  }
};

// src/users/users.routes.ts
var userrouter = Router7();
userrouter.get("/", getAllUsersController);
userrouter.get("/counts", getUserCountsController);
userrouter.get("/count", getUserCountsController);
userrouter.post("/update-status", toggleTutorBanStatus);
userrouter.patch("/update/:id", updateUser2);
userrouter.get("/:id", getUserByIdController);
userrouter.patch("/:id", updateUserController);
var users_routes_default = userrouter;

// src/routes/webhook.routes.ts
import express2 from "express";
var router4 = express2.Router();
router4.post(
  "/stripe",
  express2.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`\u274C Webhook Signature Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      const paidAmount = session.amount_total ? session.amount_total / 100 : 0;
      const stripeSessionId = session.id;
      if (!bookingId) {
        console.error("\u274C No bookingId found in session metadata");
        return res.status(400).json({ error: "Missing metadata" });
      }
      console.log(`\u{1F514} Payment of $${paidAmount} received for Booking: ${bookingId}`);
      try {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: "CONFIRMED",
            // This is the fix: it updates the related availability slot to true
            availability: {
              update: {
                isBooked: true
              }
            }
          }
        });
        await prisma.payment.create({
          data: {
            bookingId,
            stripeSessionId,
            amount: paidAmount,
            status: "PAID"
          }
        }).catch(() => console.log("Payment record already exists or table deleted."));
        console.log(`\u2705 Database synced for Booking ${bookingId} and Slot marked as Booked`);
      } catch (error) {
        console.error("\u274C Database update failed:", error);
        return res.status(500).json({ error: "Database update failed" });
      }
    }
    res.status(200).json({ received: true });
  }
);
var webhook_routes_default = router4;

// src/routes/sessionResource.route.ts
import { Router as Router8 } from "express";

// src/lib/gemini.ts
import { GoogleGenerativeAI as GoogleGenerativeAI2 } from "@google/generative-ai";
var apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}
var genAI2 = new GoogleGenerativeAI2(apiKey);
var model = genAI2.getGenerativeModel({
  model: "gemini-2.5-flash-lite"
});
var generateQuizFromTranscript = async (transcript) => {
  const prompt = `Generate a 5-question multiple-choice quiz based on the following transcript. 
  Return the output in a clean JSON format for UI rendering. 
  
  Transcript:
  "${transcript}"

  Structure:
  {
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "answer": 0 // index of the correct option (0-3)
      }
    ]
  }`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to generate valid JSON from Gemini");
  }
  return JSON.parse(jsonMatch[0]);
};
var generateSummaryFromTranscript = async (transcript) => {
  const prompt = `Generate a structured summary and study notes based on the following transcript. 
  Organize the content into logical sections with clear, descriptive "Note Topic" headings. 
  Under each heading, provide a list of key points and detailed notes.
  Return the output in a clean JSON format for UI rendering. 
  
  Transcript:
  "${transcript}"

  Structure:
  {
    "topics": [
      {
        "heading": "string",
        "notes": ["string", "string", "string"]
      }
    ]
  }`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to generate valid JSON summary from Gemini");
  }
  return JSON.parse(jsonMatch[0]);
};

// src/routes/sessionResource.route.ts
var router5 = Router8();
router5.get("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const resource = await prisma.sessionResource.findUnique({
      where: { bookingId }
    });
    if (!resource) {
      return res.status(404).json({ message: "No resources found for this session." });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router5.post("/transcript", async (req, res) => {
  try {
    const { bookingId, transcriptText } = req.body;
    if (!bookingId || !transcriptText) {
      return res.status(400).json({ message: "Booking ID and transcript text are required." });
    }
    const resource = await prisma.sessionResource.upsert({
      where: { bookingId },
      update: { transcriptText },
      create: { bookingId, transcriptText }
    });
    res.json(resource);
  } catch (error) {
    console.error("Transcript upload error:", error);
    res.status(500).json({ error: error.message });
  }
});
router5.post("/generate-quiz", async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required." });
    }
    const resource = await prisma.sessionResource.findUnique({
      where: { bookingId }
    });
    if (!resource || !resource.transcriptText) {
      return res.status(404).json({ message: "Transcript not found. Please upload a transcript first." });
    }
    const quizData = await generateQuizFromTranscript(resource.transcriptText);
    const updatedResource = await prisma.sessionResource.update({
      where: { bookingId },
      data: { quizData }
    });
    res.json(updatedResource);
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: "Failed to generate quiz. " + error.message });
  }
});
router5.post("/generate-summary", async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required." });
    }
    const resource = await prisma.sessionResource.findUnique({
      where: { bookingId }
    });
    if (!resource || !resource.transcriptText) {
      return res.status(404).json({ message: "Transcript not found. Please upload a transcript first." });
    }
    const summaryData = await generateSummaryFromTranscript(resource.transcriptText);
    res.json(summaryData);
  } catch (error) {
    console.error("Summary generation error:", error);
    res.status(500).json({ error: "Failed to generate summary. " + error.message });
  }
});
var sessionResource_route_default = router5;

// src/app.ts
dotenv.config();
var app = express3();
app.set("trust proxy", 1);
var allowedOrigins = [
  process.env.APP_URL,
  "http://localhost:3000",
  "http://localhost:5000"
].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"]
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/webhooks", webhook_routes_default);
app.use(express3.json());
app.use(express3.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("SkillBridge API is running...");
});
app.use("/api", chat_route_default);
app.use("/api/categories", categories_routes_default);
app.use("/api/tutor", tutors_routes_default);
app.use("/api/support", supportemail_default);
app.use("/api/availability", availability_routes_default);
app.use("/api/bookings", bookings_routes_default);
app.use("/api/reviews", reviews_routes_default);
app.use("/api/users", users_routes_default);
app.use("/api/session-resources", sessionResource_route_default);
app.use(notFound);
app.use(globalErrorHandler_default);
var app_default = app;

// src/index.ts
prisma.$connect().then(() => {
  console.log("Database connected successfully.");
}).catch((err) => {
  console.error("Database connection failed:", err);
});
var index_default = app_default;
export {
  index_default as default
};
