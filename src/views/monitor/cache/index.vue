<script setup lang="ts">
import { useCache } from "./hook";

defineOptions({
  name: "CacheInfo"
});

const { loading, cacheData } = useCache();

const fields = [
  { label: "Key 总数", key: "dbSize" },
  { label: "已用内存", key: "usedMemoryHuman" },
  { label: "已用内存(字节)", key: "usedMemory" },
  { label: "客户端连接数", key: "connectedClients" },
  { label: "每秒操作数", key: "instantaneousOpsPerSec" },
  { label: "总命令处理数", key: "totalCommandsProcessed" },
  { label: "命中次数", key: "keyspaceHits" },
  { label: "未命中次数", key: "keyspaceMisses" }
];
</script>

<template>
  <div v-loading="loading" class="p-4">
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="flex items-center">
          <IconifyIconOffline icon="ep:reading" class="mr-2 text-lg" />
          <span class="font-bold">缓存监控</span>
        </div>
      </template>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item
          v-for="item in fields"
          :key="item.key"
          :label="item.label"
        >
          {{ cacheData[item.key] ?? "-" }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="hover">
      <template #header>
        <div class="flex items-center">
          <IconifyIconOffline icon="ep:document" class="mr-2 text-lg" />
          <span class="font-bold">Redis INFO</span>
        </div>
      </template>
      <el-input
        v-model="cacheData.info"
        type="textarea"
        :rows="20"
        readonly
        resize="none"
      />
    </el-card>

    <div class="text-center text-xs text-gray-400 mt-2">
      数据每 10 秒自动刷新
    </div>
  </div>
</template>
