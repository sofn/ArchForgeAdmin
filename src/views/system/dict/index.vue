<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { message } from "@/utils/message";
import {
  getDictTypePage,
  getDictTypeByCode,
  createDictType,
  updateDictType,
  deleteDictType,
  createDictItem,
  updateDictItem,
  deleteDictItem
} from "@/api/dict";
import type { DictType, DictItem } from "@/api/dict";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "~icons/ri/add-circle-line";
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Refresh from "~icons/ep/refresh";
import dayjs from "dayjs";

defineOptions({
  name: "SystemDict"
});

const form = reactive({
  keyword: ""
});
const formRef = ref();
const loading = ref(false);
const dataList = ref<DictType[]>([]);
const pagination = reactive({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const dialogVisible = ref(false);
const dialogTitle = ref("新增字典");
const dictForm = reactive<{
  id?: number;
  dictCode: string;
  dictName: string;
  description: string;
  status: number;
  sort: number;
  items: DictItem[];
}>({
  dictCode: "",
  dictName: "",
  description: "",
  status: 1,
  sort: 0,
  items: []
});
const dictFormRef = ref();
const removedItemIds = ref<number[]>([]);

const columns: TableColumnList = [
  { label: "字典编码", prop: "dictCode", minWidth: 160 },
  { label: "字典名称", prop: "dictName", minWidth: 160 },
  { label: "描述", prop: "description", minWidth: 160 },
  {
    label: "状态",
    prop: "status",
    width: 90,
    formatter: ({ status }) => (status === 1 ? "启用" : "禁用")
  },
  { label: "排序", prop: "sort", width: 80 },
  {
    label: "创建时间",
    prop: "createTime",
    minWidth: 160,
    formatter: ({ createTime }) =>
      createTime ? dayjs(createTime).format("YYYY-MM-DD HH:mm:ss") : ""
  },
  {
    label: "操作",
    fixed: "right",
    width: 180,
    slot: "operation"
  }
];

const rules = {
  dictCode: [{ required: true, message: "请输入字典编码", trigger: "blur" }],
  dictName: [{ required: true, message: "请输入字典名称", trigger: "blur" }]
};

const isEdit = computed(() => !!dictForm.id);

async function onSearch() {
  loading.value = true;
  try {
    const { code, data } = await getDictTypePage({
      keyword: form.keyword,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    if (code === 0) {
      dataList.value = data.list;
      pagination.total = data.total;
      pagination.pageSize = data.pageSize;
      pagination.currentPage = data.currentPage;
    }
  } finally {
    loading.value = false;
  }
}

function resetForm(formEl: any) {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
}

function handleSizeChange(val: number) {
  pagination.pageSize = val;
  onSearch();
}

function handleCurrentChange(val: number) {
  pagination.currentPage = val;
  onSearch();
}

function openDialog(title = "新增字典") {
  dialogTitle.value = title;
  removedItemIds.value = [];
  Object.assign(dictForm, {
    id: undefined,
    dictCode: "",
    dictName: "",
    description: "",
    status: 1,
    sort: 0,
    items: []
  });
  dialogVisible.value = true;
}

async function handleEdit(row: DictType) {
  const { code, data } = await getDictTypeByCode(row.dictCode);
  if (code !== 0 || !data) {
    message("加载字典详情失败", { type: "error" });
    return;
  }
  dialogTitle.value = "编辑字典";
  removedItemIds.value = [];
  Object.assign(dictForm, {
    id: data.id,
    dictCode: data.dictCode,
    dictName: data.dictName,
    description: data.description ?? "",
    status: data.status,
    sort: data.sort,
    items: (data.items || []).map(item => ({ ...item }))
  });
  dialogVisible.value = true;
}

async function handleDelete(row: DictType) {
  const { code } = await deleteDictType(row.id);
  if (code === 0) {
    message("删除成功", { type: "success" });
    onSearch();
  }
}

function addItem() {
  dictForm.items.push({
    id: undefined,
    dictTypeId: dictForm.id ?? 0,
    itemCode: "",
    itemLabel: "",
    sort: dictForm.items.length,
    status: 1
  } as DictItem);
}

function removeItem(index: number) {
  const item = dictForm.items[index];
  if (item && item.id) {
    removedItemIds.value.push(item.id);
  }
  dictForm.items.splice(index, 1);
}

async function submitForm() {
  const valid = await dictFormRef.value.validate().catch(() => false);
  if (!valid) return;

  for (const item of dictForm.items) {
    if (!item.itemCode || !item.itemLabel) {
      message("字典项编码和名称不能为空", { type: "warning" });
      return;
    }
  }

  if (isEdit.value && dictForm.id) {
    const { code } = await updateDictType(dictForm.id, {
      dictName: dictForm.dictName,
      description: dictForm.description,
      status: dictForm.status,
      sort: dictForm.sort
    });
    if (code !== 0) return;

    for (const item of dictForm.items) {
      if (item.id) {
        await updateDictItem(item.id, item);
      } else {
        const { data: newId } = await createDictItem(dictForm.id, item);
        if (newId) {
          item.id = newId;
        }
      }
    }

    for (const itemId of removedItemIds.value) {
      await deleteDictItem(itemId);
    }
  } else {
    const { code } = await createDictType({
      dictCode: dictForm.dictCode,
      dictName: dictForm.dictName,
      description: dictForm.description,
      status: dictForm.status,
      sort: dictForm.sort,
      items: dictForm.items.map(item => ({
        itemCode: item.itemCode,
        itemLabel: item.itemLabel,
        sort: item.sort,
        status: item.status
      }))
    });
    if (code !== 0) return;
  }

  message(`${dialogTitle.value}成功`, { type: "success" });
  dialogVisible.value = false;
  onSearch();
}

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-3 overflow-auto"
    >
      <el-form-item label="字典名称：" prop="keyword">
        <el-input
          v-model="form.keyword"
          placeholder="请输入字典名称或编码"
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

    <PureTableBar title="字典配置" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增字典
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
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`是否确认删除字典${row.dictName}`"
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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        ref="dictFormRef"
        :model="dictForm"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典编码" prop="dictCode">
              <el-input
                v-model="dictForm.dictCode"
                placeholder="唯一编码，如：order_status"
                :disabled="isEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典名称" prop="dictName">
              <el-input
                v-model="dictForm.dictName"
                placeholder="请输入字典名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <el-input
            v-model="dictForm.description"
            type="textarea"
            :rows="2"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="dictForm.status">
                <el-radio :value="1">启用</el-radio>
                <el-radio :value="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number
                v-model="dictForm.sort"
                :min="0"
                class="w-full!"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider />

        <div class="flex-bc mb-2">
          <span class="font-bold">字典项</span>
          <el-button type="primary" @click="addItem">新增项</el-button>
        </div>
        <el-table :data="dictForm.items" border style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column label="项编码" min-width="140">
            <template #default="{ row }">
              <el-input v-model="row.itemCode" placeholder="实际值" />
            </template>
          </el-table-column>
          <el-table-column label="项名称" min-width="140">
            <template #default="{ row }">
              <el-input v-model="row.itemLabel" placeholder="显示值" />
            </template>
          </el-table-column>
          <el-table-column label="排序" width="100">
            <template #default="{ row }">
              <el-input-number v-model="row.sort" :min="0" class="w-full!" />
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template #default="{ $index }">
              <el-button link type="danger" @click="removeItem($index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
