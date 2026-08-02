<script setup lang="ts">
import { useTask } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref } from "vue";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Check from "~icons/ep/check";
import Close from "~icons/ep/close";
import VideoPlay from "~icons/ep/video-play";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";

defineOptions({
  name: "ExampleTask"
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
  openDialog,
  handleDelete,
  handleStart,
  handleComplete,
  handleCancel,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useTask();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-3 overflow-auto"
    >
      <el-form-item label="任务标题：" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入任务标题"
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
          <el-option label="待处理" value="CREATED" />
          <el-option label="进行中" value="IN_PROGRESS" />
          <el-option label="已完成" value="COMPLETED" />
          <el-option label="已取消" value="CANCELLED" />
        </el-select>
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

    <PureTableBar title="示例：任务管理" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-perms="['example:task:add']"
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增任务
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
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasPerms(['example:task:edit'])"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog('修改', row)"
            >
              修改
            </el-button>
            <el-popconfirm
              v-if="hasPerms(['example:task:remove'])"
              :title="`是否确认删除任务${row.title}`"
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
            <el-button
              v-if="
                hasPerms(['example:task:start']) && row.status === 'CREATED'
              "
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(VideoPlay)"
              @click="handleStart(row)"
            >
              开始
            </el-button>
            <el-button
              v-if="
                hasPerms(['example:task:complete']) &&
                row.status === 'IN_PROGRESS'
              "
              class="reset-margin"
              link
              type="success"
              :size="size"
              :icon="useRenderIcon(Check)"
              @click="handleComplete(row)"
            >
              完成
            </el-button>
            <el-button
              v-if="
                hasPerms(['example:task:cancel']) &&
                row.status === 'IN_PROGRESS'
              "
              class="reset-margin"
              link
              type="danger"
              :size="size"
              :icon="useRenderIcon(Close)"
              @click="handleCancel(row)"
            >
              取消
            </el-button>
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
