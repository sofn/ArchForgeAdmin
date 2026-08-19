<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  createChatSession,
  getChatConfig,
  streamChatMessage,
  type ChatConfigStatus
} from "@/api/chat";
import { message } from "@/utils/message";

defineOptions({
  name: "ChatAi"
});

const config = ref<ChatConfigStatus>();
const sessionId = ref("");
const input = ref("");
const reply = ref("");
const sending = ref(false);

onMounted(async () => {
  const status = await getChatConfig();
  config.value = status.data;
  const session = await createChatSession();
  sessionId.value = session.data.id;
});

async function onSend() {
  if (!input.value.trim() || !sessionId.value) return;
  if (!config.value?.configured) {
    message("请先在后端配置 LLM_API_KEY / LLM_PROVIDER / LLM_BASE_URL", {
      type: "warning"
    });
    return;
  }
  sending.value = true;
  reply.value = "";
  try {
    await streamChatMessage(sessionId.value, input.value, text => {
      reply.value += text;
    });
    input.value = "";
  } catch (error) {
    message(String(error), { type: "error" });
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <el-card shadow="never">
    <template #header>ChatAI（OpenAI / Anthropic 兼容）</template>
    <p class="mb-3 text-sm">
      Provider: {{ config?.provider || "-" }} / Model:
      {{ config?.model || "-" }}
      /
      {{ config?.configured ? "已配置 API Key" : "未配置 API Key" }}
    </p>
    <p class="mb-4 text-sm text-text_color_regular">
      在 ArchForge `.env` 或环境变量中填写
      `LLM_PROVIDER=openai|anthropic`、`LLM_BASE_URL`、`LLM_API_KEY`、`LLM_MODEL`。
    </p>
    <el-input
      v-model="input"
      type="textarea"
      :rows="4"
      placeholder="输入问题后发送，后端以 SSE 返回 delta/done"
    />
    <div class="mt-3">
      <el-button type="primary" :loading="sending" @click="onSend"
        >发送</el-button
      >
    </div>
    <el-input
      class="mt-4"
      type="textarea"
      :rows="10"
      readonly
      :model-value="reply"
      placeholder="模型回复"
    />
  </el-card>
</template>
