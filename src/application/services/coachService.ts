import { apiClient } from "@/infrastructure/api/apiClient";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
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
    const res = await apiClient.get<ApiResponse<ChatMessage[]>>("/coach/history");
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to load chat history:", error);
    throw new Error("Failed to load chat history");
  }
}

export async function sendMessage(userText: string): Promise<ChatMessage> {
  try {
    const res = await apiClient.post<ApiResponse<ChatMessage>>("/coach/chat", {
      message: userText,
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw new Error("Failed to send message to AI coach. Please try again.");
  }
}
