<script setup lang="ts">
import { useFile } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getToken } from "@/utils/auth";
import { message } from "@/utils/message";
import { i18n } from "@/plugins/i18n";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import Delete from "~icons/ep/delete";
import Download from "~icons/ep/download";
import Refresh from "~icons/ep/refresh";
import Upload from "~icons/ri/upload-line";

defineOptions({
  name: "ToolFile"
});

const formRef = ref();
const uploadRef = ref();
const { t } = useI18n();

const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  storageTypeOptions,
  onSearch,
  resetForm,
  handleDelete,
  handleDownload,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useFile();

const uploadHeaders = computed(() => {
  const token = getToken()?.accessToken;
  return {
    Authorization: token ? `Bearer ${token}` : ""
  };
});

const uploadData = computed(() => {
  const locale = i18n.global.locale as any;
  return {
    lang: typeof locale === "string" ? locale : locale.value
  };
});

function handleUploadSuccess(response) {
  if (response.code === 0) {
    message(t("repeat.uploadSuccess"), { type: "success" });
    onSearch();
  } else {
    message(response.message || t("repeat.uploadFail"), { type: "error" });
  }
}

function handleUploadError() {
  message(t("repeat.uploadFail"), { type: "error" });
}
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-3 overflow-auto"
    >
      <el-form-item label="文件名：" prop="originalName">
        <el-input
          v-model="form.originalName"
          placeholder="请输入文件名"
          clearable
          class="w-45!"
        />
      </el-form-item>
      <el-form-item label="存储类型：" prop="storageType">
        <el-select
          v-model="form.storageType"
          placeholder="请选择"
          clearable
          class="w-30!"
        >
          <el-option
            v-for="item in storageTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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

    <PureTableBar title="文件管理" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-upload
          ref="uploadRef"
          v-perms="'tool:file:upload'"
          action="/api/file/upload"
          :headers="uploadHeaders"
          :data="uploadData"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
        >
          <el-button type="primary" :icon="useRenderIcon(Upload)">
            上传文件
          </el-button>
        </el-upload>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          row-key="id"
          border
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
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
              v-perms="'tool:file:download'"
              type="primary"
              link
              :size="size"
              :icon="useRenderIcon(Download)"
              @click="handleDownload(row)"
            >
              下载
            </el-button>
            <el-button
              v-perms="'tool:file:delete'"
              type="danger"
              link
              :size="size"
              :icon="useRenderIcon(Delete)"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped>
.search-form :deep(.el-form-item) {
  margin-bottom: 12px;
}
</style>
