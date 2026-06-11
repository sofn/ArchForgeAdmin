<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listQuartzLogs, type QuartzLog } from "@/api/quartz";
import type { PaginationProps } from "@pureadmin/table";
import { logColumns } from "./utils/log-columns";

const props = defineProps<{
  jobId: number;
  jobName: string;
}>();

const loading = ref(false);
const dataList = ref<QuartzLog[]>([]);
const pagination = ref<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

async function load() {
  loading.value = true;
  try {
    const { code, data } = await listQuartzLogs({
      jobId: props.jobId,
      currentPage: pagination.value.currentPage,
      pageSize: pagination.value.pageSize
    });
    if (code === 0 && data) {
      dataList.value = data.list;
      pagination.value.total = data.total;
    }
  } finally {
    loading.value = false;
  }
}

onMounted(load);

function onPageChange(page: number) {
  pagination.value.currentPage = page;
  load();
}
function onPageSizeChange(size: number) {
  pagination.value.pageSize = size;
  load();
}
</script>

<template>
  <div>
    <div class="mb-2 text-sm text-gray-600">
      任务: <span class="font-bold">{{ jobName }}</span>
    </div>
    <pure-table
      v-loading="loading"
      row-key="id"
      :data="dataList"
      :columns="logColumns"
      :pagination="pagination"
      adaptive
      :adaptiveConfig="{ offsetBottom: 60 }"
      @page-current-change="onPageChange"
      @page-size-change="onPageSizeChange"
    />
  </div>
</template>
