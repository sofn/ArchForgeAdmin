import { ref } from "vue";
import { getDictTypeByCode, getDictTypePage } from "@/api/dict";

export type DictOption = {
  label: string;
  value: string;
};

const globalDictMap = ref<Record<string, DictOption[]>>({});

export function useDict() {
  const loading = ref(false);

  const loadDict = async (dictCode: string) => {
    if (!dictCode) return [];
    if (globalDictMap.value[dictCode]) {
      return globalDictMap.value[dictCode];
    }
    loading.value = true;
    try {
      const res = await getDictTypeByCode(dictCode);
      if (res?.code === 0 && res.data?.items) {
        const options = res.data.items
          .filter(item => item.status === 1)
          .sort((a, b) => a.sort - b.sort)
          .map(item => ({
            label: item.itemLabel,
            value: item.itemCode
          }));
        globalDictMap.value[dictCode] = options;
        return options;
      }
    } finally {
      loading.value = false;
    }
    return [];
  };

  const getDictLabel = (dictCode: string, value: any) => {
    if (!dictCode || value === null || value === undefined) return value;
    const options = globalDictMap.value[dictCode];
    if (!options) return value;
    return options.find(o => String(o.value) === String(value))?.label ?? value;
  };

  return {
    dictMap: globalDictMap,
    loading,
    loadDict,
    getDictLabel
  };
}

export function loadDictTypes() {
  return getDictTypePage({ currentPage: 1, pageSize: 1000 });
}
