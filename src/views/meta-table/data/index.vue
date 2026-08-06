<script setup lang="ts">
import { ref } from "vue";
import { useMetaData } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "~icons/ri/add-circle-line";
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Download from "~icons/ep/download";
import Upload from "~icons/ep/upload";
import Refresh from "~icons/ep/refresh";

const props = defineProps({
  tableId: {
    type: Number,
    required: true
  },
  tableName: {
    type: String,
    default: ""
  },
  columns: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  allColumns: {
    type: Array as PropType<any[]>,
    default: () => []
  }
});

const formRef = ref();
const exportFormat = ref("EXCEL");
const importFormat = ref("CSV");

const {
  filters,
  loading,
  dataList,
  pagination,
  searchColumns,
  tableColumns,
  exportFormatOptions,
  onSearch,
  resetForm,
  openDataForm,
  handleDeleteData,
  handleExport,
  handleImport,
  handleSizeChange,
  handleCurrentChange
} = useMetaData(
  props.tableId,
  props.tableName,
  props.columns,
  props.allColumns
);
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="filters"
      class="search-form bg-bg_color w-full pl-8 pt-3 overflow-auto"
    >
      <el-form-item
        v-for="col in searchColumns"
        :key="col.columnCode"
        :label="`${col.columnName}：`"
        :prop="col.columnCode"
      >
        <el-input-number
          v-if="['INTEGER', 'DECIMAL', 'REFERENCE'].includes(col.dataType)"
          v-model="filters[col.columnCode]"
          controls-position="right"
          class="w-45!"
        />
        <el-input
          v-else
          v-model="filters[col.columnCode]"
          clearable
          class="w-45!"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri/search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :title="tableName"
      :columns="tableColumns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDataForm()"
        >
          新增数据
        </el-button>
        <el-button-group class="mr-2">
          <el-select
            v-model="exportFormat"
            class="w-30!"
            placeholder="导出格式"
          >
            <el-option
              v-for="opt in exportFormatOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-button
            :icon="useRenderIcon(Download)"
            @click="handleExport(exportFormat)"
          >
            导出
          </el-button>
        </el-button-group>
        <el-button-group>
          <el-select
            v-model="importFormat"
            class="w-30!"
            placeholder="导入格式"
          >
            <el-option label="CSV" value="CSV" />
            <el-option label="JSON" value="JSON" />
          </el-select>
          <el-button
            :icon="useRenderIcon(Upload)"
            @click="handleImport(importFormat)"
          >
            导入
          </el-button>
        </el-button-group>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDataForm('修改', row)"
            >
              修改
            </el-button>
            <el-popconfirm
              title="是否确认删除该数据"
              @confirm="handleDeleteData(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
