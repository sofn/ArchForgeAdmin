<script setup lang="ts">
import { computed } from "vue";
import type { PreviewChange, SchemaPreview } from "@/api/metaTable";

const props = defineProps<{
  preview: SchemaPreview;
}>();

const typeLabels: Record<string, string> = {
  ADD_COLUMN: "新增字段",
  DROP_COLUMN: "删除字段",
  RENAME_COLUMN: "重命名",
  ALTER_TYPE: "类型变更",
  ALTER_DEFAULT: "默认值变更",
  ALTER_NULL: "可空性变更",
  ALTER_INDEX: "索引变更"
};

type TagType = "success" | "warning" | "danger" | "info";

const actionMeta: Record<string, { label: string; type: TagType }> = {
  NONE: { label: "安全", type: "success" },
  BACKFILL: { label: "自动回填", type: "warning" },
  BLOCKED: { label: "将被拒绝", type: "danger" }
};

function changeDetail(row: PreviewChange) {
  switch (row.type) {
    case "ALTER_TYPE":
      return `${row.oldType ?? "?"} → ${row.newType ?? "?"}`;
    case "ALTER_DEFAULT":
      return `${row.oldDefault ?? "∅"} → ${row.newDefault ?? "∅"}`;
    case "ALTER_NULL":
      return `${row.oldNullable ? "NULL" : "NOT NULL"} → ${row.newNullable ? "NULL" : "NOT NULL"}`;
    case "RENAME_COLUMN":
      return `${row.oldColumnCode ?? "?"} → ${row.columnCode ?? "?"}`;
    default:
      return "";
  }
}

/** 预计算行展示模型 —— el-table 的 row slot 类型不可控，模板只做属性访问。 */
const rows = computed(() =>
  props.preview.changes.map(c => ({
    column: c.columnCode ?? c.oldColumnCode ?? "-",
    typeLabel: typeLabels[c.type] ?? c.type,
    detail: changeDetail(c),
    violations: c.violations,
    actionLabel: actionMeta[c.action]?.label ?? c.action,
    actionType: actionMeta[c.action]?.type ?? ("info" as TagType),
    ddlText: c.ddl?.length ? c.ddl.join(";\n") + ";" : ""
  }))
);

const hasBlocked = computed(() =>
  props.preview.changes.some(c => c.action === "BLOCKED")
);
</script>

<template>
  <div>
    <el-alert
      v-if="preview.dangerous"
      type="warning"
      :closable="false"
      class="mb-3"
      title="存在可能影响存量数据的变更，请确认下方违规行数与处置方式"
      show-icon
    />
    <el-table :data="rows" border size="small" max-height="420">
      <el-table-column type="expand">
        <template #default="{ row }">
          <pre v-if="row.ddlText" class="m-0 px-4 py-2 text-xs/5">{{
            row.ddlText
          }}</pre>
          <span v-else class="px-4 text-xs text-gray-400">无 DDL</span>
        </template>
      </el-table-column>
      <el-table-column label="字段" min-width="140">
        <template #default="{ row }">{{ row.column }}</template>
      </el-table-column>
      <el-table-column label="变更" width="100">
        <template #default="{ row }">{{ row.typeLabel }}</template>
      </el-table-column>
      <el-table-column label="明细" min-width="180">
        <template #default="{ row }">{{ row.detail }}</template>
      </el-table-column>
      <el-table-column label="违规行数" width="90" align="right">
        <template #default="{ row }">
          <span :class="{ 'text-red-500 font-bold': row.violations > 0 }">
            {{ row.violations }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="处置" width="100">
        <template #default="{ row }">
          <el-tag :type="row.actionType" size="small">
            {{ row.actionLabel }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="hasBlocked" class="mt-2 text-xs text-red-500">
      标记「将被拒绝」的变更在提交时会失败（存量数据不满足新约束且无默认值可回填）
    </div>
  </div>
</template>
