import { getCacheInfo } from "@/api/system";
import { ref, onMounted, onUnmounted } from "vue";

export function useCache() {
  const loading = ref(true);
  const cacheData = ref<Record<string, any>>({});
  let timer: ReturnType<typeof setInterval> | null = null;

  async function fetchData() {
    loading.value = true;
    try {
      const { code, data } = await getCacheInfo();
      if (code === 0) {
        cacheData.value = data || {};
      }
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    fetchData();
    timer = setInterval(fetchData, 10000);
  });

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });

  return {
    loading,
    cacheData,
    fetchData
  };
}
