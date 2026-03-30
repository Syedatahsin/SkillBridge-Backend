var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import cors from "cors";
import express2 from "express";
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
  "clientVersion": "7.6.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id                String        @id\n  name              String\n  email             String        @unique\n  emailVerified     Boolean       @default(false)\n  image             String?\n  createdAt         DateTime      @default(now())\n  updatedAt         DateTime      @updatedAt\n  role              String\n  status            String\n  bookingsAsStudent Booking[]     @relation("StudentBookings")\n  reviews           Review[]\n  tutorProfile      TutorProfile?\n  accounts          Account[]\n  sessions          Session[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel TutorProfile {\n  id           String          @id @default(uuid())\n  userId       String          @unique\n  bio          String\n  experience   Int\n  pricePerHour Float\n  isFeatured   Boolean         @default(false)\n  createdAt    DateTime        @default(now())\n  updatedAt    DateTime        @updatedAt\n  availability Availability[]\n  bookings     Booking[]\n  reviews      Review[]\n  categories   TutorCategory[]\n  user         User            @relation(fields: [userId], references: [id])\n}\n\nmodel Category {\n  id                String          @id @default(uuid())\n  name              String          @unique\n  description       String?\n  createdAt         DateTime        @default(now())\n  bankAccountNumber String? // Added as optional to avoid migration errors\n  tutors            TutorCategory[]\n}\n\nmodel TutorCategory {\n  tutorId    String\n  categoryId String\n  category   Category     @relation(fields: [categoryId], references: [id])\n  tutor      TutorProfile @relation(fields: [tutorId], references: [id])\n\n  @@id([tutorId, categoryId])\n}\n\nmodel Availability {\n  id        String       @id @default(uuid())\n  tutorId   String\n  startTime DateTime\n  endTime   DateTime\n  isBooked  Boolean      @default(false)\n  createdAt DateTime     @default(now())\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id])\n  booking   Booking?\n}\n\nmodel Booking {\n  id             String        @id @default(uuid())\n  studentId      String\n  tutorId        String\n  availabilityId String        @unique\n  meetingLink    String?\n  status         BookingStatus @default(PENDING)\n  createdAt      DateTime      @default(now())\n  availability   Availability  @relation(fields: [availabilityId], references: [id])\n  student        User          @relation("StudentBookings", fields: [studentId], references: [id])\n  tutor          TutorProfile  @relation(fields: [tutorId], references: [id])\n  payment        Payment?\n  review         Review?\n}\n\nmodel Payment {\n  id              String   @id @default(uuid())\n  bookingId       String   @unique\n  stripeSessionId String   @unique\n  amount          Float\n  status          String\n  createdAt       DateTime @default(now())\n  updatedAt       DateTime @updatedAt\n  booking         Booking  @relation(fields: [bookingId], references: [id])\n}\n\nmodel Review {\n  id        String       @id @default(uuid())\n  bookingId String       @unique\n  studentId String\n  tutorId   String\n  rating    Int\n  comment   String?\n  createdAt DateTime     @default(now())\n  booking   Booking      @relation(fields: [bookingId], references: [id])\n  student   User         @relation(fields: [studentId], references: [id])\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id])\n}\n\nenum BookingStatus {\n  PENDING\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"bookingsAsStudent","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"pricePerHour","kind":"scalar","type":"Float"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"bankAccountNumber","kind":"scalar","type":"String"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"}],"dbName":null},"TutorCategory":{"fields":[{"name":"tutorId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"booking","kind":"object","type":"Booking","relationName":"AvailabilityToBooking"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"meetingLink","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToBooking"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","availability","bookings","booking","student","tutor","reviews","tutors","_count","category","categories","user","payment","review","bookingsAsStudent","tutorProfile","accounts","sessions","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","TutorProfile.findUnique","TutorProfile.findUniqueOrThrow","TutorProfile.findFirst","TutorProfile.findFirstOrThrow","TutorProfile.findMany","TutorProfile.createOne","TutorProfile.createMany","TutorProfile.createManyAndReturn","TutorProfile.updateOne","TutorProfile.updateMany","TutorProfile.updateManyAndReturn","TutorProfile.upsertOne","TutorProfile.deleteOne","TutorProfile.deleteMany","_avg","_sum","TutorProfile.groupBy","TutorProfile.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","TutorCategory.findUnique","TutorCategory.findUniqueOrThrow","TutorCategory.findFirst","TutorCategory.findFirstOrThrow","TutorCategory.findMany","TutorCategory.createOne","TutorCategory.createMany","TutorCategory.createManyAndReturn","TutorCategory.updateOne","TutorCategory.updateMany","TutorCategory.updateManyAndReturn","TutorCategory.upsertOne","TutorCategory.deleteOne","TutorCategory.deleteMany","TutorCategory.groupBy","TutorCategory.aggregate","Availability.findUnique","Availability.findUniqueOrThrow","Availability.findFirst","Availability.findFirstOrThrow","Availability.findMany","Availability.createOne","Availability.createMany","Availability.createManyAndReturn","Availability.updateOne","Availability.updateMany","Availability.updateManyAndReturn","Availability.upsertOne","Availability.deleteOne","Availability.deleteMany","Availability.groupBy","Availability.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","bookingId","studentId","tutorId","rating","comment","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","stripeSessionId","amount","status","updatedAt","availabilityId","meetingLink","BookingStatus","startTime","endTime","isBooked","categoryId","name","description","bankAccountNumber","every","some","none","userId","bio","experience","pricePerHour","isFeatured","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","tutorId_categoryId","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "ogVisAERCAAA1AIAIBAAANMCACARAADfAgAgEgAA4AIAIBMAAOECACDMAQAA3gIAMM0BAAAuABDOAQAA3gIAMM8BAQAAAAHVAUAAvwIAIeMBAQC-AgAh5AFAAL8CACHsAQEAvgIAIYYCAQAAAAGHAiAA0QIAIYgCAQDMAgAhiQIBAL4CACEBAAAAAQAgDwMAAO4CACAGAADVAgAgBwAA6AIAIA4AAO8CACAPAADwAgAgzAEAAOwCADDNAQAAAwAQzgEAAOwCADDPAQEAvgIAIdEBAQC-AgAh0gEBAL4CACHVAUAAvwIAIeMBAADtAugBIuUBAQC-AgAh5gEBAMwCACEGAwAA1gQAIAYAAIcEACAHAADSBAAgDgAA1wQAIA8AANgEACDmAQAA8QIAIA8DAADuAgAgBgAA1QIAIAcAAOgCACAOAADvAgAgDwAA8AIAIMwBAADsAgAwzQEAAAMAEM4BAADsAgAwzwEBAAAAAdEBAQC-AgAh0gEBAL4CACHVAUAAvwIAIeMBAADtAugBIuUBAQAAAAHmAQEAzAIAIQMAAAADACABAAAEADACAAAFACALBQAA6wIAIAcAAOgCACDMAQAA6gIAMM0BAAAHABDOAQAA6gIAMM8BAQC-AgAh0gEBAL4CACHVAUAAvwIAIegBQAC_AgAh6QFAAL8CACHqASAA0QIAIQIFAACJAwAgBwAA0gQAIAsFAADrAgAgBwAA6AIAIMwBAADqAgAwzQEAAAcAEM4BAADqAgAwzwEBAAAAAdIBAQC-AgAh1QFAAL8CACHoAUAAvwIAIekBQAC_AgAh6gEgANECACEDAAAABwAgAQAACAAwAgAACQAgAwAAAAMAIAEAAAQAMAIAAAUAIA0FAADAAgAgBgAA1QIAIAcAAOgCACDMAQAA6QIAMM0BAAAMABDOAQAA6QIAMM8BAQC-AgAh0AEBAL4CACHRAQEAvgIAIdIBAQC-AgAh0wECANACACHUAQEAzAIAIdUBQAC_AgAhBAUAAIkDACAGAACHBAAgBwAA0gQAINQBAADxAgAgDQUAAMACACAGAADVAgAgBwAA6AIAIMwBAADpAgAwzQEAAAwAEM4BAADpAgAwzwEBAAAAAdABAQAAAAHRAQEAvgIAIdIBAQC-AgAh0wECANACACHUAQEAzAIAIdUBQAC_AgAhAwAAAAwAIAEAAA0AMAIAAA4AIAcHAADoAgAgCwAA5wIAIMwBAADmAgAwzQEAABAAEM4BAADmAgAw0gEBAL4CACHrAQEAvgIAIQIHAADSBAAgCwAA1QQAIAgHAADoAgAgCwAA5wIAIMwBAADmAgAwzQEAABAAEM4BAADmAgAw0gEBAL4CACHrAQEAvgIAIYoCAADlAgAgAwAAABAAIAEAABEAMAIAABIAIAMAAAAQACABAAARADACAAASACABAAAAEAAgAQAAAAcAIAEAAAADACABAAAADAAgAQAAABAAIAEAAAADACALBQAAwAIAIMwBAAC8AgAwzQEAABsAEM4BAAC8AgAwzwEBAL4CACHQAQEAvgIAIdUBQAC_AgAh4QEBAL4CACHiAQgAvQIAIeMBAQC-AgAh5AFAAL8CACEBAAAAGwAgAQAAAAwAIAMAAAAMACABAAANADACAAAOACAQAwAA0gIAIAQAANMCACAIAADUAgAgDAAAzQIAIA0AANUCACDMAQAAzwIAMM0BAAAfABDOAQAAzwIAMM8BAQC-AgAh1QFAAL8CACHkAUAAvwIAIfIBAQC-AgAh8wEBAL4CACH0AQIA0AIAIfUBCAC9AgAh9gEgANECACEBAAAAHwAgEQ0AANUCACDMAQAA4wIAMM0BAAAhABDOAQAA4wIAMM8BAQC-AgAh1QFAAL8CACHkAUAAvwIAIfIBAQC-AgAh-gEBAL4CACH7AQEAvgIAIfwBAQDMAgAh_QEBAMwCACH-AQEAzAIAIf8BQADkAgAhgAJAAOQCACGBAgEAzAIAIYICAQDMAgAhCA0AAIcEACD8AQAA8QIAIP0BAADxAgAg_gEAAPECACD_AQAA8QIAIIACAADxAgAggQIAAPECACCCAgAA8QIAIBENAADVAgAgzAEAAOMCADDNAQAAIQAQzgEAAOMCADDPAQEAAAAB1QFAAL8CACHkAUAAvwIAIfIBAQC-AgAh-gEBAL4CACH7AQEAvgIAIfwBAQDMAgAh_QEBAMwCACH-AQEAzAIAIf8BQADkAgAhgAJAAOQCACGBAgEAzAIAIYICAQDMAgAhAwAAACEAIAEAACIAMAIAACMAIAwNAADVAgAgzAEAAOICADDNAQAAJQAQzgEAAOICADDPAQEAvgIAIdUBQAC_AgAh5AFAAL8CACHyAQEAvgIAIfkBQAC_AgAhgwIBAL4CACGEAgEAzAIAIYUCAQDMAgAhAw0AAIcEACCEAgAA8QIAIIUCAADxAgAgDA0AANUCACDMAQAA4gIAMM0BAAAlABDOAQAA4gIAMM8BAQAAAAHVAUAAvwIAIeQBQAC_AgAh8gEBAL4CACH5AUAAvwIAIYMCAQAAAAGEAgEAzAIAIYUCAQDMAgAhAwAAACUAIAEAACYAMAIAACcAIAEAAAADACABAAAADAAgAQAAACEAIAEAAAAlACABAAAAAQAgEQgAANQCACAQAADTAgAgEQAA3wIAIBIAAOACACATAADhAgAgzAEAAN4CADDNAQAALgAQzgEAAN4CADDPAQEAvgIAIdUBQAC_AgAh4wEBAL4CACHkAUAAvwIAIewBAQC-AgAhhgIBAL4CACGHAiAA0QIAIYgCAQDMAgAhiQIBAL4CACEGCAAAhgQAIBAAAIUEACARAADSBAAgEgAA0wQAIBMAANQEACCIAgAA8QIAIAMAAAAuACABAAAvADACAAABACADAAAALgAgAQAALwAwAgAAAQAgAwAAAC4AIAEAAC8AMAIAAAEAIA4IAADOBAAgEAAAzQQAIBEAAM8EACASAADQBAAgEwAA0QQAIM8BAQAAAAHVAUAAAAAB4wEBAAAAAeQBQAAAAAHsAQEAAAABhgIBAAAAAYcCIAAAAAGIAgEAAAABiQIBAAAAAQEZAAAzACAJzwEBAAAAAdUBQAAAAAHjAQEAAAAB5AFAAAAAAewBAQAAAAGGAgEAAAABhwIgAAAAAYgCAQAAAAGJAgEAAAABARkAADUAMAEZAAA1ADAOCAAAmgQAIBAAAJkEACARAACbBAAgEgAAnAQAIBMAAJ0EACDPAQEA9wIAIdUBQAD6AgAh4wEBAPcCACHkAUAA-gIAIewBAQD3AgAhhgIBAPcCACGHAiAApQMAIYgCAQD5AgAhiQIBAPcCACECAAAAAQAgGQAAOAAgCc8BAQD3AgAh1QFAAPoCACHjAQEA9wIAIeQBQAD6AgAh7AEBAPcCACGGAgEA9wIAIYcCIAClAwAhiAIBAPkCACGJAgEA9wIAIQIAAAAuACAZAAA6ACACAAAALgAgGQAAOgAgAwAAAAEAICAAADMAICEAADgAIAEAAAABACABAAAALgAgBAoAAJYEACAmAACYBAAgJwAAlwQAIIgCAADxAgAgDMwBAADdAgAwzQEAAEEAEM4BAADdAgAwzwEBAKsCACHVAUAArgIAIeMBAQCrAgAh5AFAAK4CACHsAQEAqwIAIYYCAQCrAgAhhwIgAMYCACGIAgEArQIAIYkCAQCrAgAhAwAAAC4AIAEAAEAAMCUAAEEAIAMAAAAuACABAAAvADACAAABACABAAAAJwAgAQAAACcAIAMAAAAlACABAAAmADACAAAnACADAAAAJQAgAQAAJgAwAgAAJwAgAwAAACUAIAEAACYAMAIAACcAIAkNAACVBAAgzwEBAAAAAdUBQAAAAAHkAUAAAAAB8gEBAAAAAfkBQAAAAAGDAgEAAAABhAIBAAAAAYUCAQAAAAEBGQAASQAgCM8BAQAAAAHVAUAAAAAB5AFAAAAAAfIBAQAAAAH5AUAAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABARkAAEsAMAEZAABLADAJDQAAlAQAIM8BAQD3AgAh1QFAAPoCACHkAUAA-gIAIfIBAQD3AgAh-QFAAPoCACGDAgEA9wIAIYQCAQD5AgAhhQIBAPkCACECAAAAJwAgGQAATgAgCM8BAQD3AgAh1QFAAPoCACHkAUAA-gIAIfIBAQD3AgAh-QFAAPoCACGDAgEA9wIAIYQCAQD5AgAhhQIBAPkCACECAAAAJQAgGQAAUAAgAgAAACUAIBkAAFAAIAMAAAAnACAgAABJACAhAABOACABAAAAJwAgAQAAACUAIAUKAACRBAAgJgAAkwQAICcAAJIEACCEAgAA8QIAIIUCAADxAgAgC8wBAADcAgAwzQEAAFcAEM4BAADcAgAwzwEBAKsCACHVAUAArgIAIeQBQACuAgAh8gEBAKsCACH5AUAArgIAIYMCAQCrAgAhhAIBAK0CACGFAgEArQIAIQMAAAAlACABAABWADAlAABXACADAAAAJQAgAQAAJgAwAgAAJwAgAQAAACMAIAEAAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAAhACABAAAiADACAAAjACAODQAAkAQAIM8BAQAAAAHVAUAAAAAB5AFAAAAAAfIBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BQAAAAAGAAkAAAAABgQIBAAAAAYICAQAAAAEBGQAAXwAgDc8BAQAAAAHVAUAAAAAB5AFAAAAAAfIBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BQAAAAAGAAkAAAAABgQIBAAAAAYICAQAAAAEBGQAAYQAwARkAAGEAMA4NAACPBAAgzwEBAPcCACHVAUAA-gIAIeQBQAD6AgAh8gEBAPcCACH6AQEA9wIAIfsBAQD3AgAh_AEBAPkCACH9AQEA-QIAIf4BAQD5AgAh_wFAAI4EACGAAkAAjgQAIYECAQD5AgAhggIBAPkCACECAAAAIwAgGQAAZAAgDc8BAQD3AgAh1QFAAPoCACHkAUAA-gIAIfIBAQD3AgAh-gEBAPcCACH7AQEA9wIAIfwBAQD5AgAh_QEBAPkCACH-AQEA-QIAIf8BQACOBAAhgAJAAI4EACGBAgEA-QIAIYICAQD5AgAhAgAAACEAIBkAAGYAIAIAAAAhACAZAABmACADAAAAIwAgIAAAXwAgIQAAZAAgAQAAACMAIAEAAAAhACAKCgAAiwQAICYAAI0EACAnAACMBAAg_AEAAPECACD9AQAA8QIAIP4BAADxAgAg_wEAAPECACCAAgAA8QIAIIECAADxAgAgggIAAPECACAQzAEAANgCADDNAQAAbQAQzgEAANgCADDPAQEAqwIAIdUBQACuAgAh5AFAAK4CACHyAQEAqwIAIfoBAQCrAgAh-wEBAKsCACH8AQEArQIAIf0BAQCtAgAh_gEBAK0CACH_AUAA2QIAIYACQADZAgAhgQIBAK0CACGCAgEArQIAIQMAAAAhACABAABsADAlAABtACADAAAAIQAgAQAAIgAwAgAAIwAgCcwBAADXAgAwzQEAAHMAEM4BAADXAgAwzwEBAAAAAdUBQAC_AgAh5AFAAL8CACH3AQEAvgIAIfgBAQC-AgAh-QFAAL8CACEBAAAAcAAgAQAAAHAAIAnMAQAA1wIAMM0BAABzABDOAQAA1wIAMM8BAQC-AgAh1QFAAL8CACHkAUAAvwIAIfcBAQC-AgAh-AEBAL4CACH5AUAAvwIAIQADAAAAcwAgAQAAdAAwAgAAcAAgAwAAAHMAIAEAAHQAMAIAAHAAIAMAAABzACABAAB0ADACAABwACAGzwEBAAAAAdUBQAAAAAHkAUAAAAAB9wEBAAAAAfgBAQAAAAH5AUAAAAABARkAAHgAIAbPAQEAAAAB1QFAAAAAAeQBQAAAAAH3AQEAAAAB-AEBAAAAAfkBQAAAAAEBGQAAegAwARkAAHoAMAbPAQEA9wIAIdUBQAD6AgAh5AFAAPoCACH3AQEA9wIAIfgBAQD3AgAh-QFAAPoCACECAAAAcAAgGQAAfQAgBs8BAQD3AgAh1QFAAPoCACHkAUAA-gIAIfcBAQD3AgAh-AEBAPcCACH5AUAA-gIAIQIAAABzACAZAAB_ACACAAAAcwAgGQAAfwAgAwAAAHAAICAAAHgAICEAAH0AIAEAAABwACABAAAAcwAgAwoAAIgEACAmAACKBAAgJwAAiQQAIAnMAQAA1gIAMM0BAACGAQAQzgEAANYCADDPAQEAqwIAIdUBQACuAgAh5AFAAK4CACH3AQEAqwIAIfgBAQCrAgAh-QFAAK4CACEDAAAAcwAgAQAAhQEAMCUAAIYBACADAAAAcwAgAQAAdAAwAgAAcAAgEAMAANICACAEAADTAgAgCAAA1AIAIAwAAM0CACANAADVAgAgzAEAAM8CADDNAQAAHwAQzgEAAM8CADDPAQEAAAAB1QFAAL8CACHkAUAAvwIAIfIBAQAAAAHzAQEAvgIAIfQBAgDQAgAh9QEIAL0CACH2ASAA0QIAIQEAAACJAQAgAQAAAIkBACAFAwAAhAQAIAQAAIUEACAIAACGBAAgDAAAxwMAIA0AAIcEACADAAAAHwAgAQAAjAEAMAIAAIkBACADAAAAHwAgAQAAjAEAMAIAAIkBACADAAAAHwAgAQAAjAEAMAIAAIkBACANAwAA_wMAIAQAAIAEACAIAACBBAAgDAAAggQAIA0AAIMEACDPAQEAAAAB1QFAAAAAAeQBQAAAAAHyAQEAAAAB8wEBAAAAAfQBAgAAAAH1AQgAAAAB9gEgAAAAAQEZAACQAQAgCM8BAQAAAAHVAUAAAAAB5AFAAAAAAfIBAQAAAAHzAQEAAAAB9AECAAAAAfUBCAAAAAH2ASAAAAABARkAAJIBADABGQAAkgEAMA0DAADNAwAgBAAAzgMAIAgAAM8DACAMAADQAwAgDQAA0QMAIM8BAQD3AgAh1QFAAPoCACHkAUAA-gIAIfIBAQD3AgAh8wEBAPcCACH0AQIA-AIAIfUBCACGAwAh9gEgAKUDACECAAAAiQEAIBkAAJUBACAIzwEBAPcCACHVAUAA-gIAIeQBQAD6AgAh8gEBAPcCACHzAQEA9wIAIfQBAgD4AgAh9QEIAIYDACH2ASAApQMAIQIAAAAfACAZAACXAQAgAgAAAB8AIBkAAJcBACADAAAAiQEAICAAAJABACAhAACVAQAgAQAAAIkBACABAAAAHwAgBQoAAMgDACAmAADLAwAgJwAAygMAIGgAAMkDACBpAADMAwAgC8wBAADOAgAwzQEAAJ4BABDOAQAAzgIAMM8BAQCrAgAh1QFAAK4CACHkAUAArgIAIfIBAQCrAgAh8wEBAKsCACH0AQIArAIAIfUBCAC6AgAh9gEgAMYCACEDAAAAHwAgAQAAnQEAMCUAAJ4BACADAAAAHwAgAQAAjAEAMAIAAIkBACAJCQAAzQIAIMwBAADLAgAwzQEAAKQBABDOAQAAywIAMM8BAQAAAAHVAUAAvwIAIewBAQAAAAHtAQEAzAIAIe4BAQDMAgAhAQAAAKEBACABAAAAoQEAIAkJAADNAgAgzAEAAMsCADDNAQAApAEAEM4BAADLAgAwzwEBAL4CACHVAUAAvwIAIewBAQC-AgAh7QEBAMwCACHuAQEAzAIAIQMJAADHAwAg7QEAAPECACDuAQAA8QIAIAMAAACkAQAgAQAApQEAMAIAAKEBACADAAAApAEAIAEAAKUBADACAAChAQAgAwAAAKQBACABAAClAQAwAgAAoQEAIAYJAADGAwAgzwEBAAAAAdUBQAAAAAHsAQEAAAAB7QEBAAAAAe4BAQAAAAEBGQAAqQEAIAXPAQEAAAAB1QFAAAAAAewBAQAAAAHtAQEAAAAB7gEBAAAAAQEZAACrAQAwARkAAKsBADAGCQAAuQMAIM8BAQD3AgAh1QFAAPoCACHsAQEA9wIAIe0BAQD5AgAh7gEBAPkCACECAAAAoQEAIBkAAK4BACAFzwEBAPcCACHVAUAA-gIAIewBAQD3AgAh7QEBAPkCACHuAQEA-QIAIQIAAACkAQAgGQAAsAEAIAIAAACkAQAgGQAAsAEAIAMAAAChAQAgIAAAqQEAICEAAK4BACABAAAAoQEAIAEAAACkAQAgBQoAALYDACAmAAC4AwAgJwAAtwMAIO0BAADxAgAg7gEAAPECACAIzAEAAMoCADDNAQAAtwEAEM4BAADKAgAwzwEBAKsCACHVAUAArgIAIewBAQCrAgAh7QEBAK0CACHuAQEArQIAIQMAAACkAQAgAQAAtgEAMCUAALcBACADAAAApAEAIAEAAKUBADACAAChAQAgAQAAABIAIAEAAAASACADAAAAEAAgAQAAEQAwAgAAEgAgAwAAABAAIAEAABEAMAIAABIAIAMAAAAQACABAAARADACAAASACAEBwAAtQMAIAsAALQDACDSAQEAAAAB6wEBAAAAAQEZAAC_AQAgAtIBAQAAAAHrAQEAAAABARkAAMEBADABGQAAwQEAMAQHAACzAwAgCwAAsgMAINIBAQD3AgAh6wEBAPcCACECAAAAEgAgGQAAxAEAIALSAQEA9wIAIesBAQD3AgAhAgAAABAAIBkAAMYBACACAAAAEAAgGQAAxgEAIAMAAAASACAgAAC_AQAgIQAAxAEAIAEAAAASACABAAAAEAAgAwoAAK8DACAmAACxAwAgJwAAsAMAIAXMAQAAyQIAMM0BAADNAQAQzgEAAMkCADDSAQEAqwIAIesBAQCrAgAhAwAAABAAIAEAAMwBADAlAADNAQAgAwAAABAAIAEAABEAMAIAABIAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgCAUAAK4DACAHAACtAwAgzwEBAAAAAdIBAQAAAAHVAUAAAAAB6AFAAAAAAekBQAAAAAHqASAAAAABARkAANUBACAGzwEBAAAAAdIBAQAAAAHVAUAAAAAB6AFAAAAAAekBQAAAAAHqASAAAAABARkAANcBADABGQAA1wEAMAgFAACnAwAgBwAApgMAIM8BAQD3AgAh0gEBAPcCACHVAUAA-gIAIegBQAD6AgAh6QFAAPoCACHqASAApQMAIQIAAAAJACAZAADaAQAgBs8BAQD3AgAh0gEBAPcCACHVAUAA-gIAIegBQAD6AgAh6QFAAPoCACHqASAApQMAIQIAAAAHACAZAADcAQAgAgAAAAcAIBkAANwBACADAAAACQAgIAAA1QEAICEAANoBACABAAAACQAgAQAAAAcAIAMKAACiAwAgJgAApAMAICcAAKMDACAJzAEAAMUCADDNAQAA4wEAEM4BAADFAgAwzwEBAKsCACHSAQEAqwIAIdUBQACuAgAh6AFAAK4CACHpAUAArgIAIeoBIADGAgAhAwAAAAcAIAEAAOIBADAlAADjAQAgAwAAAAcAIAEAAAgAMAIAAAkAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgDAMAAJ0DACAGAACeAwAgBwAAnwMAIA4AAKADACAPAAChAwAgzwEBAAAAAdEBAQAAAAHSAQEAAAAB1QFAAAAAAeMBAAAA6AEC5QEBAAAAAeYBAQAAAAEBGQAA6wEAIAfPAQEAAAAB0QEBAAAAAdIBAQAAAAHVAUAAAAAB4wEAAADoAQLlAQEAAAAB5gEBAAAAAQEZAADtAQAwARkAAO0BADAMAwAAjgMAIAYAAI8DACAHAACQAwAgDgAAkQMAIA8AAJIDACDPAQEA9wIAIdEBAQD3AgAh0gEBAPcCACHVAUAA-gIAIeMBAACNA-gBIuUBAQD3AgAh5gEBAPkCACECAAAABQAgGQAA8AEAIAfPAQEA9wIAIdEBAQD3AgAh0gEBAPcCACHVAUAA-gIAIeMBAACNA-gBIuUBAQD3AgAh5gEBAPkCACECAAAAAwAgGQAA8gEAIAIAAAADACAZAADyAQAgAwAAAAUAICAAAOsBACAhAADwAQAgAQAAAAUAIAEAAAADACAECgAAigMAICYAAIwDACAnAACLAwAg5gEAAPECACAKzAEAAMECADDNAQAA-QEAEM4BAADBAgAwzwEBAKsCACHRAQEAqwIAIdIBAQCrAgAh1QFAAK4CACHjAQAAwgLoASLlAQEAqwIAIeYBAQCtAgAhAwAAAAMAIAEAAPgBADAlAAD5AQAgAwAAAAMAIAEAAAQAMAIAAAUAIAsFAADAAgAgzAEAALwCADDNAQAAGwAQzgEAALwCADDPAQEAAAAB0AEBAAAAAdUBQAC_AgAh4QEBAAAAAeIBCAC9AgAh4wEBAL4CACHkAUAAvwIAIQEAAAD8AQAgAQAAAPwBACABBQAAiQMAIAMAAAAbACABAAD_AQAwAgAA_AEAIAMAAAAbACABAAD_AQAwAgAA_AEAIAMAAAAbACABAAD_AQAwAgAA_AEAIAgFAACIAwAgzwEBAAAAAdABAQAAAAHVAUAAAAAB4QEBAAAAAeIBCAAAAAHjAQEAAAAB5AFAAAAAAQEZAACDAgAgB88BAQAAAAHQAQEAAAAB1QFAAAAAAeEBAQAAAAHiAQgAAAAB4wEBAAAAAeQBQAAAAAEBGQAAhQIAMAEZAACFAgAwCAUAAIcDACDPAQEA9wIAIdABAQD3AgAh1QFAAPoCACHhAQEA9wIAIeIBCACGAwAh4wEBAPcCACHkAUAA-gIAIQIAAAD8AQAgGQAAiAIAIAfPAQEA9wIAIdABAQD3AgAh1QFAAPoCACHhAQEA9wIAIeIBCACGAwAh4wEBAPcCACHkAUAA-gIAIQIAAAAbACAZAACKAgAgAgAAABsAIBkAAIoCACADAAAA_AEAICAAAIMCACAhAACIAgAgAQAAAPwBACABAAAAGwAgBQoAAIEDACAmAACEAwAgJwAAgwMAIGgAAIIDACBpAACFAwAgCswBAAC5AgAwzQEAAJECABDOAQAAuQIAMM8BAQCrAgAh0AEBAKsCACHVAUAArgIAIeEBAQCrAgAh4gEIALoCACHjAQEAqwIAIeQBQACuAgAhAwAAABsAIAEAAJACADAlAACRAgAgAwAAABsAIAEAAP8BADACAAD8AQAgAQAAAA4AIAEAAAAOACADAAAADAAgAQAADQAwAgAADgAgAwAAAAwAIAEAAA0AMAIAAA4AIAMAAAAMACABAAANADACAAAOACAKBQAA_gIAIAYAAP8CACAHAACAAwAgzwEBAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAgAAAAHUAQEAAAAB1QFAAAAAAQEZAACZAgAgB88BAQAAAAHQAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQIAAAAB1AEBAAAAAdUBQAAAAAEBGQAAmwIAMAEZAACbAgAwCgUAAPsCACAGAAD8AgAgBwAA_QIAIM8BAQD3AgAh0AEBAPcCACHRAQEA9wIAIdIBAQD3AgAh0wECAPgCACHUAQEA-QIAIdUBQAD6AgAhAgAAAA4AIBkAAJ4CACAHzwEBAPcCACHQAQEA9wIAIdEBAQD3AgAh0gEBAPcCACHTAQIA-AIAIdQBAQD5AgAh1QFAAPoCACECAAAADAAgGQAAoAIAIAIAAAAMACAZAACgAgAgAwAAAA4AICAAAJkCACAhAACeAgAgAQAAAA4AIAEAAAAMACAGCgAA8gIAICYAAPUCACAnAAD0AgAgaAAA8wIAIGkAAPYCACDUAQAA8QIAIArMAQAAqgIAMM0BAACnAgAQzgEAAKoCADDPAQEAqwIAIdABAQCrAgAh0QEBAKsCACHSAQEAqwIAIdMBAgCsAgAh1AEBAK0CACHVAUAArgIAIQMAAAAMACABAACmAgAwJQAApwIAIAMAAAAMACABAAANADACAAAOACAKzAEAAKoCADDNAQAApwIAEM4BAACqAgAwzwEBAKsCACHQAQEAqwIAIdEBAQCrAgAh0gEBAKsCACHTAQIArAIAIdQBAQCtAgAh1QFAAK4CACEOCgAAsAIAICYAALgCACAnAAC4AgAg1gEBAAAAAdcBAQAAAATYAQEAAAAE2QEBAAAAAdoBAQAAAAHbAQEAAAAB3AEBAAAAAd0BAQC3AgAh3gEBAAAAAd8BAQAAAAHgAQEAAAABDQoAALACACAmAACwAgAgJwAAsAIAIGgAALYCACBpAACwAgAg1gECAAAAAdcBAgAAAATYAQIAAAAE2QECAAAAAdoBAgAAAAHbAQIAAAAB3AECAAAAAd0BAgC1AgAhDgoAALMCACAmAAC0AgAgJwAAtAIAINYBAQAAAAHXAQEAAAAF2AEBAAAABdkBAQAAAAHaAQEAAAAB2wEBAAAAAdwBAQAAAAHdAQEAsgIAId4BAQAAAAHfAQEAAAAB4AEBAAAAAQsKAACwAgAgJgAAsQIAICcAALECACDWAUAAAAAB1wFAAAAABNgBQAAAAATZAUAAAAAB2gFAAAAAAdsBQAAAAAHcAUAAAAAB3QFAAK8CACELCgAAsAIAICYAALECACAnAACxAgAg1gFAAAAAAdcBQAAAAATYAUAAAAAE2QFAAAAAAdoBQAAAAAHbAUAAAAAB3AFAAAAAAd0BQACvAgAhCNYBAgAAAAHXAQIAAAAE2AECAAAABNkBAgAAAAHaAQIAAAAB2wECAAAAAdwBAgAAAAHdAQIAsAIAIQjWAUAAAAAB1wFAAAAABNgBQAAAAATZAUAAAAAB2gFAAAAAAdsBQAAAAAHcAUAAAAAB3QFAALECACEOCgAAswIAICYAALQCACAnAAC0AgAg1gEBAAAAAdcBAQAAAAXYAQEAAAAF2QEBAAAAAdoBAQAAAAHbAQEAAAAB3AEBAAAAAd0BAQCyAgAh3gEBAAAAAd8BAQAAAAHgAQEAAAABCNYBAgAAAAHXAQIAAAAF2AECAAAABdkBAgAAAAHaAQIAAAAB2wECAAAAAdwBAgAAAAHdAQIAswIAIQvWAQEAAAAB1wEBAAAABdgBAQAAAAXZAQEAAAAB2gEBAAAAAdsBAQAAAAHcAQEAAAAB3QEBALQCACHeAQEAAAAB3wEBAAAAAeABAQAAAAENCgAAsAIAICYAALACACAnAACwAgAgaAAAtgIAIGkAALACACDWAQIAAAAB1wECAAAABNgBAgAAAATZAQIAAAAB2gECAAAAAdsBAgAAAAHcAQIAAAAB3QECALUCACEI1gEIAAAAAdcBCAAAAATYAQgAAAAE2QEIAAAAAdoBCAAAAAHbAQgAAAAB3AEIAAAAAd0BCAC2AgAhDgoAALACACAmAAC4AgAgJwAAuAIAINYBAQAAAAHXAQEAAAAE2AEBAAAABNkBAQAAAAHaAQEAAAAB2wEBAAAAAdwBAQAAAAHdAQEAtwIAId4BAQAAAAHfAQEAAAAB4AEBAAAAAQvWAQEAAAAB1wEBAAAABNgBAQAAAATZAQEAAAAB2gEBAAAAAdsBAQAAAAHcAQEAAAAB3QEBALgCACHeAQEAAAAB3wEBAAAAAeABAQAAAAEKzAEAALkCADDNAQAAkQIAEM4BAAC5AgAwzwEBAKsCACHQAQEAqwIAIdUBQACuAgAh4QEBAKsCACHiAQgAugIAIeMBAQCrAgAh5AFAAK4CACENCgAAsAIAICYAALYCACAnAAC2AgAgaAAAtgIAIGkAALYCACDWAQgAAAAB1wEIAAAABNgBCAAAAATZAQgAAAAB2gEIAAAAAdsBCAAAAAHcAQgAAAAB3QEIALsCACENCgAAsAIAICYAALYCACAnAAC2AgAgaAAAtgIAIGkAALYCACDWAQgAAAAB1wEIAAAABNgBCAAAAATZAQgAAAAB2gEIAAAAAdsBCAAAAAHcAQgAAAAB3QEIALsCACELBQAAwAIAIMwBAAC8AgAwzQEAABsAEM4BAAC8AgAwzwEBAL4CACHQAQEAvgIAIdUBQAC_AgAh4QEBAL4CACHiAQgAvQIAIeMBAQC-AgAh5AFAAL8CACEI1gEIAAAAAdcBCAAAAATYAQgAAAAE2QEIAAAAAdoBCAAAAAHbAQgAAAAB3AEIAAAAAd0BCAC2AgAhC9YBAQAAAAHXAQEAAAAE2AEBAAAABNkBAQAAAAHaAQEAAAAB2wEBAAAAAdwBAQAAAAHdAQEAuAIAId4BAQAAAAHfAQEAAAAB4AEBAAAAAQjWAUAAAAAB1wFAAAAABNgBQAAAAATZAUAAAAAB2gFAAAAAAdsBQAAAAAHcAUAAAAAB3QFAALECACERAwAA7gIAIAYAANUCACAHAADoAgAgDgAA7wIAIA8AAPACACDMAQAA7AIAMM0BAAADABDOAQAA7AIAMM8BAQC-AgAh0QEBAL4CACHSAQEAvgIAIdUBQAC_AgAh4wEAAO0C6AEi5QEBAL4CACHmAQEAzAIAIYsCAAADACCMAgAAAwAgCswBAADBAgAwzQEAAPkBABDOAQAAwQIAMM8BAQCrAgAh0QEBAKsCACHSAQEAqwIAIdUBQACuAgAh4wEAAMIC6AEi5QEBAKsCACHmAQEArQIAIQcKAACwAgAgJgAAxAIAICcAAMQCACDWAQAAAOgBAtcBAAAA6AEI2AEAAADoAQjdAQAAwwLoASIHCgAAsAIAICYAAMQCACAnAADEAgAg1gEAAADoAQLXAQAAAOgBCNgBAAAA6AEI3QEAAMMC6AEiBNYBAAAA6AEC1wEAAADoAQjYAQAAAOgBCN0BAADEAugBIgnMAQAAxQIAMM0BAADjAQAQzgEAAMUCADDPAQEAqwIAIdIBAQCrAgAh1QFAAK4CACHoAUAArgIAIekBQACuAgAh6gEgAMYCACEFCgAAsAIAICYAAMgCACAnAADIAgAg1gEgAAAAAd0BIADHAgAhBQoAALACACAmAADIAgAgJwAAyAIAINYBIAAAAAHdASAAxwIAIQLWASAAAAAB3QEgAMgCACEFzAEAAMkCADDNAQAAzQEAEM4BAADJAgAw0gEBAKsCACHrAQEAqwIAIQjMAQAAygIAMM0BAAC3AQAQzgEAAMoCADDPAQEAqwIAIdUBQACuAgAh7AEBAKsCACHtAQEArQIAIe4BAQCtAgAhCQkAAM0CACDMAQAAywIAMM0BAACkAQAQzgEAAMsCADDPAQEAvgIAIdUBQAC_AgAh7AEBAL4CACHtAQEAzAIAIe4BAQDMAgAhC9YBAQAAAAHXAQEAAAAF2AEBAAAABdkBAQAAAAHaAQEAAAAB2wEBAAAAAdwBAQAAAAHdAQEAtAIAId4BAQAAAAHfAQEAAAAB4AEBAAAAAQPvAQAAEAAg8AEAABAAIPEBAAAQACALzAEAAM4CADDNAQAAngEAEM4BAADOAgAwzwEBAKsCACHVAUAArgIAIeQBQACuAgAh8gEBAKsCACHzAQEAqwIAIfQBAgCsAgAh9QEIALoCACH2ASAAxgIAIRADAADSAgAgBAAA0wIAIAgAANQCACAMAADNAgAgDQAA1QIAIMwBAADPAgAwzQEAAB8AEM4BAADPAgAwzwEBAL4CACHVAUAAvwIAIeQBQAC_AgAh8gEBAL4CACHzAQEAvgIAIfQBAgDQAgAh9QEIAL0CACH2ASAA0QIAIQjWAQIAAAAB1wECAAAABNgBAgAAAATZAQIAAAAB2gECAAAAAdsBAgAAAAHcAQIAAAAB3QECALACACEC1gEgAAAAAd0BIADIAgAhA-8BAAAHACDwAQAABwAg8QEAAAcAIAPvAQAAAwAg8AEAAAMAIPEBAAADACAD7wEAAAwAIPABAAAMACDxAQAADAAgEwgAANQCACAQAADTAgAgEQAA3wIAIBIAAOACACATAADhAgAgzAEAAN4CADDNAQAALgAQzgEAAN4CADDPAQEAvgIAIdUBQAC_AgAh4wEBAL4CACHkAUAAvwIAIewBAQC-AgAhhgIBAL4CACGHAiAA0QIAIYgCAQDMAgAhiQIBAL4CACGLAgAALgAgjAIAAC4AIAnMAQAA1gIAMM0BAACGAQAQzgEAANYCADDPAQEAqwIAIdUBQACuAgAh5AFAAK4CACH3AQEAqwIAIfgBAQCrAgAh-QFAAK4CACEJzAEAANcCADDNAQAAcwAQzgEAANcCADDPAQEAvgIAIdUBQAC_AgAh5AFAAL8CACH3AQEAvgIAIfgBAQC-AgAh-QFAAL8CACEQzAEAANgCADDNAQAAbQAQzgEAANgCADDPAQEAqwIAIdUBQACuAgAh5AFAAK4CACHyAQEAqwIAIfoBAQCrAgAh-wEBAKsCACH8AQEArQIAIf0BAQCtAgAh_gEBAK0CACH_AUAA2QIAIYACQADZAgAhgQIBAK0CACGCAgEArQIAIQsKAACzAgAgJgAA2wIAICcAANsCACDWAUAAAAAB1wFAAAAABdgBQAAAAAXZAUAAAAAB2gFAAAAAAdsBQAAAAAHcAUAAAAAB3QFAANoCACELCgAAswIAICYAANsCACAnAADbAgAg1gFAAAAAAdcBQAAAAAXYAUAAAAAF2QFAAAAAAdoBQAAAAAHbAUAAAAAB3AFAAAAAAd0BQADaAgAhCNYBQAAAAAHXAUAAAAAF2AFAAAAABdkBQAAAAAHaAUAAAAAB2wFAAAAAAdwBQAAAAAHdAUAA2wIAIQvMAQAA3AIAMM0BAABXABDOAQAA3AIAMM8BAQCrAgAh1QFAAK4CACHkAUAArgIAIfIBAQCrAgAh-QFAAK4CACGDAgEAqwIAIYQCAQCtAgAhhQIBAK0CACEMzAEAAN0CADDNAQAAQQAQzgEAAN0CADDPAQEAqwIAIdUBQACuAgAh4wEBAKsCACHkAUAArgIAIewBAQCrAgAhhgIBAKsCACGHAiAAxgIAIYgCAQCtAgAhiQIBAKsCACERCAAA1AIAIBAAANMCACARAADfAgAgEgAA4AIAIBMAAOECACDMAQAA3gIAMM0BAAAuABDOAQAA3gIAMM8BAQC-AgAh1QFAAL8CACHjAQEAvgIAIeQBQAC_AgAh7AEBAL4CACGGAgEAvgIAIYcCIADRAgAhiAIBAMwCACGJAgEAvgIAIRIDAADSAgAgBAAA0wIAIAgAANQCACAMAADNAgAgDQAA1QIAIMwBAADPAgAwzQEAAB8AEM4BAADPAgAwzwEBAL4CACHVAUAAvwIAIeQBQAC_AgAh8gEBAL4CACHzAQEAvgIAIfQBAgDQAgAh9QEIAL0CACH2ASAA0QIAIYsCAAAfACCMAgAAHwAgA-8BAAAhACDwAQAAIQAg8QEAACEAIAPvAQAAJQAg8AEAACUAIPEBAAAlACAMDQAA1QIAIMwBAADiAgAwzQEAACUAEM4BAADiAgAwzwEBAL4CACHVAUAAvwIAIeQBQAC_AgAh8gEBAL4CACH5AUAAvwIAIYMCAQC-AgAhhAIBAMwCACGFAgEAzAIAIRENAADVAgAgzAEAAOMCADDNAQAAIQAQzgEAAOMCADDPAQEAvgIAIdUBQAC_AgAh5AFAAL8CACHyAQEAvgIAIfoBAQC-AgAh-wEBAL4CACH8AQEAzAIAIf0BAQDMAgAh_gEBAMwCACH_AUAA5AIAIYACQADkAgAhgQIBAMwCACGCAgEAzAIAIQjWAUAAAAAB1wFAAAAABdgBQAAAAAXZAUAAAAAB2gFAAAAAAdsBQAAAAAHcAUAAAAAB3QFAANsCACEC0gEBAAAAAesBAQAAAAEHBwAA6AIAIAsAAOcCACDMAQAA5gIAMM0BAAAQABDOAQAA5gIAMNIBAQC-AgAh6wEBAL4CACELCQAAzQIAIMwBAADLAgAwzQEAAKQBABDOAQAAywIAMM8BAQC-AgAh1QFAAL8CACHsAQEAvgIAIe0BAQDMAgAh7gEBAMwCACGLAgAApAEAIIwCAACkAQAgEgMAANICACAEAADTAgAgCAAA1AIAIAwAAM0CACANAADVAgAgzAEAAM8CADDNAQAAHwAQzgEAAM8CADDPAQEAvgIAIdUBQAC_AgAh5AFAAL8CACHyAQEAvgIAIfMBAQC-AgAh9AECANACACH1AQgAvQIAIfYBIADRAgAhiwIAAB8AIIwCAAAfACANBQAAwAIAIAYAANUCACAHAADoAgAgzAEAAOkCADDNAQAADAAQzgEAAOkCADDPAQEAvgIAIdABAQC-AgAh0QEBAL4CACHSAQEAvgIAIdMBAgDQAgAh1AEBAMwCACHVAUAAvwIAIQsFAADrAgAgBwAA6AIAIMwBAADqAgAwzQEAAAcAEM4BAADqAgAwzwEBAL4CACHSAQEAvgIAIdUBQAC_AgAh6AFAAL8CACHpAUAAvwIAIeoBIADRAgAhEQMAAO4CACAGAADVAgAgBwAA6AIAIA4AAO8CACAPAADwAgAgzAEAAOwCADDNAQAAAwAQzgEAAOwCADDPAQEAvgIAIdEBAQC-AgAh0gEBAL4CACHVAUAAvwIAIeMBAADtAugBIuUBAQC-AgAh5gEBAMwCACGLAgAAAwAgjAIAAAMAIA8DAADuAgAgBgAA1QIAIAcAAOgCACAOAADvAgAgDwAA8AIAIMwBAADsAgAwzQEAAAMAEM4BAADsAgAwzwEBAL4CACHRAQEAvgIAIdIBAQC-AgAh1QFAAL8CACHjAQAA7QLoASLlAQEAvgIAIeYBAQDMAgAhBNYBAAAA6AEC1wEAAADoAQjYAQAAAOgBCN0BAADEAugBIg0FAADrAgAgBwAA6AIAIMwBAADqAgAwzQEAAAcAEM4BAADqAgAwzwEBAL4CACHSAQEAvgIAIdUBQAC_AgAh6AFAAL8CACHpAUAAvwIAIeoBIADRAgAhiwIAAAcAIIwCAAAHACANBQAAwAIAIMwBAAC8AgAwzQEAABsAEM4BAAC8AgAwzwEBAL4CACHQAQEAvgIAIdUBQAC_AgAh4QEBAL4CACHiAQgAvQIAIeMBAQC-AgAh5AFAAL8CACGLAgAAGwAgjAIAABsAIA8FAADAAgAgBgAA1QIAIAcAAOgCACDMAQAA6QIAMM0BAAAMABDOAQAA6QIAMM8BAQC-AgAh0AEBAL4CACHRAQEAvgIAIdIBAQC-AgAh0wECANACACHUAQEAzAIAIdUBQAC_AgAhiwIAAAwAIIwCAAAMACAAAAAAAAABkwIBAAAAAQWTAgIAAAABlgICAAAAAZcCAgAAAAGYAgIAAAABmQICAAAAAQGTAgEAAAABAZMCQAAAAAEFIAAAmAUAICEAAKEFACCNAgAAmQUAII4CAACgBQAgkQIAAAUAIAUgAACWBQAgIQAAngUAII0CAACXBQAgjgIAAJ0FACCRAgAAAQAgBSAAAJQFACAhAACbBQAgjQIAAJUFACCOAgAAmgUAIJECAACJAQAgAyAAAJgFACCNAgAAmQUAIJECAAAFACADIAAAlgUAII0CAACXBQAgkQIAAAEAIAMgAACUBQAgjQIAAJUFACCRAgAAiQEAIAAAAAAABZMCCAAAAAGWAggAAAABlwIIAAAAAZgCCAAAAAGZAggAAAABBSAAAI8FACAhAACSBQAgjQIAAJAFACCOAgAAkQUAIJECAAAFACADIAAAjwUAII0CAACQBQAgkQIAAAUAIAYDAADWBAAgBgAAhwQAIAcAANIEACAOAADXBAAgDwAA2AQAIOYBAADxAgAgAAAAAZMCAAAA6AECBSAAAIQFACAhAACNBQAgjQIAAIUFACCOAgAAjAUAIJECAAAJACAFIAAAggUAICEAAIoFACCNAgAAgwUAII4CAACJBQAgkQIAAAEAIAUgAACABQAgIQAAhwUAII0CAACBBQAgjgIAAIYFACCRAgAAiQEAIAcgAACYAwAgIQAAmwMAII0CAACZAwAgjgIAAJoDACCPAgAAGwAgkAIAABsAIJECAAD8AQAgByAAAJMDACAhAACWAwAgjQIAAJQDACCOAgAAlQMAII8CAAAMACCQAgAADAAgkQIAAA4AIAgGAAD_AgAgBwAAgAMAIM8BAQAAAAHRAQEAAAAB0gEBAAAAAdMBAgAAAAHUAQEAAAAB1QFAAAAAAQIAAAAOACAgAACTAwAgAwAAAAwAICAAAJMDACAhAACXAwAgCgAAAAwAIAYAAPwCACAHAAD9AgAgGQAAlwMAIM8BAQD3AgAh0QEBAPcCACHSAQEA9wIAIdMBAgD4AgAh1AEBAPkCACHVAUAA-gIAIQgGAAD8AgAgBwAA_QIAIM8BAQD3AgAh0QEBAPcCACHSAQEA9wIAIdMBAgD4AgAh1AEBAPkCACHVAUAA-gIAIQbPAQEAAAAB1QFAAAAAAeEBAQAAAAHiAQgAAAAB4wEBAAAAAeQBQAAAAAECAAAA_AEAICAAAJgDACADAAAAGwAgIAAAmAMAICEAAJwDACAIAAAAGwAgGQAAnAMAIM8BAQD3AgAh1QFAAPoCACHhAQEA9wIAIeIBCACGAwAh4wEBAPcCACHkAUAA-gIAIQbPAQEA9wIAIdUBQAD6AgAh4QEBAPcCACHiAQgAhgMAIeMBAQD3AgAh5AFAAPoCACEDIAAAhAUAII0CAACFBQAgkQIAAAkAIAMgAACCBQAgjQIAAIMFACCRAgAAAQAgAyAAAIAFACCNAgAAgQUAIJECAACJAQAgAyAAAJgDACCNAgAAmQMAIJECAAD8AQAgAyAAAJMDACCNAgAAlAMAIJECAAAOACAAAAABkwIgAAAAAQUgAAD7BAAgIQAA_gQAII0CAAD8BAAgjgIAAP0EACCRAgAAiQEAIAcgAACoAwAgIQAAqwMAII0CAACpAwAgjgIAAKoDACCPAgAAAwAgkAIAAAMAIJECAAAFACAKBgAAngMAIAcAAJ8DACAOAACgAwAgDwAAoQMAIM8BAQAAAAHRAQEAAAAB0gEBAAAAAdUBQAAAAAHjAQAAAOgBAuYBAQAAAAECAAAABQAgIAAAqAMAIAMAAAADACAgAACoAwAgIQAArAMAIAwAAAADACAGAACPAwAgBwAAkAMAIA4AAJEDACAPAACSAwAgGQAArAMAIM8BAQD3AgAh0QEBAPcCACHSAQEA9wIAIdUBQAD6AgAh4wEAAI0D6AEi5gEBAPkCACEKBgAAjwMAIAcAAJADACAOAACRAwAgDwAAkgMAIM8BAQD3AgAh0QEBAPcCACHSAQEA9wIAIdUBQAD6AgAh4wEAAI0D6AEi5gEBAPkCACEDIAAA-wQAII0CAAD8BAAgkQIAAIkBACADIAAAqAMAII0CAACpAwAgkQIAAAUAIAAAAAUgAADzBAAgIQAA-QQAII0CAAD0BAAgjgIAAPgEACCRAgAAoQEAIAUgAADxBAAgIQAA9gQAII0CAADyBAAgjgIAAPUEACCRAgAAiQEAIAMgAADzBAAgjQIAAPQEACCRAgAAoQEAIAMgAADxBAAgjQIAAPIEACCRAgAAiQEAIAAAAAsgAAC6AwAwIQAAvwMAMI0CAAC7AwAwjgIAALwDADCPAgAAvgMAMJACAAC-AwAwkQIAAL4DADCSAgAAvQMAIJMCAAC-AwAwlAIAAMADADCVAgAAwQMAMAIHAAC1AwAg0gEBAAAAAQIAAAASACAgAADFAwAgAwAAABIAICAAAMUDACAhAADEAwAgARkAAPAEADAIBwAA6AIAIAsAAOcCACDMAQAA5gIAMM0BAAAQABDOAQAA5gIAMNIBAQC-AgAh6wEBAL4CACGKAgAA5QIAIAIAAAASACAZAADEAwAgAgAAAMIDACAZAADDAwAgBcwBAADBAwAwzQEAAMIDABDOAQAAwQMAMNIBAQC-AgAh6wEBAL4CACEFzAEAAMEDADDNAQAAwgMAEM4BAADBAwAw0gEBAL4CACHrAQEAvgIAIQHSAQEA9wIAIQIHAACzAwAg0gEBAPcCACECBwAAtQMAINIBAQAAAAEEIAAAugMAMI0CAAC7AwAwkQIAAL4DADCSAgAAvQMAIAAAAAAAAAsgAADzAwAwIQAA-AMAMI0CAAD0AwAwjgIAAPUDADCPAgAA9wMAMJACAAD3AwAwkQIAAPcDADCSAgAA9gMAIJMCAAD3AwAwlAIAAPkDADCVAgAA-gMAMAsgAADnAwAwIQAA7AMAMI0CAADoAwAwjgIAAOkDADCPAgAA6wMAMJACAADrAwAwkQIAAOsDADCSAgAA6gMAIJMCAADrAwAwlAIAAO0DADCVAgAA7gMAMAsgAADbAwAwIQAA4AMAMI0CAADcAwAwjgIAAN0DADCPAgAA3wMAMJACAADfAwAwkQIAAN8DADCSAgAA3gMAIJMCAADfAwAwlAIAAOEDADCVAgAA4gMAMAsgAADSAwAwIQAA1gMAMI0CAADTAwAwjgIAANQDADCPAgAAvgMAMJACAAC-AwAwkQIAAL4DADCSAgAA1QMAIJMCAAC-AwAwlAIAANcDADCVAgAAwQMAMAUgAADnBAAgIQAA7gQAII0CAADoBAAgjgIAAO0EACCRAgAAAQAgAgsAALQDACDrAQEAAAABAgAAABIAICAAANoDACADAAAAEgAgIAAA2gMAICEAANkDACABGQAA7AQAMAIAAAASACAZAADZAwAgAgAAAMIDACAZAADYAwAgAesBAQD3AgAhAgsAALIDACDrAQEA9wIAIQILAAC0AwAg6wEBAAAAAQgFAAD-AgAgBgAA_wIAIM8BAQAAAAHQAQEAAAAB0QEBAAAAAdMBAgAAAAHUAQEAAAAB1QFAAAAAAQIAAAAOACAgAADmAwAgAwAAAA4AICAAAOYDACAhAADlAwAgARkAAOsEADANBQAAwAIAIAYAANUCACAHAADoAgAgzAEAAOkCADDNAQAADAAQzgEAAOkCADDPAQEAAAAB0AEBAAAAAdEBAQC-AgAh0gEBAL4CACHTAQIA0AIAIdQBAQDMAgAh1QFAAL8CACECAAAADgAgGQAA5QMAIAIAAADjAwAgGQAA5AMAIArMAQAA4gMAMM0BAADjAwAQzgEAAOIDADDPAQEAvgIAIdABAQC-AgAh0QEBAL4CACHSAQEAvgIAIdMBAgDQAgAh1AEBAMwCACHVAUAAvwIAIQrMAQAA4gMAMM0BAADjAwAQzgEAAOIDADDPAQEAvgIAIdABAQC-AgAh0QEBAL4CACHSAQEAvgIAIdMBAgDQAgAh1AEBAMwCACHVAUAAvwIAIQbPAQEA9wIAIdABAQD3AgAh0QEBAPcCACHTAQIA-AIAIdQBAQD5AgAh1QFAAPoCACEIBQAA-wIAIAYAAPwCACDPAQEA9wIAIdABAQD3AgAh0QEBAPcCACHTAQIA-AIAIdQBAQD5AgAh1QFAAPoCACEIBQAA_gIAIAYAAP8CACDPAQEAAAAB0AEBAAAAAdEBAQAAAAHTAQIAAAAB1AEBAAAAAdUBQAAAAAEKAwAAnQMAIAYAAJ4DACAOAACgAwAgDwAAoQMAIM8BAQAAAAHRAQEAAAAB1QFAAAAAAeMBAAAA6AEC5QEBAAAAAeYBAQAAAAECAAAABQAgIAAA8gMAIAMAAAAFACAgAADyAwAgIQAA8QMAIAEZAADqBAAwDwMAAO4CACAGAADVAgAgBwAA6AIAIA4AAO8CACAPAADwAgAgzAEAAOwCADDNAQAAAwAQzgEAAOwCADDPAQEAAAAB0QEBAL4CACHSAQEAvgIAIdUBQAC_AgAh4wEAAO0C6AEi5QEBAAAAAeYBAQDMAgAhAgAAAAUAIBkAAPEDACACAAAA7wMAIBkAAPADACAKzAEAAO4DADDNAQAA7wMAEM4BAADuAwAwzwEBAL4CACHRAQEAvgIAIdIBAQC-AgAh1QFAAL8CACHjAQAA7QLoASLlAQEAvgIAIeYBAQDMAgAhCswBAADuAwAwzQEAAO8DABDOAQAA7gMAMM8BAQC-AgAh0QEBAL4CACHSAQEAvgIAIdUBQAC_AgAh4wEAAO0C6AEi5QEBAL4CACHmAQEAzAIAIQbPAQEA9wIAIdEBAQD3AgAh1QFAAPoCACHjAQAAjQPoASLlAQEA9wIAIeYBAQD5AgAhCgMAAI4DACAGAACPAwAgDgAAkQMAIA8AAJIDACDPAQEA9wIAIdEBAQD3AgAh1QFAAPoCACHjAQAAjQPoASLlAQEA9wIAIeYBAQD5AgAhCgMAAJ0DACAGAACeAwAgDgAAoAMAIA8AAKEDACDPAQEAAAAB0QEBAAAAAdUBQAAAAAHjAQAAAOgBAuUBAQAAAAHmAQEAAAABBgUAAK4DACDPAQEAAAAB1QFAAAAAAegBQAAAAAHpAUAAAAAB6gEgAAAAAQIAAAAJACAgAAD-AwAgAwAAAAkAICAAAP4DACAhAAD9AwAgARkAAOkEADALBQAA6wIAIAcAAOgCACDMAQAA6gIAMM0BAAAHABDOAQAA6gIAMM8BAQAAAAHSAQEAvgIAIdUBQAC_AgAh6AFAAL8CACHpAUAAvwIAIeoBIADRAgAhAgAAAAkAIBkAAP0DACACAAAA-wMAIBkAAPwDACAJzAEAAPoDADDNAQAA-wMAEM4BAAD6AwAwzwEBAL4CACHSAQEAvgIAIdUBQAC_AgAh6AFAAL8CACHpAUAAvwIAIeoBIADRAgAhCcwBAAD6AwAwzQEAAPsDABDOAQAA-gMAMM8BAQC-AgAh0gEBAL4CACHVAUAAvwIAIegBQAC_AgAh6QFAAL8CACHqASAA0QIAIQXPAQEA9wIAIdUBQAD6AgAh6AFAAPoCACHpAUAA-gIAIeoBIAClAwAhBgUAAKcDACDPAQEA9wIAIdUBQAD6AgAh6AFAAPoCACHpAUAA-gIAIeoBIAClAwAhBgUAAK4DACDPAQEAAAAB1QFAAAAAAegBQAAAAAHpAUAAAAAB6gEgAAAAAQQgAADzAwAwjQIAAPQDADCRAgAA9wMAMJICAAD2AwAgBCAAAOcDADCNAgAA6AMAMJECAADrAwAwkgIAAOoDACAEIAAA2wMAMI0CAADcAwAwkQIAAN8DADCSAgAA3gMAIAQgAADSAwAwjQIAANMDADCRAgAAvgMAMJICAADVAwAgAyAAAOcEACCNAgAA6AQAIJECAAABACAAAAAGCAAAhgQAIBAAAIUEACARAADSBAAgEgAA0wQAIBMAANQEACCIAgAA8QIAIAAAAAAAAAGTAkAAAAABBSAAAOIEACAhAADlBAAgjQIAAOMEACCOAgAA5AQAIJECAAABACADIAAA4gQAII0CAADjBAAgkQIAAAEAIAAAAAUgAADdBAAgIQAA4AQAII0CAADeBAAgjgIAAN8EACCRAgAAAQAgAyAAAN0EACCNAgAA3gQAIJECAAABACAAAAALIAAAxAQAMCEAAMgEADCNAgAAxQQAMI4CAADGBAAwjwIAAOsDADCQAgAA6wMAMJECAADrAwAwkgIAAMcEACCTAgAA6wMAMJQCAADJBAAwlQIAAO4DADALIAAAuwQAMCEAAL8EADCNAgAAvAQAMI4CAAC9BAAwjwIAAN8DADCQAgAA3wMAMJECAADfAwAwkgIAAL4EACCTAgAA3wMAMJQCAADABAAwlQIAAOIDADAHIAAAtgQAICEAALkEACCNAgAAtwQAII4CAAC4BAAgjwIAAB8AIJACAAAfACCRAgAAiQEAIAsgAACqBAAwIQAArwQAMI0CAACrBAAwjgIAAKwEADCPAgAArgQAMJACAACuBAAwkQIAAK4EADCSAgAArQQAIJMCAACuBAAwlAIAALAEADCVAgAAsQQAMAsgAACeBAAwIQAAowQAMI0CAACfBAAwjgIAAKAEADCPAgAAogQAMJACAACiBAAwkQIAAKIEADCSAgAAoQQAIJMCAACiBAAwlAIAAKQEADCVAgAApQQAMAfPAQEAAAAB1QFAAAAAAeQBQAAAAAH5AUAAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABAgAAACcAICAAAKkEACADAAAAJwAgIAAAqQQAICEAAKgEACABGQAA3AQAMAwNAADVAgAgzAEAAOICADDNAQAAJQAQzgEAAOICADDPAQEAAAAB1QFAAL8CACHkAUAAvwIAIfIBAQC-AgAh-QFAAL8CACGDAgEAAAABhAIBAMwCACGFAgEAzAIAIQIAAAAnACAZAACoBAAgAgAAAKYEACAZAACnBAAgC8wBAAClBAAwzQEAAKYEABDOAQAApQQAMM8BAQC-AgAh1QFAAL8CACHkAUAAvwIAIfIBAQC-AgAh-QFAAL8CACGDAgEAvgIAIYQCAQDMAgAhhQIBAMwCACELzAEAAKUEADDNAQAApgQAEM4BAAClBAAwzwEBAL4CACHVAUAAvwIAIeQBQAC_AgAh8gEBAL4CACH5AUAAvwIAIYMCAQC-AgAhhAIBAMwCACGFAgEAzAIAIQfPAQEA9wIAIdUBQAD6AgAh5AFAAPoCACH5AUAA-gIAIYMCAQD3AgAhhAIBAPkCACGFAgEA-QIAIQfPAQEA9wIAIdUBQAD6AgAh5AFAAPoCACH5AUAA-gIAIYMCAQD3AgAhhAIBAPkCACGFAgEA-QIAIQfPAQEAAAAB1QFAAAAAAeQBQAAAAAH5AUAAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABDM8BAQAAAAHVAUAAAAAB5AFAAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wFAAAAAAYACQAAAAAGBAgEAAAABggIBAAAAAQIAAAAjACAgAAC1BAAgAwAAACMAICAAALUEACAhAAC0BAAgARkAANsEADARDQAA1QIAIMwBAADjAgAwzQEAACEAEM4BAADjAgAwzwEBAAAAAdUBQAC_AgAh5AFAAL8CACHyAQEAvgIAIfoBAQC-AgAh-wEBAL4CACH8AQEAzAIAIf0BAQDMAgAh_gEBAMwCACH_AUAA5AIAIYACQADkAgAhgQIBAMwCACGCAgEAzAIAIQIAAAAjACAZAAC0BAAgAgAAALIEACAZAACzBAAgEMwBAACxBAAwzQEAALIEABDOAQAAsQQAMM8BAQC-AgAh1QFAAL8CACHkAUAAvwIAIfIBAQC-AgAh-gEBAL4CACH7AQEAvgIAIfwBAQDMAgAh_QEBAMwCACH-AQEAzAIAIf8BQADkAgAhgAJAAOQCACGBAgEAzAIAIYICAQDMAgAhEMwBAACxBAAwzQEAALIEABDOAQAAsQQAMM8BAQC-AgAh1QFAAL8CACHkAUAAvwIAIfIBAQC-AgAh-gEBAL4CACH7AQEAvgIAIfwBAQDMAgAh_QEBAMwCACH-AQEAzAIAIf8BQADkAgAhgAJAAOQCACGBAgEAzAIAIYICAQDMAgAhDM8BAQD3AgAh1QFAAPoCACHkAUAA-gIAIfoBAQD3AgAh-wEBAPcCACH8AQEA-QIAIf0BAQD5AgAh_gEBAPkCACH_AUAAjgQAIYACQACOBAAhgQIBAPkCACGCAgEA-QIAIQzPAQEA9wIAIdUBQAD6AgAh5AFAAPoCACH6AQEA9wIAIfsBAQD3AgAh_AEBAPkCACH9AQEA-QIAIf4BAQD5AgAh_wFAAI4EACGAAkAAjgQAIYECAQD5AgAhggIBAPkCACEMzwEBAAAAAdUBQAAAAAHkAUAAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAf4BAQAAAAH_AUAAAAABgAJAAAAAAYECAQAAAAGCAgEAAAABCwMAAP8DACAEAACABAAgCAAAgQQAIAwAAIIEACDPAQEAAAAB1QFAAAAAAeQBQAAAAAHzAQEAAAAB9AECAAAAAfUBCAAAAAH2ASAAAAABAgAAAIkBACAgAAC2BAAgAwAAAB8AICAAALYEACAhAAC6BAAgDQAAAB8AIAMAAM0DACAEAADOAwAgCAAAzwMAIAwAANADACAZAAC6BAAgzwEBAPcCACHVAUAA-gIAIeQBQAD6AgAh8wEBAPcCACH0AQIA-AIAIfUBCACGAwAh9gEgAKUDACELAwAAzQMAIAQAAM4DACAIAADPAwAgDAAA0AMAIM8BAQD3AgAh1QFAAPoCACHkAUAA-gIAIfMBAQD3AgAh9AECAPgCACH1AQgAhgMAIfYBIAClAwAhCAUAAP4CACAHAACAAwAgzwEBAAAAAdABAQAAAAHSAQEAAAAB0wECAAAAAdQBAQAAAAHVAUAAAAABAgAAAA4AICAAAMMEACADAAAADgAgIAAAwwQAICEAAMIEACABGQAA2gQAMAIAAAAOACAZAADCBAAgAgAAAOMDACAZAADBBAAgBs8BAQD3AgAh0AEBAPcCACHSAQEA9wIAIdMBAgD4AgAh1AEBAPkCACHVAUAA-gIAIQgFAAD7AgAgBwAA_QIAIM8BAQD3AgAh0AEBAPcCACHSAQEA9wIAIdMBAgD4AgAh1AEBAPkCACHVAUAA-gIAIQgFAAD-AgAgBwAAgAMAIM8BAQAAAAHQAQEAAAAB0gEBAAAAAdMBAgAAAAHUAQEAAAAB1QFAAAAAAQoDAACdAwAgBwAAnwMAIA4AAKADACAPAAChAwAgzwEBAAAAAdIBAQAAAAHVAUAAAAAB4wEAAADoAQLlAQEAAAAB5gEBAAAAAQIAAAAFACAgAADMBAAgAwAAAAUAICAAAMwEACAhAADLBAAgARkAANkEADACAAAABQAgGQAAywQAIAIAAADvAwAgGQAAygQAIAbPAQEA9wIAIdIBAQD3AgAh1QFAAPoCACHjAQAAjQPoASLlAQEA9wIAIeYBAQD5AgAhCgMAAI4DACAHAACQAwAgDgAAkQMAIA8AAJIDACDPAQEA9wIAIdIBAQD3AgAh1QFAAPoCACHjAQAAjQPoASLlAQEA9wIAIeYBAQD5AgAhCgMAAJ0DACAHAACfAwAgDgAAoAMAIA8AAKEDACDPAQEAAAAB0gEBAAAAAdUBQAAAAAHjAQAAAOgBAuUBAQAAAAHmAQEAAAABBCAAAMQEADCNAgAAxQQAMJECAADrAwAwkgIAAMcEACAEIAAAuwQAMI0CAAC8BAAwkQIAAN8DADCSAgAAvgQAIAMgAAC2BAAgjQIAALcEACCRAgAAiQEAIAQgAACqBAAwjQIAAKsEADCRAgAArgQAMJICAACtBAAgBCAAAJ4EADCNAgAAnwQAMJECAACiBAAwkgIAAKEEACAFAwAAhAQAIAQAAIUEACAIAACGBAAgDAAAxwMAIA0AAIcEACAAAAMJAADHAwAg7QEAAPECACDuAQAA8QIAIAIFAACJAwAgBwAA0gQAIAEFAACJAwAgBAUAAIkDACAGAACHBAAgBwAA0gQAINQBAADxAgAgBs8BAQAAAAHSAQEAAAAB1QFAAAAAAeMBAAAA6AEC5QEBAAAAAeYBAQAAAAEGzwEBAAAAAdABAQAAAAHSAQEAAAAB0wECAAAAAdQBAQAAAAHVAUAAAAABDM8BAQAAAAHVAUAAAAAB5AFAAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wFAAAAAAYACQAAAAAGBAgEAAAABggIBAAAAAQfPAQEAAAAB1QFAAAAAAeQBQAAAAAH5AUAAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABDQgAAM4EACAQAADNBAAgEQAAzwQAIBIAANAEACDPAQEAAAAB1QFAAAAAAeMBAQAAAAHkAUAAAAAB7AEBAAAAAYYCAQAAAAGHAiAAAAABiAIBAAAAAYkCAQAAAAECAAAAAQAgIAAA3QQAIAMAAAAuACAgAADdBAAgIQAA4QQAIA8AAAAuACAIAACaBAAgEAAAmQQAIBEAAJsEACASAACcBAAgGQAA4QQAIM8BAQD3AgAh1QFAAPoCACHjAQEA9wIAIeQBQAD6AgAh7AEBAPcCACGGAgEA9wIAIYcCIAClAwAhiAIBAPkCACGJAgEA9wIAIQ0IAACaBAAgEAAAmQQAIBEAAJsEACASAACcBAAgzwEBAPcCACHVAUAA-gIAIeMBAQD3AgAh5AFAAPoCACHsAQEA9wIAIYYCAQD3AgAhhwIgAKUDACGIAgEA-QIAIYkCAQD3AgAhDQgAAM4EACAQAADNBAAgEQAAzwQAIBMAANEEACDPAQEAAAAB1QFAAAAAAeMBAQAAAAHkAUAAAAAB7AEBAAAAAYYCAQAAAAGHAiAAAAABiAIBAAAAAYkCAQAAAAECAAAAAQAgIAAA4gQAIAMAAAAuACAgAADiBAAgIQAA5gQAIA8AAAAuACAIAACaBAAgEAAAmQQAIBEAAJsEACATAACdBAAgGQAA5gQAIM8BAQD3AgAh1QFAAPoCACHjAQEA9wIAIeQBQAD6AgAh7AEBAPcCACGGAgEA9wIAIYcCIAClAwAhiAIBAPkCACGJAgEA9wIAIQ0IAACaBAAgEAAAmQQAIBEAAJsEACATAACdBAAgzwEBAPcCACHVAUAA-gIAIeMBAQD3AgAh5AFAAPoCACHsAQEA9wIAIYYCAQD3AgAhhwIgAKUDACGIAgEA-QIAIYkCAQD3AgAhDQgAAM4EACAQAADNBAAgEgAA0AQAIBMAANEEACDPAQEAAAAB1QFAAAAAAeMBAQAAAAHkAUAAAAAB7AEBAAAAAYYCAQAAAAGHAiAAAAABiAIBAAAAAYkCAQAAAAECAAAAAQAgIAAA5wQAIAXPAQEAAAAB1QFAAAAAAegBQAAAAAHpAUAAAAAB6gEgAAAAAQbPAQEAAAAB0QEBAAAAAdUBQAAAAAHjAQAAAOgBAuUBAQAAAAHmAQEAAAABBs8BAQAAAAHQAQEAAAAB0QEBAAAAAdMBAgAAAAHUAQEAAAAB1QFAAAAAAQHrAQEAAAABAwAAAC4AICAAAOcEACAhAADvBAAgDwAAAC4AIAgAAJoEACAQAACZBAAgEgAAnAQAIBMAAJ0EACAZAADvBAAgzwEBAPcCACHVAUAA-gIAIeMBAQD3AgAh5AFAAPoCACHsAQEA9wIAIYYCAQD3AgAhhwIgAKUDACGIAgEA-QIAIYkCAQD3AgAhDQgAAJoEACAQAACZBAAgEgAAnAQAIBMAAJ0EACDPAQEA9wIAIdUBQAD6AgAh4wEBAPcCACHkAUAA-gIAIewBAQD3AgAhhgIBAPcCACGHAiAApQMAIYgCAQD5AgAhiQIBAPcCACEB0gEBAAAAAQwDAAD_AwAgBAAAgAQAIAgAAIEEACANAACDBAAgzwEBAAAAAdUBQAAAAAHkAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQIAAAAB9QEIAAAAAfYBIAAAAAECAAAAiQEAICAAAPEEACAFzwEBAAAAAdUBQAAAAAHsAQEAAAAB7QEBAAAAAe4BAQAAAAECAAAAoQEAICAAAPMEACADAAAAHwAgIAAA8QQAICEAAPcEACAOAAAAHwAgAwAAzQMAIAQAAM4DACAIAADPAwAgDQAA0QMAIBkAAPcEACDPAQEA9wIAIdUBQAD6AgAh5AFAAPoCACHyAQEA9wIAIfMBAQD3AgAh9AECAPgCACH1AQgAhgMAIfYBIAClAwAhDAMAAM0DACAEAADOAwAgCAAAzwMAIA0AANEDACDPAQEA9wIAIdUBQAD6AgAh5AFAAPoCACHyAQEA9wIAIfMBAQD3AgAh9AECAPgCACH1AQgAhgMAIfYBIAClAwAhAwAAAKQBACAgAADzBAAgIQAA-gQAIAcAAACkAQAgGQAA-gQAIM8BAQD3AgAh1QFAAPoCACHsAQEA9wIAIe0BAQD5AgAh7gEBAPkCACEFzwEBAPcCACHVAUAA-gIAIewBAQD3AgAh7QEBAPkCACHuAQEA-QIAIQwEAACABAAgCAAAgQQAIAwAAIIEACANAACDBAAgzwEBAAAAAdUBQAAAAAHkAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQIAAAAB9QEIAAAAAfYBIAAAAAECAAAAiQEAICAAAPsEACADAAAAHwAgIAAA-wQAICEAAP8EACAOAAAAHwAgBAAAzgMAIAgAAM8DACAMAADQAwAgDQAA0QMAIBkAAP8EACDPAQEA9wIAIdUBQAD6AgAh5AFAAPoCACHyAQEA9wIAIfMBAQD3AgAh9AECAPgCACH1AQgAhgMAIfYBIAClAwAhDAQAAM4DACAIAADPAwAgDAAA0AMAIA0AANEDACDPAQEA9wIAIdUBQAD6AgAh5AFAAPoCACHyAQEA9wIAIfMBAQD3AgAh9AECAPgCACH1AQgAhgMAIfYBIAClAwAhDAMAAP8DACAIAACBBAAgDAAAggQAIA0AAIMEACDPAQEAAAAB1QFAAAAAAeQBQAAAAAHyAQEAAAAB8wEBAAAAAfQBAgAAAAH1AQgAAAAB9gEgAAAAAQIAAACJAQAgIAAAgAUAIA0IAADOBAAgEQAAzwQAIBIAANAEACATAADRBAAgzwEBAAAAAdUBQAAAAAHjAQEAAAAB5AFAAAAAAewBAQAAAAGGAgEAAAABhwIgAAAAAYgCAQAAAAGJAgEAAAABAgAAAAEAICAAAIIFACAHBwAArQMAIM8BAQAAAAHSAQEAAAAB1QFAAAAAAegBQAAAAAHpAUAAAAAB6gEgAAAAAQIAAAAJACAgAACEBQAgAwAAAB8AICAAAIAFACAhAACIBQAgDgAAAB8AIAMAAM0DACAIAADPAwAgDAAA0AMAIA0AANEDACAZAACIBQAgzwEBAPcCACHVAUAA-gIAIeQBQAD6AgAh8gEBAPcCACHzAQEA9wIAIfQBAgD4AgAh9QEIAIYDACH2ASAApQMAIQwDAADNAwAgCAAAzwMAIAwAANADACANAADRAwAgzwEBAPcCACHVAUAA-gIAIeQBQAD6AgAh8gEBAPcCACHzAQEA9wIAIfQBAgD4AgAh9QEIAIYDACH2ASAApQMAIQMAAAAuACAgAACCBQAgIQAAiwUAIA8AAAAuACAIAACaBAAgEQAAmwQAIBIAAJwEACATAACdBAAgGQAAiwUAIM8BAQD3AgAh1QFAAPoCACHjAQEA9wIAIeQBQAD6AgAh7AEBAPcCACGGAgEA9wIAIYcCIAClAwAhiAIBAPkCACGJAgEA9wIAIQ0IAACaBAAgEQAAmwQAIBIAAJwEACATAACdBAAgzwEBAPcCACHVAUAA-gIAIeMBAQD3AgAh5AFAAPoCACHsAQEA9wIAIYYCAQD3AgAhhwIgAKUDACGIAgEA-QIAIYkCAQD3AgAhAwAAAAcAICAAAIQFACAhAACOBQAgCQAAAAcAIAcAAKYDACAZAACOBQAgzwEBAPcCACHSAQEA9wIAIdUBQAD6AgAh6AFAAPoCACHpAUAA-gIAIeoBIAClAwAhBwcAAKYDACDPAQEA9wIAIdIBAQD3AgAh1QFAAPoCACHoAUAA-gIAIekBQAD6AgAh6gEgAKUDACELAwAAnQMAIAYAAJ4DACAHAACfAwAgDwAAoQMAIM8BAQAAAAHRAQEAAAAB0gEBAAAAAdUBQAAAAAHjAQAAAOgBAuUBAQAAAAHmAQEAAAABAgAAAAUAICAAAI8FACADAAAAAwAgIAAAjwUAICEAAJMFACANAAAAAwAgAwAAjgMAIAYAAI8DACAHAACQAwAgDwAAkgMAIBkAAJMFACDPAQEA9wIAIdEBAQD3AgAh0gEBAPcCACHVAUAA-gIAIeMBAACNA-gBIuUBAQD3AgAh5gEBAPkCACELAwAAjgMAIAYAAI8DACAHAACQAwAgDwAAkgMAIM8BAQD3AgAh0QEBAPcCACHSAQEA9wIAIdUBQAD6AgAh4wEAAI0D6AEi5QEBAPcCACHmAQEA-QIAIQwDAAD_AwAgBAAAgAQAIAwAAIIEACANAACDBAAgzwEBAAAAAdUBQAAAAAHkAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQIAAAAB9QEIAAAAAfYBIAAAAAECAAAAiQEAICAAAJQFACANEAAAzQQAIBEAAM8EACASAADQBAAgEwAA0QQAIM8BAQAAAAHVAUAAAAAB4wEBAAAAAeQBQAAAAAHsAQEAAAABhgIBAAAAAYcCIAAAAAGIAgEAAAABiQIBAAAAAQIAAAABACAgAACWBQAgCwMAAJ0DACAGAACeAwAgBwAAnwMAIA4AAKADACDPAQEAAAAB0QEBAAAAAdIBAQAAAAHVAUAAAAAB4wEAAADoAQLlAQEAAAAB5gEBAAAAAQIAAAAFACAgAACYBQAgAwAAAB8AICAAAJQFACAhAACcBQAgDgAAAB8AIAMAAM0DACAEAADOAwAgDAAA0AMAIA0AANEDACAZAACcBQAgzwEBAPcCACHVAUAA-gIAIeQBQAD6AgAh8gEBAPcCACHzAQEA9wIAIfQBAgD4AgAh9QEIAIYDACH2ASAApQMAIQwDAADNAwAgBAAAzgMAIAwAANADACANAADRAwAgzwEBAPcCACHVAUAA-gIAIeQBQAD6AgAh8gEBAPcCACHzAQEA9wIAIfQBAgD4AgAh9QEIAIYDACH2ASAApQMAIQMAAAAuACAgAACWBQAgIQAAnwUAIA8AAAAuACAQAACZBAAgEQAAmwQAIBIAAJwEACATAACdBAAgGQAAnwUAIM8BAQD3AgAh1QFAAPoCACHjAQEA9wIAIeQBQAD6AgAh7AEBAPcCACGGAgEA9wIAIYcCIAClAwAhiAIBAPkCACGJAgEA9wIAIQ0QAACZBAAgEQAAmwQAIBIAAJwEACATAACdBAAgzwEBAPcCACHVAUAA-gIAIeMBAQD3AgAh5AFAAPoCACHsAQEA9wIAIYYCAQD3AgAhhwIgAKUDACGIAgEA-QIAIYkCAQD3AgAhAwAAAAMAICAAAJgFACAhAACiBQAgDQAAAAMAIAMAAI4DACAGAACPAwAgBwAAkAMAIA4AAJEDACAZAACiBQAgzwEBAPcCACHRAQEA9wIAIdIBAQD3AgAh1QFAAPoCACHjAQAAjQPoASLlAQEA9wIAIeYBAQD5AgAhCwMAAI4DACAGAACPAwAgBwAAkAMAIA4AAJEDACDPAQEA9wIAIdEBAQD3AgAh0gEBAPcCACHVAUAA-gIAIeMBAACNA-gBIuUBAQD3AgAh5gEBAPkCACEGCB4FCgANEAYCESAEEiQLEygMBQMAAwYAAQcABA4cCg8dBQIFGgIHAAQGAwoDBAsCCA8FCgAJDBMGDQABAwUAAgYAAQcABAIHAAQLAAcCCRQGCgAIAQkVAAQDFgAEFwAIGAAMGQABBQACAQ0AAQENAAEECCoAECkAEisAEywAAAAAAwoAEiYAEycAFAAAAAMKABImABMnABQBDQABAQ0AAQMKABkmABonABsAAAADCgAZJgAaJwAbAQ0AAQENAAEDCgAgJgAhJwAiAAAAAwoAICYAIScAIgAAAAMKACgmACknACoAAAADCgAoJgApJwAqAQ0AAQENAAEFCgAvJgAyJwAzaAAwaQAxAAAAAAAFCgAvJgAyJwAzaAAwaQAxAAADCgA4JgA5JwA6AAAAAwoAOCYAOScAOgIHAAQLAAcCBwAECwAHAwoAPyYAQCcAQQAAAAMKAD8mAEAnAEEBBwAEAQcABAMKAEYmAEcnAEgAAAADCgBGJgBHJwBIAwMAAwYAAQcABAMDAAMGAAEHAAQDCgBNJgBOJwBPAAAAAwoATSYATicATwEFAAIBBQACBQoAVCYAVycAWGgAVWkAVgAAAAAABQoAVCYAVycAWGgAVWkAVgMFAAIGAAEHAAQDBQACBgABBwAEBQoAXSYAYCcAYWgAXmkAXwAAAAAABQoAXSYAYCcAYWgAXmkAXxQCARUtARYwARcxARgyARo0ARs2Dhw3Dx05AR47Dh88ECI9ASM-ASQ_DihCESlDFSpEDCtFDCxGDC1HDC5IDC9KDDBMDjFNFjJPDDNRDjRSFzVTDDZUDDdVDjhYGDlZHDpaCztbCzxcCz1dCz5eCz9gC0BiDkFjHUJlC0NnDkRoHkVpC0ZqC0drDkhuH0lvI0pxJEtyJEx1JE12JE53JE95JFB7DlF8JVJ-JFOAAQ5UgQEmVYIBJFaDASRXhAEOWIcBJ1mIAStaigEEW4sBBFyNAQRdjgEEXo8BBF-RAQRgkwEOYZQBLGKWAQRjmAEOZJkBLWWaAQRmmwEEZ5wBDmqfAS5roAE0bKIBB22jAQdupgEHb6cBB3CoAQdxqgEHcqwBDnOtATV0rwEHdbEBDnayATZ3swEHeLQBB3m1AQ56uAE3e7kBO3y6AQZ9uwEGfrwBBn-9AQaAAb4BBoEBwAEGggHCAQ6DAcMBPIQBxQEGhQHHAQ6GAcgBPYcByQEGiAHKAQaJAcsBDooBzgE-iwHPAUKMAdABA40B0QEDjgHSAQOPAdMBA5AB1AEDkQHWAQOSAdgBDpMB2QFDlAHbAQOVAd0BDpYB3gFElwHfAQOYAeABA5kB4QEOmgHkAUWbAeUBSZwB5gECnQHnAQKeAegBAp8B6QECoAHqAQKhAewBAqIB7gEOowHvAUqkAfEBAqUB8wEOpgH0AUunAfUBAqgB9gECqQH3AQ6qAfoBTKsB-wFQrAH9AQqtAf4BCq4BgAIKrwGBAgqwAYICCrEBhAIKsgGGAg6zAYcCUbQBiQIKtQGLAg62AYwCUrcBjQIKuAGOAgq5AY8CDroBkgJTuwGTAlm8AZQCBb0BlQIFvgGWAgW_AZcCBcABmAIFwQGaAgXCAZwCDsMBnQJaxAGfAgXFAaECDsYBogJbxwGjAgXIAaQCBckBpQIOygGoAlzLAakCYg"
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
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
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
  client: "7.6.0",
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
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt",
  bankAccountNumber: "bankAccountNumber"
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
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
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
  // 1. ADDED: Tell Better Auth the Backend URL for redirects
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  // 2. MODIFIED: Dynamic origins to allow Vercel previews and local dev
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigins2 = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000"
    ].filter(Boolean);
    if (!origin || allowedOrigins2.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
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
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
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
      <div class="footer"><p>\xA9 2026 SKILLBRIDGE ECOSYSTEM</p></div>
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
    }
  },
  // 3. ADDED: Advanced settings for Production Cookies
  advanced: {
    cookiePrefix: "skillbridge-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    // Essential for cross-domain frontend/backend
    sameSiteCookie: "none"
  },
  // 4. ADDED: Performance caching for sessions
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
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
  async getTeacherBookings(identifier) {
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
      return { bookings: [], totalEarnings: 0 };
    }
    const bookings = await prisma.booking.findMany({
      where: {
        tutorId: profile.id
      },
      include: {
        student: {
          select: {
            name: true,
            image: true,
            email: true
          }
        },
        availability: {
          select: {
            startTime: true,
            endTime: true
          }
        },
        // CHANGED: Include the entire payment record without specifying fields
        payment: true
      },
      orderBy: {
        availability: {
          startTime: "asc"
        }
      }
    });
    const totalEarnings = bookings.reduce((sum, booking) => {
      if (booking.payment && (booking.payment.status === "COMPLETED" || booking.payment.status === "PAID")) {
        return sum + (booking.payment.amount || 0);
      }
      return sum;
    }, 0);
    return {
      bookings,
      totalEarnings
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
var bookingService = {
  createBookingService,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking
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
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/tutors/${tutorId}`,
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
var router2 = Router6();
router2.get("/", getAllReviewsController);
router2.post("/", createReviewController);
router2.put("/:id", updateReviewController);
router2.delete("/:id", deleteReviewController);
router2.get("/:id", getReviewStatsHandler);
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

// src/routes/webhook.routes.ts
import express from "express";
var router3 = express.Router();
router3.post(
  "/stripe",
  express.raw({ type: "application/json" }),
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
var webhook_routes_default = router3;

// src/app.ts
dotenv.config();
var app = express2();
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
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("SkillBridge API is running...");
});
app.use("/api/categories", categories_routes_default);
app.use("/api/tutor", tutors_routes_default);
app.use("/api/support", supportemail_default);
app.use("/api/availability", availability_routes_default);
app.use("/api/bookings", bookings_routes_default);
app.use("/api/reviews", reviews_routes_default);
app.use("/api/users", users_routes_default);
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
