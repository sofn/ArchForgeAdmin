<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { formRules } from "./utils/rule";
import type { FormProps } from "./utils/types";
import Vditor from "@/views/markdown/components/Vditor.vue";
import { getBlogCategoryList } from "@/api/blog";
import { getToken, formatToken } from "@/utils/auth";
import { http } from "@/utils/http";

const props = defineProps({
  formInline: {
    type: Object as PropType<FormProps["formInline"]>,
    default: () => ({
      categoryId: null,
      title: "",
      slug: "",
      summary: "",
      content: "",
      coverImageFileId: null,
      coverImageUrl: "",
      status: 0
    })
  }
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const categories = ref<any[]>([]);

const editorOptions = computed(() => ({
  height: 360,
  upload: {
    url: "/api/blog/file/upload",
    fieldName: "file[]",
    headers: {
      Authorization: formatToken(getToken()?.accessToken || "")
    }
  }
}));

onMounted(async () => {
  const { code, data } = await getBlogCategoryList({ pageSize: 100 });
  if (code === 0) {
    categories.value = data.list || [];
  }
});

async function handleCoverUpload(options: any) {
  const formData = new FormData();
  formData.append("file[]", options.file);
  const token = getToken();
  const res: any = await http.request("post", "/blog/file/upload", {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token ? formatToken(token.accessToken) : ""
    }
  });
  const url = Object.values(res?.data?.succMap || {})[0] as string;
  if (url) {
    const fileId = url.split("/web/file/").pop();
    newFormInline.value.coverImageFileId = Number(fileId);
    newFormInline.value.coverImageUrl = url;
    options.onSuccess?.(url);
  }
}

function getRef() {
  return ruleFormRef.value;
}

const coverUrl = computed(() => newFormInline.value.coverImageUrl || "");

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-form-item label="所属目录" prop="categoryId">
      <el-select
        v-model="newFormInline.categoryId"
        placeholder="请选择目录"
        class="w-full"
      >
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="newFormInline.title" placeholder="请输入文章标题" />
    </el-form-item>
    <el-form-item label="URL标识" prop="slug">
      <el-input v-model="newFormInline.slug" placeholder="英文、数字、中划线" />
    </el-form-item>
    <el-form-item label="摘要" prop="summary">
      <el-input
        v-model="newFormInline.summary"
        type="textarea"
        :rows="3"
        placeholder="选填，用于列表展示"
      />
    </el-form-item>
    <el-form-item label="封面图" prop="coverImageFileId">
      <el-input
        v-model="newFormInline.coverImageUrl"
        readonly
        placeholder="上传后自动生成"
      />
      <el-upload
        class="mt-2"
        action="#"
        :auto-upload="true"
        :http-request="handleCoverUpload"
        :show-file-list="false"
        accept="image/*"
      >
        <el-button type="primary">上传封面</el-button>
      </el-upload>
      <img
        v-if="coverUrl"
        :src="coverUrl"
        class="mt-2 w-40 h-24 object-cover rounded"
      />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio :value="0">草稿</el-radio>
        <el-radio :value="1">已发布</el-radio>
        <el-radio :value="2">已下线</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="正文" prop="content">
      <Vditor v-model="newFormInline.content" :options="editorOptions" />
    </el-form-item>
  </el-form>
</template>
