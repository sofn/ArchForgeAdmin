<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import ReCol from "@/components/ReCol";
import { useDark } from "./utils";
import { ReNormalCountTo } from "@/components/ReCountTo";
import { ChartBar, ChartLine } from "./components/charts";
import {
  getDashboardActivities,
  getDashboardMetrics,
  getDashboardTodo,
  getDashboardTrends,
  type DashboardActivity,
  type DashboardMetrics,
  type DashboardTodo,
  type DashboardTrendPoint
} from "@/api/dashboard";
import GroupLine from "~icons/ri/group-line";
import Question from "~icons/ri/question-answer-line";
import CheckLine from "~icons/ri/chat-check-line";
import Smile from "~icons/ri/star-smile-line";

defineOptions({
  name: "Welcome"
});

const { isDark } = useDark();
const metrics = reactive<DashboardMetrics>({
  userCount: 0,
  articleCount: 0,
  metaTableCount: 0,
  taskCount: 0
});
const trends = ref<DashboardTrendPoint[]>([]);
const activities = ref<DashboardActivity[]>([]);
const todos = ref<DashboardTodo[]>([]);

const cards = [
  {
    key: "userCount",
    name: "用户数",
    icon: GroupLine,
    color: "#41b6ff",
    bgColor: "#effaff"
  },
  {
    key: "articleCount",
    name: "文章数",
    icon: Question,
    color: "#e85f33",
    bgColor: "#fff5f4"
  },
  {
    key: "metaTableCount",
    name: "元表数",
    icon: CheckLine,
    color: "#26ce83",
    bgColor: "#eff8f4"
  },
  {
    key: "taskCount",
    name: "任务数",
    icon: Smile,
    color: "#7846e5",
    bgColor: "#f6f4fe"
  }
] as const;

onMounted(async () => {
  const [m, t, a, d] = await Promise.all([
    getDashboardMetrics(),
    getDashboardTrends(7),
    getDashboardActivities(),
    getDashboardTodo()
  ]);
  Object.assign(metrics, m.data);
  trends.value = t.data ?? [];
  activities.value = a.data ?? [];
  todos.value = d.data ?? [];
});
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <re-col
        v-for="(item, index) in cards"
        :key="index"
        v-motion
        class="mb-4.5"
        :value="6"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80 * (index + 1)
          }
        }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">
              {{ item.name }}
            </span>
            <div
              class="size-8 flex-c rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : item.bgColor
              }"
            >
              <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="18"
                height="18"
              />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="800"
                :fontSize="'1.6em'"
                :startVal="0"
                :endVal="metrics[item.key]"
              />
            </div>
            <ChartLine
              class="w-1/2!"
              :color="item.color"
              :data="trends.map(point => Number(point.users))"
            />
          </div>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-4.5"
        :value="18"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card class="bar-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">7 日趋势</span>
          </div>
          <div class="flex justify-between items-start mt-3">
            <ChartBar
              :requireData="trends.map(point => Number(point.users))"
              :questionData="trends.map(point => Number(point.articles))"
            />
          </div>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-4.5"
        :value="6"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 480
          }
        }"
      >
        <el-card shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">待办</span>
          </div>
          <div
            v-for="item in todos"
            :key="item.title"
            class="flex justify-between mt-6"
          >
            <span>{{ item.title }}</span>
            <el-tag>{{ item.count }}</el-tag>
          </div>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-4.5"
        :value="18"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 560
          }
        }"
      >
        <el-card shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">趋势明细</span>
          </div>
          <el-scrollbar max-height="504" class="mt-3">
            <el-table :data="trends" size="small">
              <el-table-column prop="date" label="日期" />
              <el-table-column prop="users" label="用户" />
              <el-table-column prop="articles" label="文章" />
            </el-table>
          </el-scrollbar>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-4.5"
        :value="6"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 640
          }
        }"
      >
        <el-card shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">最新动态</span>
          </div>
          <el-scrollbar max-height="504" class="mt-3">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in activities"
                :key="index"
                center
                placement="top"
                :timestamp="item.time"
              >
                <p class="text-text_color_regular text-sm">
                  {{ item.title }}
                </p>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  --el-card-border-color: none;

  /* 解决概率进度条宽度 */
  .el-progress--line {
    width: 85%;
  }

  /* 解决概率进度条字体大小 */
  .el-progress-bar__innerText {
    font-size: 15px;
  }

  /* 隐藏 el-scrollbar 滚动条 */
  .el-scrollbar__bar {
    display: none;
  }

  /* el-timeline 每一项上下、左右边距 */
  .el-timeline-item {
    margin: 0 6px;
  }
}

:deep(.el-timeline.is-start) {
  padding-left: 0;
}

.main-content {
  margin: 20px 20px 0 !important;
}
</style>
