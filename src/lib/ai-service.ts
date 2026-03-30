import { supabase } from "@/integrations/supabase/client";

async function callAI(messages: { role: string; content: string }[], type: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("chat", {
    body: { messages, type },
  });

  if (error) throw new Error(error.message || "AI request failed");
  if (data?.error) throw new Error(data.error);
  return data.content;
}

export async function generateScript(topic: string): Promise<string> {
  return callAI(
    [{ role: "user", content: `Write a complete YouTube video script about: ${topic}` }],
    "script"
  );
}

export async function chatWithAI(message: string): Promise<string> {
  return callAI(
    [{ role: "user", content: message }],
    "chat"
  );
}

export async function getTrendingIdeas(): Promise<string[]> {
  const content = await callAI(
    [{ role: "user", content: "Generate 6 trending YouTube video ideas for 2025" }],
    "trending"
  );
  return content.split("\n").filter((line) => line.trim().length > 0).slice(0, 6);
}

export async function generateTitles(topic: string): Promise<string[]> {
  const content = await callAI(
    [{ role: "user", content: `Generate YouTube title ideas for: ${topic}` }],
    "titles"
  );
  return content
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => line.replace(/^\d+[\.\)]\s*/, ""))
    .slice(0, 5);
}

export async function generateThumbnail(idea: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("chat", {
    body: {
      messages: [{ role: "user", content: idea }],
      type: "thumbnail",
    },
  });

  if (error) throw new Error(error.message || "Thumbnail generation failed");
  if (data?.error) throw new Error(data.error);
  return data.imageUrl;
}

// localStorage helpers
const SCRIPTS_KEY = "yt-content-lab-scripts";

export interface SavedScript {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
}

export function getSavedScripts(): SavedScript[] {
  try {
    return JSON.parse(localStorage.getItem(SCRIPTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveScript(topic: string, content: string): SavedScript {
  const scripts = getSavedScripts();
  const newScript: SavedScript = {
    id: crypto.randomUUID(),
    topic,
    content,
    createdAt: new Date().toISOString(),
  };
  scripts.unshift(newScript);
  localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts.slice(0, 20)));
  return newScript;
}

export function deleteScript(id: string) {
  const scripts = getSavedScripts().filter((s) => s.id !== id);
  localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
}
