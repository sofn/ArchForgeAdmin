<script setup lang="ts">
import { ref } from "vue";
import { useMetaData } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { hasPerms } from "@/utils/auth";
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
  dictMap,
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
        <template v-if="col.searchType === 'RANGE'">
          <div class="flex gap-2">
            <template
              v-if="['DATE', 'DATETIME', 'TIMESTAMPTZ'].includes(col.dataType)"
            >
              <el-date-picker
                v-model="filters[col.columnCode].start"
                :type="col.dataType === 'DATE' ? 'date' : 'datetime'"
                :value-format="
                  col.dataType === 'DATE' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
                "
                placeholder="开始"
                class="w-35!"
              />
              <el-date-picker
                v-model="filters[col.columnCode].end"
                :type="col.dataType === 'DATE' ? 'date' : 'datetime'"
                :value-format="
                  col.dataType === 'DATE' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
                "
                placeholder="结束"
                class="w-35!"
              />
            </template>
            <template v-else-if="['INTEGER', 'DECIMAL'].includes(col.dataType)">
              <el-input-number
                v-model="filters[col.columnCode].start"
                :precision="col.dataType === 'DECIMAL' ? col.scale || 2 : 0"
                placeholder="开始"
                class="w-35!"
              />
              <el-input-number
                v-model="filters[col.columnCode].end"
                :precision="col.dataType === 'DECIMAL' ? col.scale || 2 : 0"
                placeholder="结束"
                class="w-35!"
              />
            </template>
            <template v-else>
              <el-input
                v-model="filters[col.columnCode].start"
                placeholder="开始"
                clearable
                class="w-35!"
              />
              <el-input
                v-model="filters[col.columnCode].end"
                placeholder="结束"
                clearable
                class="w-35!"
              />
            </template>
          </div>
        </template>
        <template v-else>
          <el-input
            v-if="
              ['STRING', 'TEXT', 'UUID', 'JSON', 'GEO'].includes(col.dataType)
            "
            v-model="filters[col.columnCode]"
            :placeholder="`请输入${col.columnName}`"
            clearable
            class="w-45!"
          />
          <el-input-number
            v-else-if="
              ['INTEGER', 'DECIMAL', 'REFERENCE'].includes(col.dataType)
            "
            v-model="filters[col.columnCode]"
            :precision="col.dataType === 'DECIMAL' ? col.scale || 2 : 0"
            :placeholder="`请输入${col.columnName}`"
            controls-position="right"
            class="w-45!"
          />
          <el-date-picker
            v-else-if="
              ['DATE', 'DATETIME', 'TIMESTAMPTZ'].includes(col.dataType)
            "
            v-model="filters[col.columnCode]"
            :type="col.dataType === 'DATE' ? 'date' : 'datetime'"
            :value-format="
              col.dataType === 'DATE' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
            "
            :placeholder="`请选择${col.columnName}`"
            class="w-45!"
          />
          <el-select
            v-else-if="col.dataType === 'ENUM'"
            v-model="filters[col.columnCode]"
            :placeholder="`请选择${col.columnName}`"
            clearable
            class="w-45!"
          >
            <el-option
              v-for="opt in dictMap[col.dictCode] || col.options || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-input
            v-else
            v-model="filters[col.columnCode]"
            clearable
            class="w-45!"
          />
        </template>
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
          v-if="hasPerms(['meta-table:add'])"
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDataForm()"
        >
          新增数据
        </el-button>
        <el-button-group v-if="hasPerms(['meta-table:export'])" class="mr-2">
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
        <el-button-group v-if="hasPerms(['meta-table:add'])">
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
              v-if="hasPerms(['meta-table:edit'])"
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
              v-if="hasPerms(['meta-table:remove'])"
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
