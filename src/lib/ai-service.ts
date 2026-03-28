// Simulated AI responses for demo purposes
// In production, these would call real AI APIs via edge functions

const SCRIPT_TEMPLATES = [
  (topic: string) => `🎬 **YouTube Script: ${topic}**\n\n---\n\n**[HOOK - 0:00-0:15]**\n\n"What if I told you that ${topic} could completely change the way you think? Stay with me for the next 10 minutes, because this is going to blow your mind."\n\n---\n\n**[INTRO - 0:15-1:00]**\n\nHey everyone, welcome back to the channel! Today we're diving deep into ${topic}. If you're new here, make sure to hit that subscribe button and the bell icon so you never miss a video.\n\n---\n\n**[MAIN CONTENT - 1:00-7:00]**\n\n**Point 1: The Basics**\nLet's start with the fundamentals of ${topic}. Most people don't realize that...\n\n**Point 2: The Deep Dive**\nNow here's where it gets really interesting. When you look at ${topic} from a different angle...\n\n**Point 3: Practical Application**\nSo how can you actually use this in your daily life? Here are 3 actionable steps...\n\n---\n\n**[CTA - 7:00-8:00]**\n\nIf you found this video helpful, smash that like button and share it with someone who needs to hear this. Drop a comment below telling me your thoughts on ${topic}.\n\n---\n\n**[OUTRO - 8:00-8:30]**\n\nThanks for watching! I'll see you in the next one. Peace! ✌️`,
];

const CHAT_RESPONSES: Record<string, string[]> = {
  default: [
    "Great question! Here's my strategy recommendation:\n\n1. **Content Pillars** — Define 3-4 core topics your channel covers\n2. **Upload Schedule** — Consistency beats frequency. Start with 1-2 videos/week\n3. **Thumbnail Strategy** — Use contrasting colors, big text, emotional faces\n4. **SEO Optimization** — Research keywords using tools like TubeBuddy or vidIQ\n5. **Community Building** — Reply to every comment in the first hour",
    "Here's what I'd suggest for growing your channel:\n\n📊 **Analytics First** — Check your audience retention graphs. Where do people drop off?\n\n🎯 **Niche Down** — The riches are in the niches. Be specific about who you serve.\n\n🔄 **Repurpose Content** — Turn your videos into Shorts, tweets, and blog posts.\n\n🤝 **Collaborate** — Find channels your size and cross-promote.\n\n⏰ **Timing** — Post when your audience is most active (check YouTube Studio analytics).",
    "Let me break down a winning content strategy:\n\n**The 3H Framework:**\n- 🏠 **Hub** content (regular series, builds community)\n- 💡 **Help** content (tutorials, how-tos, SEO-driven)\n- 🎆 **Hero** content (big productions, viral potential)\n\n**Pro Tips:**\n- Hook viewers in the first 5 seconds\n- Use pattern interrupts every 30-60 seconds\n- End with a strong CTA + next video teaser\n- A/B test thumbnails using YouTube's built-in feature",
  ],
};

const TRENDING_IDEAS = [
  "🔥 AI Tools Nobody Talks About in 2025",
  "💰 How I Made $10K/Month with YouTube Automation",
  "🧠 The Psychology Behind Viral Videos",
  "📱 iPhone vs Android: The REAL Difference in 2025",
  "🎮 Games That Will Blow Up This Year",
  "🏋️ 30-Day Fitness Challenge Results (SHOCKING)",
  "🍳 $1 vs $1000 Cooking Challenge",
  "✈️ Hidden Travel Destinations You NEED to Visit",
  "📚 Books That Changed My Life Forever",
  "🎵 Making a Hit Song in 24 Hours",
  "🤖 I Let AI Run My Life for a Week",
  "💻 Learn to Code in 30 Days Challenge",
];

const TITLE_TEMPLATES = [
  (topic: string) => `I Tried ${topic} for 30 Days — Here's What Happened`,
  (topic: string) => `${topic}: Everything You Need to Know in 2025`,
  (topic: string) => `Why ${topic} is Taking Over the Internet`,
  (topic: string) => `The TRUTH About ${topic} Nobody Tells You`,
  (topic: string) => `${topic} Changed My Life — Here's How`,
  (topic: string) => `I Asked 100 Experts About ${topic}`,
  (topic: string) => `Stop Making These ${topic} Mistakes!`,
  (topic: string) => `${topic} for Beginners (Complete Guide)`,
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateScript(topic: string): Promise<string> {
  await delay(1500 + Math.random() * 1000);
  const template = SCRIPT_TEMPLATES[Math.floor(Math.random() * SCRIPT_TEMPLATES.length)];
  return template(topic);
}

export async function chatWithAI(message: string): Promise<string> {
  await delay(1000 + Math.random() * 1500);
  const responses = CHAT_RESPONSES.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function getTrendingIdeas(): Promise<string[]> {
  await delay(800);
  const shuffled = [...TRENDING_IDEAS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
}

export async function generateTitles(topic: string): Promise<string[]> {
  await delay(1000);
  const shuffled = [...TITLE_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).map((fn) => fn(topic));
}

export async function generateThumbnail(idea: string): Promise<string> {
  await delay(2000);
  // Return a placeholder gradient image via canvas
  return idea;
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
