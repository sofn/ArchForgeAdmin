<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAllRoleList } from "@/api/system";
import {
  getPermissionMenuTree,
  getRolePermissions,
  saveRolePermissions,
  type PermissionMenuNode
} from "@/api/permission-matrix";
import { message } from "@/utils/message";

defineOptions({
  name: "PermissionPage"
});

const roles = ref<Array<{ id: number; name: string }>>([]);
const tree = ref<PermissionMenuNode[]>([]);
const checked = ref<number[]>([]);
const roleId = ref<number>();
const loading = ref(false);

function flattenIds(nodes: PermissionMenuNode[]): number[] {
  return nodes.flatMap(node => [node.id, ...flattenIds(node.children ?? [])]);
}

async function load() {
  const [roleRes, treeRes] = await Promise.all([
    getAllRoleList(),
    getPermissionMenuTree()
  ]);
  roles.value = (roleRes.data ?? []).map((item: any) => ({
    id: item.id ?? item.roleId,
    name: item.name ?? item.roleName
  }));
  tree.value = treeRes.data ?? [];
  if (roles.value[0]) {
    roleId.value = roles.value[0].id;
    await loadRole();
  }
}

async function loadRole() {
  if (!roleId.value) return;
  const res = await getRolePermissions(roleId.value);
  checked.value = res.data ?? [];
}

async function onSave() {
  if (!roleId.value) return;
  loading.value = true;
  try {
    await saveRolePermissions(roleId.value, checked.value);
    message("权限已保存", { type: "success" });
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <el-card shadow="never">
    <template #header>角色权限矩阵</template>
    <div class="flex gap-4 mb-4">
      <el-select v-model="roleId" class="w-60" @change="loadRole">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" :loading="loading" @click="onSave"
        >保存</el-button
      >
    </div>
    <el-tree
      :data="tree"
      node-key="id"
      show-checkbox
      default-expand-all
      :props="{ label: 'name', children: 'children' }"
      :default-checked-keys="checked"
      @check="(_: unknown, state: any) => (checked = state.checkedKeys)"
    />
    <p class="mt-3 text-sm text-text_color_regular">
      共 {{ flattenIds(tree).length }} 个权限点
    </p>
  </el-card>
</template>
