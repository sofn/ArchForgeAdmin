<script setup lang="ts">
import { useMetaTable } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { generateMetaTableCode } from "@/api/metaTable";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { ref } from "vue";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Document from "~icons/ep/document";
import ViewIcon from "~icons/ep/view";
import AddFill from "~icons/ri/add-circle-line";
import Refresh from "~icons/ep/refresh";

defineOptions({
  name: "MetaTable"
});

const formRef = ref();

const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  hasPerms,
  onSearch,
  resetForm,
  openTableTab,
  handleCopy,
  handleDelete,
  openDataDialog,
  handleSizeChange,
  handleCurrentChange
} = useMetaTable();

const handleGenerate = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `即将生成表格 ${row.tableName}（${row.tableCode}）的前后端代码`,
      "生成代码",
      { confirmButtonText: "确认", cancelButtonText: "取消", type: "warning" }
    );
    const { code, data } = await generateMetaTableCode(row.id);
    if (code === 0) {
      message(
        `代码生成成功：后端 ${data.backendDir}，前端 ${data.frontendDir}，文件数 ${data.files}`,
        { type: "success" }
      );
    }
  } catch (e) {
    // 取消或失败
  }
};
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-3 overflow-auto"
    >
      <el-form-item label="搜索：" prop="keyword">
        <el-input
          v-model="form.keyword"
          placeholder="表格编码/名称"
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

    <PureTableBar title="元表格" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-perms="['meta:table:add']"
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openTableTab()"
        >
          新增表格
        </el-button>
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
              v-if="hasPerms(['meta:table:edit'])"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openTableTab('修改', row)"
            >
              修改
            </el-button>
            <el-button
              v-if="hasPerms(['meta:table:edit'])"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Document)"
              @click="handleCopy(row)"
            >
              复制
            </el-button>
            <el-button
              v-if="hasPerms(['meta:table:data'])"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(ViewIcon)"
              @click="openDataDialog(row)"
            >
              数据
            </el-button>
            <el-button
              v-if="hasPerms(['meta:table:generate'])"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ri/code-box-line')"
              @click="handleGenerate(row)"
            >
              生成代码
            </el-button>
            <el-popconfirm
              v-if="hasPerms(['meta:table:remove'])"
              :title="`是否确认删除表格 ${row.tableName}`"
              @confirm="handleDelete(row)"
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
