import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post("/chat", async (req, res) => {
  try {
    const { message, userRole = "guest", userName = "User" } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

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
      - Constraint: NEVER exceed 4 sentences. Use emojis (🚀, ✨, 💳).
      - Formatting: Use bullet points for steps.
    `;

    const result = await model.generateContent(`${context}\n\nUser: ${message}`);
    const text = result.response.text();

    return res.json({ text });
  } catch (error: any) {
    console.error("SkillBot Log:", error.message);
    return res.status(500).json({ text: "I'm having a quick technical snack! ⚡ Try again in a second! 💳" });
  }
});

export default router;