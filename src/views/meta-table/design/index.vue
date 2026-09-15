<script setup lang="ts">
import { ref, onMounted, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import TableForm from "../form/TableForm.vue";
import SchemaPreviewContent from "./SchemaPreviewContent.vue";
import {
  createMetaTable,
  updateMetaTable,
  previewMetaTableSchema,
  getMetaTableDetail
} from "@/api/metaTable";
import type { SchemaPreview } from "@/api/metaTable";
import { message } from "@/utils/message";
import { assertOk, EnvelopeError } from "@/utils/http/envelope";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import type { MetaTable } from "../utils/types";

defineOptions({
  name: "MetaTableDesign"
});

const route = useRoute();
const router = useRouter();
const tableFormRef = ref();
const formInline = ref<MetaTable>({
  tableCode: "",
  tableName: "",
  description: "",
  tablePrefix: "meta_",
  status: 1,
  columns: []
});
const isEdit = ref(false);
const id = ref<number | undefined>(undefined);

onMounted(async () => {
  const queryId = route.query.id;
  if (queryId) {
    isEdit.value = true;
    id.value = Number(queryId);
    const { code, data } = await getMetaTableDetail(id.value);
    if (code === 0) {
      formInline.value = {
        ...(data as MetaTable),
        columns: data.columns ?? []
      };
    }
  }
});

async function submitUpdate(curData: MetaTable) {
  await assertOk(updateMetaTable(id.value!, curData));
  message(`已修改元表格"${curData.tableName}"`, { type: "success" });
  closeTabAndBack();
}

/** 有结构变更时弹出 diff 预览（含违规行数/处置方式），确认后才提交。 */
function openPreviewDialog(curData: MetaTable, preview: SchemaPreview) {
  addDialog({
    title: `Schema 变更预览（${preview.changes.length} 项）`,
    props: { preview },
    width: "60%",
    draggable: true,
    fullscreen: deviceDetection(),
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(SchemaPreviewContent, { preview }),
    beforeSure: async done => {
      try {
        await submitUpdate(curData);
        done();
      } catch (e) {
        if (e instanceof EnvelopeError) {
          message(e.message, { type: "error" });
        }
      }
    }
  });
}

async function saveEdit(curData: MetaTable) {
  const preview = await assertOk(previewMetaTableSchema(id.value!, curData));
  const changes = preview.data?.changes ?? [];
  if (changes.length === 0) {
    await submitUpdate(curData);
    return;
  }
  openPreviewDialog(curData, {
    changes,
    dangerous: preview.data?.dangerous ?? false
  });
}

async function handleSave() {
  const formRef = tableFormRef.value?.getRef();
  if (!formRef) return;
  formRef.validate(async valid => {
    if (!valid) return;
    const curData = tableFormRef.value.getForm() as MetaTable;
    if (!curData.columns || curData.columns.length === 0) {
      message("请至少配置一个字段", { type: "warning" });
      return;
    }
    try {
      if (isEdit.value && id.value) {
        await saveEdit(curData);
      } else {
        await assertOk(createMetaTable(curData));
        message(`已新增元表格"${curData.tableName}"`, { type: "success" });
        closeTabAndBack();
      }
    } catch (e) {
      // HTTP errors are toasted by the http interceptor; envelope failures here
      if (e instanceof EnvelopeError) message(e.message, { type: "error" });
    }
  });
}

function handleBack() {
  closeTabAndBack();
}

function closeTabAndBack() {
  const currentPath = route.path;
  useMultiTagsStoreHook().handleTags("splice", currentPath);
  router.push("/meta-table/index");
}
</script>

<template>
  <div class="main">
    <el-card shadow="never">
      <template #header>
        <div class="flex-bc">
          <span class="font-medium">{{
            isEdit ? "修改元表格" : "新增元表格"
          }}</span>
          <div class="flex gap-2">
            <el-button @click="handleBack">返回</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </div>
      </template>
      <TableForm ref="tableFormRef" :form-inline="formInline" />
    </el-card>
  </div>
</template>
