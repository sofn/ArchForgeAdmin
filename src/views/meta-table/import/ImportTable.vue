<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  getImportableTables,
  getImportPreview,
  importExistingTable,
  type ImportableTableInfo,
  type TableImportPreview
} from "@/api/metaTable";
import { assertOk, EnvelopeError } from "@/utils/http/envelope";
import { message } from "@/utils/message";

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const loading = ref(false);
const list = ref<ImportableTableInfo[]>([]);
const step = ref<"list" | "preview">("list");
const preview = ref<TableImportPreview | null>(null);
const importing = ref(false);
const displayName = ref("");
const description = ref("");

async function loadList() {
  loading.value = true;
  try {
    const { data } = await assertOk(getImportableTables());
    list.value = data ?? [];
  } catch (e) {
    if (e instanceof EnvelopeError) message(e.message, { type: "error" });
  } finally {
    loading.value = false;
  }
}

async function openPreview(row: ImportableTableInfo) {
  loading.value = true;
  try {
    const { data } = await assertOk(getImportPreview(row.tableName));
    preview.value = data;
    displayName.value = data.comment ?? "";
    description.value = "";
    step.value = "preview";
  } catch (e) {
    if (e instanceof EnvelopeError) message(e.message, { type: "error" });
  } finally {
    loading.value = false;
  }
}

function backToList() {
  step.value = "list";
  preview.value = null;
}

async function confirmImport() {
  const p = preview.value;
  if (!p) return;
  importing.value = true;
  try {
    await assertOk(
      importExistingTable({
        tableName: p.tableName,
        displayName: displayName.value || undefined,
        description: description.value || undefined
      })
    );
    message(`已导入表"${p.tableName}"`, { type: "success" });
    emit("success");
  } catch (e) {
    if (e instanceof EnvelopeError) message(e.message, { type: "error" });
  } finally {
    importing.value = false;
  }
}

function statusOf(row: ImportableTableInfo) {
  if (row.registered) return { label: "已导入", type: "info" as const };
  if (row.compatible) return { label: "可导入", type: "success" as const };
  return { label: "不兼容", type: "danger" as const };
}

function formatRows(n: number) {
  return n < 0 ? "-" : n >= 10000 ? `~${Math.round(n / 1000)}k` : String(n);
}

const previewAlertTitle = computed(() => {
  const p = preview.value;
  if (!p) return "";
  return p.compatible
    ? `表 "${p.tableName}" 满足兼容条件，确认后注册为元表格（不修改表结构）。`
    : `表 "${p.tableName}" 不满足兼容条件。`;
});

onMounted(loadList);
</script>

<template>
  <div v-loading="loading" class="min-h-75">
    <!-- 第一步：物理表列表 -->
    <template v-if="step === 'list'">
      <el-alert
        type="info"
        :closable="false"
        class="mb-3"
        title="仅兼容结构完全符合元表格规范的物理表（id 主键、deleted、审计列齐全），不会修改表结构。"
      />
      <el-table :data="list" border max-height="420" style="width: 100%">
        <el-table-column
          prop="tableName"
          label="物理表名"
          min-width="160"
          show-overflow-tooltip
        />
        <el-table-column
          prop="comment"
          label="表注释"
          min-width="140"
          show-overflow-tooltip
        >
          <template #default="{ row }">{{ row.comment || "-" }}</template>
        </el-table-column>
        <el-table-column
          prop="columnCount"
          label="列数"
          width="70"
          align="center"
        />
        <el-table-column label="估算行数" width="90" align="center">
          <template #default="{ row }">
            {{ formatRows(row.estimatedRows) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tooltip
              :disabled="row.compatible || row.registered"
              placement="left"
            >
              <template #content>
                <div v-for="(r, i) in row.reasons" :key="i">{{ r }}</div>
              </template>
              <el-tag
                :type="statusOf(row as ImportableTableInfo).type"
                size="small"
              >
                {{ statusOf(row as ImportableTableInfo).label }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              :disabled="!row.compatible || row.registered"
              @click="openPreview(row as ImportableTableInfo)"
            >
              导入
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="未找到可评估的物理表" />
        </template>
      </el-table>
    </template>

    <!-- 第二步：列映射预览 + 确认 -->
    <template v-else-if="preview">
      <el-alert
        :type="preview.compatible ? 'success' : 'error'"
        :closable="false"
        class="mb-3"
        :title="previewAlertTitle"
      >
        <template v-if="!preview.compatible" #default>
          <div v-for="(r, i) in preview.reasons" :key="i">{{ r }}</div>
        </template>
      </el-alert>

      <el-table
        :data="preview.columns"
        border
        max-height="320"
        style="width: 100%"
      >
        <el-table-column
          prop="columnCode"
          label="列名"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="comment"
          label="注释"
          min-width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">{{ row.comment || "-" }}</template>
        </el-table-column>
        <el-table-column label="类别" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.audit" type="info" size="small">审计列</el-tag>
            <span v-else>业务列</span>
          </template>
        </el-table-column>
        <el-table-column label="映射类型" width="120" align="center">
          <template #default="{ row }">
            <span v-if="row.audit">-</span>
            <el-tag v-else-if="row.dataType" size="small">
              {{ row.dataType }}
            </el-tag>
            <el-tag v-else type="danger" size="small">不可映射</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="必填" width="60" align="center">
          <template #default="{ row }">
            {{ !row.audit && row.required ? "是" : "-" }}
          </template>
        </el-table-column>
        <el-table-column label="唯一/索引" width="90" align="center">
          <template #default="{ row }">
            <span v-if="row.audit">-</span>
            <span v-else-if="row.unique">唯一</span>
            <span v-else-if="row.indexed">索引</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="警告" min-width="120">
          <template #default="{ row }">
            <span v-if="row.warning" class="text-warning">
              {{ row.warning }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>

      <el-alert
        v-if="preview.compositeIndexes?.length"
        type="warning"
        :closable="false"
        class="mt-3"
        :title="`复合索引（不导入，仅展示）：${preview.compositeIndexes.join('、')}`"
      />

      <el-form label-width="80px" class="mt-4">
        <el-form-item label="显示名">
          <el-input
            v-model="displayName"
            placeholder="留空使用表注释或物理表名"
            class="w-80!"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="description"
            type="textarea"
            :rows="2"
            placeholder="可选"
            class="w-120!"
          />
        </el-form-item>
      </el-form>

      <div class="flex justify-end gap-2 mt-2">
        <el-button @click="backToList">返回列表</el-button>
        <el-button
          type="primary"
          :disabled="!preview.compatible"
          :loading="importing"
          @click="confirmImport"
        >
          确认导入
        </el-button>
      </div>
    </template>
  </div>
</template>
