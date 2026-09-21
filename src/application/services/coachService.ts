import { apiClient } from "@/infrastructure/api/apiClient";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface BackendChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export async function getHistory(): Promise<ChatMessage[]> {
  if (typeof window === "undefined") return [];
  try {
    const res = await apiClient.get<ApiResponse<BackendChatMessage[]>>("/coach/history");
    const data = res.data?.data || [];
    return data.map((msg: BackendChatMessage) => ({
      id: msg.id,
      role: msg.sender || "assistant",
      content: msg.text || "",
      timestamp: msg.timestamp,
    }));
  } catch (error) {
    console.error("Failed to load chat history:", error);
    throw new Error("Failed to load chat history");
  }
}

export async function sendMessage(userText: string): Promise<ChatMessage> {
  try {
    const res = await apiClient.post<ApiResponse<BackendChatMessage>>("/coach/chat", {
      message: userText,
    });
    const msg = res.data.data;
    return {
      id: msg.id,
      role: msg.sender || "assistant",
      content: msg.text || "",
      timestamp: msg.timestamp,
    };
  } catch (error) {
    console.error("Failed to send message:", error);
    throw new Error("Failed to send message to AI coach. Please try again.");
  }
}

