// Application Service: AI Coach (mock responses)

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const KEY = "ascend:coach";

const GREETINGS = [
  "Welcome back. How can I help you grow today?",
  "Good to see you. What are we working on today?",
  "Ready to accelerate your progress. What's on your mind?",
];

const RESPONSES: Record<string, string> = {
  goal: "Great focus on your goals! Try breaking each goal into a 3-step micro-plan for this week. What's your most important goal right now?",
  habit:
    "Habits compound over time — you're building the right foundation. Your current streak is impressive. What habit feels hardest to maintain?",
  stress:
    "Stress is information. Let's convert it: what specifically triggered it? Once identified, we can build a response protocol.",
  motivation:
    "Motivation follows action, not the other way around. Start with 2 minutes on your lowest-resistance task and momentum will build.",
  journal:
    "Journaling is a high-leverage tool. Daily entries correlate with 34% better goal completion. What would you like to reflect on?",
  sleep:
    "Sleep is the highest-ROI performance lever. Even 30 minutes more can increase focus by 20%. What's your current sleep schedule?",
  focus:
    "Deep work requires an environment contract. Remove all notifications for 90 minutes and signal to others you're unavailable. Try it today.",
  default:
    "That's worth exploring further. Tell me more — what's the core challenge underneath this? I want to give you a precise response.",
};

function pickResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (key !== "default" && lower.includes(key)) return val;
  }
  return RESPONSES.default;
}

export function getHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function initHistory(): ChatMessage[] {
  const history = getHistory();
  if (history.length > 0) return history;
  const greeting: ChatMessage = {
    id: `msg_init`,
    role: "assistant",
    content: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
    timestamp: new Date().toISOString(),
  };
  const updated = [greeting];
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export async function sendMessage(userText: string): Promise<ChatMessage[]> {
  const history = getHistory();
  const userMsg: ChatMessage = {
    id: `msg_${Date.now()}`,
    role: "user",
    content: userText,
    timestamp: new Date().toISOString(),
  };
  const withUser = [...history, userMsg];
  localStorage.setItem(KEY, JSON.stringify(withUser));

  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

  const assistantMsg: ChatMessage = {
    id: `msg_${Date.now() + 1}`,
    role: "assistant",
    content: pickResponse(userText),
    timestamp: new Date().toISOString(),
  };
  const final = [...withUser, assistantMsg];
  localStorage.setItem(KEY, JSON.stringify(final));
  return final;
}

export function clearHistory(): void {
  localStorage.removeItem(KEY);
}
