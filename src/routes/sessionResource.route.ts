import { Router } from "express";
import { prisma } from "../lib/prisma";
import { generateQuizFromTranscript, generateSummaryFromTranscript } from "../lib/gemini";

const router = Router();

// Get session resource by bookingId
router.get("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const resource = await prisma.sessionResource.findUnique({
      where: { bookingId },
    });
    
    if (!resource) {
      return res.status(404).json({ message: "No resources found for this session." });
    }
    
    res.json(resource);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload transcript (upsert)
router.post("/transcript", async (req, res) => {
  try {
    const { bookingId, transcriptText } = req.body;
    
    if (!bookingId || !transcriptText) {
      return res.status(400).json({ message: "Booking ID and transcript text are required." });
    }

    const resource = await prisma.sessionResource.upsert({
      where: { bookingId },
      update: { transcriptText },
      create: { bookingId, transcriptText },
    });

    res.json(resource);
  } catch (error: any) {
    console.error("Transcript upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Generate quiz based on transcript
router.post("/generate-quiz", async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required." });
    }

    const resource = await prisma.sessionResource.findUnique({
      where: { bookingId },
    });

    if (!resource || !resource.transcriptText) {
      return res.status(404).json({ message: "Transcript not found. Please upload a transcript first." });
    }

    // Generate quiz using Gemini
    const quizData = await generateQuizFromTranscript(resource.transcriptText);

    // Save quiz data to DB
    const updatedResource = await prisma.sessionResource.update({
      where: { bookingId },
      data: { quizData },
    });

    res.json(updatedResource);
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: "Failed to generate quiz. " + error.message });
  }
});

// Generate summary (notes) based on transcript (On-the-fly, no DB save)
router.post("/generate-summary", async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required." });
    }

    const resource = await prisma.sessionResource.findUnique({
      where: { bookingId },
    });

    if (!resource || !resource.transcriptText) {
      return res.status(404).json({ message: "Transcript not found. Please upload a transcript first." });
    }

    // Generate summary using Gemini
    const summaryData = await generateSummaryFromTranscript(resource.transcriptText);

    // Return summary data immediately (No DB storage as requested)
    res.json(summaryData);
  } catch (error: any) {
    console.error("Summary generation error:", error);
    res.status(500).json({ error: "Failed to generate summary. " + error.message });
  }
});

export default router;
