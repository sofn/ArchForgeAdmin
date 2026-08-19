import { http } from "@/utils/http";
import { getToken } from "@/utils/auth";

type Envelope<T> = {
  code: number;
  message: string;
  data: T;
};

export type ChatConfigStatus = {
  provider: string;
  model: string;
  baseUrl: string;
  configured: boolean;
};

export const getChatConfig = () =>
  http.request<Envelope<ChatConfigStatus>>("get", "/admin/chat/config");

export const createChatSession = () =>
  http.request<Envelope<{ id: string }>>("post", "/admin/chat/sessions");

export const listChatSessions = () =>
  http.request<Envelope<Array<{ id: string }>>>("get", "/admin/chat/sessions");

export async function streamChatMessage(
  sessionId: string,
  content: string,
  onDelta: (text: string) => void
) {
  const token = getToken();
  const response = await fetch(
    `/api/admin/chat/sessions/${sessionId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Authorization: token?.accessToken ? `Bearer ${token.accessToken}` : ""
      },
      body: JSON.stringify({ content })
    }
  );
  if (!response.ok || !response.body) {
    throw new Error(`chat failed: ${response.status}`);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";
    for (const chunk of chunks) {
      const dataLine = chunk.split("\n").find(line => line.startsWith("data:"));
      if (!dataLine) continue;
      const payload = dataLine.slice(5).trim();
      if (payload && payload !== "[DONE]") {
        onDelta(payload);
      }
    }
  }
}
