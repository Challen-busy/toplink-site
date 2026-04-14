import OpenAI from "openai";

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

function createClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env or Vercel environment variables.",
    );
  }
  return new OpenAI({ apiKey });
}

export const openai = globalForOpenAI.openai ?? createClient();

if (process.env.NODE_ENV !== "production") globalForOpenAI.openai = openai;
