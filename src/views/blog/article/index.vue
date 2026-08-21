<script setup lang="ts">
import { useArticle } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref } from "vue";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";
import Check from "~icons/ep/check";
import Close from "~icons/ep/close";

defineOptions({
  name: "BlogArticle"
});

const formRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleDelete,
  handlePublish,
  handleOffline,
  handleSizeChange,
  handleCurrentChange
} = useArticle();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-3 overflow-auto"
    >
      <el-form-item label="文章标题：" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入文章标题"
          clearable
          class="w-45!"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择"
          clearable
          class="w-45!"
        >
          <el-option label="草稿" value="0" />
          <el-option label="已发布" value="1" />
          <el-option label="已下线" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri/search-line')"
          :loading="loading"
          @click="onSearch"
          >搜索</el-button
        >
        <el-button
          :icon="useRenderIcon('ri/refresh-line')"
          @click="resetForm(formRef)"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <PureTableBar title="内容管理" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
          >新增文章</el-button
        >
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
              @click="openDialog('修改', row)"
              >修改</el-button
            >
            <el-button
              v-if="row.status === 0"
              class="reset-margin"
              link
              type="success"
              :size="size"
              :icon="useRenderIcon(Check)"
              @click="handlePublish(row)"
              >发布</el-button
            >
            <el-button
              v-if="row.status === 1"
              class="reset-margin"
              link
              type="warning"
              :size="size"
              :icon="useRenderIcon(Close)"
              @click="handleOffline(row)"
              >下线</el-button
            >
            <el-popconfirm
              :title="`是否确认删除文章${row.title}`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                  >删除</el-button
                >
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
