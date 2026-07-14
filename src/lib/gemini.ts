import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Using the specific model version requested by the user
export const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash-lite",
});

export const generateQuizFromTranscript = async (transcript: string) => {
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
  
  // Extract JSON if model wraps it in markdown blocks
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to generate valid JSON from Gemini");
  }
  
  return JSON.parse(jsonMatch[0]);
};

export const generateSummaryFromTranscript = async (transcript: string) => {
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
  
  // Extract JSON if model wraps it in markdown blocks
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to generate valid JSON summary from Gemini");
  }
  
  return JSON.parse(jsonMatch[0]);
};
