<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { getServerInfo } from "@/api/system";

defineOptions({
  name: "ServerInfo"
});

const loading = ref(true);
const serverData = ref<any>({});
let timer: any = null;

async function fetchData() {
  loading.value = true;
  try {
    const { code, data } = await getServerInfo();
    if (code === 0) {
      serverData.value = data;
    }
  } finally {
    loading.value = false;
  }
}

function getProgressColor(usage: number) {
  if (usage < 50) return "#67c23a";
  if (usage < 80) return "#e6a23c";
  return "#f56c6c";
}

onMounted(() => {
  fetchData();
  timer = setInterval(fetchData, 10000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div v-loading="loading" class="p-4">
    <el-row :gutter="16">
      <!-- CPU -->
      <el-col :span="12" :xs="24" class="mb-4">
        <el-card shadow="hover">
          <template #header>
            <div class="flex items-center">
              <IconifyIconOffline icon="ep:cpu" class="mr-2 text-lg" />
              <span class="font-bold">CPU 信息</span>
            </div>
          </template>
          <template v-if="serverData.cpu">
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="处理器">{{
                serverData.cpu.name
              }}</el-descriptions-item>
              <el-descriptions-item label="核心数">
                {{ serverData.cpu.physicalCount }}核
                {{ serverData.cpu.logicalCount }}线程
              </el-descriptions-item>
              <el-descriptions-item label="用户使用率"
                >{{ serverData.cpu.userUsage }}%</el-descriptions-item
              >
              <el-descriptions-item label="系统使用率"
                >{{ serverData.cpu.sysUsage }}%</el-descriptions-item
              >
            </el-descriptions>
            <div class="mt-4 flex-c">
              <el-progress
                type="dashboard"
                :percentage="serverData.cpu.usage || 0"
                :color="getProgressColor(serverData.cpu.usage)"
                :width="120"
              >
                <template #default="{ percentage }">
                  <span class="text-lg font-bold">{{ percentage }}%</span>
                  <br />
                  <span class="text-xs text-gray-400">CPU使用率</span>
                </template>
              </el-progress>
            </div>
          </template>
        </el-card>
      </el-col>

      <!-- Memory -->
      <el-col :span="12" :xs="24" class="mb-4">
        <el-card shadow="hover">
          <template #header>
            <div class="flex items-center">
              <IconifyIconOffline icon="ep:coin" class="mr-2 text-lg" />
              <span class="font-bold">内存信息</span>
            </div>
          </template>
          <template v-if="serverData.memory">
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="总内存">{{
                serverData.memory.total
              }}</el-descriptions-item>
              <el-descriptions-item label="已使用">{{
                serverData.memory.used
              }}</el-descriptions-item>
              <el-descriptions-item label="可用内存">{{
                serverData.memory.available
              }}</el-descriptions-item>
              <el-descriptions-item label="使用率"
                >{{ serverData.memory.usage }}%</el-descriptions-item
              >
            </el-descriptions>
            <div class="mt-4 flex-c">
              <el-progress
                type="dashboard"
                :percentage="serverData.memory.usage || 0"
                :color="getProgressColor(serverData.memory.usage)"
                :width="120"
              >
                <template #default="{ percentage }">
                  <span class="text-lg font-bold">{{ percentage }}%</span>
                  <br />
                  <span class="text-xs text-gray-400">内存使用率</span>
                </template>
              </el-progress>
            </div>
          </template>
        </el-card>
      </el-col>

      <!-- JVM -->
      <el-col :span="12" :xs="24" class="mb-4">
        <el-card shadow="hover">
          <template #header>
            <div class="flex items-center">
              <IconifyIconOffline icon="ri:java-line" class="mr-2 text-lg" />
              <span class="font-bold">JVM 信息</span>
            </div>
          </template>
          <template v-if="serverData.jvm">
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="Java版本">{{
                serverData.jvm.javaVersion
              }}</el-descriptions-item>
              <el-descriptions-item label="JVM名称">{{
                serverData.jvm.vmName
              }}</el-descriptions-item>
              <el-descriptions-item label="堆内存最大">{{
                serverData.jvm.heapMax
              }}</el-descriptions-item>
              <el-descriptions-item label="堆内存已用">{{
                serverData.jvm.heapUsed
              }}</el-descriptions-item>
              <el-descriptions-item label="非堆内存">{{
                serverData.jvm.nonHeapUsed
              }}</el-descriptions-item>
              <el-descriptions-item label="运行时间">{{
                serverData.jvm.uptime
              }}</el-descriptions-item>
            </el-descriptions>
            <div class="mt-4 flex-c">
              <el-progress
                type="dashboard"
                :percentage="serverData.jvm.heapUsage || 0"
                :color="getProgressColor(serverData.jvm.heapUsage)"
                :width="120"
              >
                <template #default="{ percentage }">
                  <span class="text-lg font-bold">{{ percentage }}%</span>
                  <br />
                  <span class="text-xs text-gray-400">堆使用率</span>
                </template>
              </el-progress>
            </div>
          </template>
        </el-card>
      </el-col>

      <!-- OS -->
      <el-col :span="12" :xs="24" class="mb-4">
        <el-card shadow="hover">
          <template #header>
            <div class="flex items-center">
              <IconifyIconOffline icon="ep:monitor" class="mr-2 text-lg" />
              <span class="font-bold">系统信息</span>
            </div>
          </template>
          <template v-if="serverData.os">
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="操作系统">{{
                serverData.os.name
              }}</el-descriptions-item>
              <el-descriptions-item label="系统架构">{{
                serverData.os.arch
              }}</el-descriptions-item>
              <el-descriptions-item label="主机名称">{{
                serverData.os.hostName
              }}</el-descriptions-item>
              <el-descriptions-item label="主机地址">{{
                serverData.os.hostAddress
              }}</el-descriptions-item>
              <el-descriptions-item label="进程数">{{
                serverData.os.processCount
              }}</el-descriptions-item>
              <el-descriptions-item label="线程数">{{
                serverData.os.threadCount
              }}</el-descriptions-item>
            </el-descriptions>
          </template>
        </el-card>
      </el-col>
    </el-row>

    <!-- Disks -->
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="flex items-center">
          <IconifyIconOffline icon="ep:files" class="mr-2 text-lg" />
          <span class="font-bold">磁盘信息</span>
        </div>
      </template>
      <el-table
        v-if="serverData.disks"
        :data="serverData.disks"
        border
        size="small"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
      >
        <el-table-column prop="name" label="盘符" min-width="100" />
        <el-table-column prop="mount" label="挂载点" min-width="120" />
        <el-table-column prop="type" label="文件系统" min-width="100" />
        <el-table-column prop="total" label="总大小" min-width="100" />
        <el-table-column prop="used" label="已使用" min-width="100" />
        <el-table-column prop="available" label="可用" min-width="100" />
        <el-table-column label="使用率" min-width="180">
          <template #default="{ row }">
            <el-progress
              :percentage="row.usage"
              :color="getProgressColor(row.usage)"
              :stroke-width="10"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="text-center text-xs text-gray-400 mt-2">
      数据每 10 秒自动刷新
    </div>
  </div>
</template>

<style scoped>
.flex-c {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
