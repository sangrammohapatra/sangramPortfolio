// The system prompt is the actual source of truth for what the AI chat widget
// answers with — it lives in server/data/resumeContext.json so the serverless
// function can enforce it server-side too (the client only sends the
// conversation, never the prompt; see api/ai/chat.js). Update the JSON file
// whenever the resume changes, not this file.
import resumeContext from "../../server/data/resumeContext.json";

export const RESUME_CONTEXT = resumeContext.systemPrompt;
export const SUGGESTED_QUESTIONS = resumeContext.suggestedQuestions;
