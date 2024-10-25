<template>
  <PublicHead />
  <HomeHeader />
  <div class="container">
    <el-affix :offset="110">
      <LeftSidebar
        :categories="categories"
        :rankings="rankings"
        :current-category="selectedCategory"
        @select-category="fetchAppsByCategory"
        @search="handleSearch"
    /></el-affix>

    <RightContent
      :apps="apps"
      :selected-category="selectedCategory"
      :total="total"
      :load="load"
      :disabled="disabled"
      :loading="loading"
      :no-more="noMore"
      :search-query="searchQuery"
    />
  </div>
  <el-backtop :right="100" :bottom="100" />
  <PublicRight />
  <PublicFooter />
</template>

<script setup lang="ts">
import { App, Category, Rankings } from "@/api/interface/index";
import HomeHeader from "./components/HomeHeader.vue";
import LeftSidebar from "./components/LeftSidebar.vue";
import RightContent from "./components/RightContent.vue";
import { getLogin, getCategories, getTop, getApp } from "@/api/modules/project";
import { ref, computed, onMounted } from "vue";
const categories = ref<Category[]>([]);
const rankings = ref<Rankings[]>([]);

const apps = ref<App[]>([]);

const currentPage = ref(1); // 当前页码
const loading = ref(false); // 加载状态
const total = ref<number>(2); // 初始值为 null 以处理未知总数
const noMore = computed(() => apps.value.length >= total.value);
const disabled = computed(() => loading.value || noMore.value); // 是否禁用滚动加载
const selectedCategory = ref<Category>({ categoryId: undefined, categoryName: "全部分类" });
const load = async () => {
  loading.value = true;
  try {
    const categoryId = selectedCategory.value?.categoryId; // 使用可选链运算符安全地访问 categoryId
    const { data: appsData } = await getApp({
      pageNo: currentPage.value,
      pageSize: 40,
      sort: "createTime",
      categoryId: categoryId // 如果有选择的分类，则传递
    });

    // 更新总数
    total.value = appsData.total;

    // 将新数据追加到已有的 apps 列表中
    apps.value.push(...appsData.records);

    // 增加页码
    currentPage.value += 1;
  } finally {
    loading.value = false;
  }
};
const searchQuery = ref("");
onMounted(async () => {
  const osVersion = navigator.userAgent || navigator.appVersion;
  console.log(osVersion); // 输出版本信息

  await getLogin({ osVersion }); // 传递 osVersion
  // 获取分类数据
  const { data: categoryData } = await getCategories({});
  categories.value = [{ categoryId: undefined, categoryName: "全部分类", icon: "Files" }, ...categoryData];

  // 获取排名数据
  const { data: rankingData } = await getTop();
  rankings.value = rankingData.slice(0, 6);
});

const fetchAppsByCategory = async (category: Category) => {
  currentPage.value = 1;
  apps.value = [];
  selectedCategory.value = category;

  // 获取选择分类的应用数据
  try {
    const { data: appsData } = await getApp({
      pageNo: currentPage.value,
      pageSize: 40,
      sort: "installCount",
      categoryId: category.categoryId,
      name: searchQuery.value
    });

    apps.value = appsData.records; // 更新应用列表
    total.value = appsData.total; // 更新总数
    currentPage.value += 1; // 增加页码
  } catch (error) {
    console.error("获取应用数据失败:", error);
  }
};

const handleSearch = async (query: string) => {
  searchQuery.value = query;
  currentPage.value = 1; // 重置页码
  apps.value = []; // 清空应用列表
  selectedCategory.value = { categoryId: undefined, categoryName: "全部分类" }; // 设置选中的分类

  // 获取搜索结果
  try {
    const { data: appsData } = await getApp({
      pageNo: currentPage.value,
      pageSize: 40,
      sort: "installCount",
      name: query // 传递搜索条件
    });

    apps.value = appsData.records; // 更新应用列表
    total.value = appsData.total; // 更新总数
    currentPage.value += 1; // 增加页码
  } catch (error) {
    console.error("搜索失败:", error);
  }
};
</script>
<style scoped lang="scss">
.container {
  display: flex;
  gap: 0 80px;
  justify-content: space-between;
  align-items: flex-start;
  margin: 40px var(--container-margin);
}

:deep(.el-input__wrapper) {
  box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
  border-radius: 8px;
}

:deep(.el-input__inner) {
  height: 42px;
}

:deep(.el-card) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
}

:deep(.el-card__header) {
  padding: 10px 20px;
  font-size: 16px;
}

:deep(.el-card__body) {
  padding: 24px;
}

:deep(.el-table .cell) {
  padding: 0 30px;
}

@media screen and (width <= 1250px) {
  .left {
    display: none;
  }

  .app-list {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
</style>
