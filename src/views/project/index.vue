<template>
  <PublicHead />
  <HomeHeader />
  <div class="container">
    <LeftSidebar
      :categories="categories"
      :rankings="rankings"
      :current-category="selectedCategory"
      @select-category="fetchAppsByCategory"
      @search="handleSearch"
    />

    <RightContent
      :apps="apps"
      :categories-dict="categoriesDict"
      :selected-category="selectedCategory"
      :total="total"
      :load="load"
      :disabled="disabled"
      :loading="loading"
      :no-more="noMore"
      :search-query="searchQuery"
      :current-sort="currentSort"
      :current-arch="currentArch"
      :current-filter="currentFilter"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @arch-change="archChange"
    />
    <RightSidebar />
  </div>
  <el-backtop :right="100" :bottom="100" />
  <PublicRight />
  <PublicFooter />
</template>

<script setup lang="ts">
import { App, Category, Rankings, ReqPageParams } from "@/api/interface/index";
import axios from "axios";
import HomeHeader from "./components/HomeHeader.vue";
import LeftSidebar from "./components/LeftSidebar.vue";
import RightContent from "./components/RightContent.vue";
import RightSidebar from "./components/RightSidebar.vue";
// import { getLogin, getCategories, getTop, getApp } from "@/api/modules/project";
import { getLogin, getCategories, getApp } from "@/api/modules/project";
import { ref, computed, nextTick, onActivated, onMounted, watch } from "vue";
import { i18n } from "@/utils/i18n";
import { useI18n } from "vue-i18n";
import { getArchitecture } from "@/utils/common";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const categories = ref<Category[]>([]);
const categoriesDict = ref<Map<string, string>>(new Map());
const rankings = ref<Rankings[]>([]);

const apps = ref<App[]>([]);

const currentPage = ref(1); // 当前页码
const loading = ref(false); // 加载状态
const total = ref<number>(2); // 初始值为 null 以处理未知总数
const noMore = computed(() => apps.value.length >= total.value);
const disabled = computed(() => loading.value || noMore.value); // 是否禁用滚动加载
const createAllCategory = () => ({ categoryId: undefined, categoryName: t("appSearchBar.all") });
const selectedCategory = ref<Category>(createAllCategory());

!localStorage.getItem("currentSort") && localStorage.setItem("currentSort", "createTime");
!localStorage.getItem("currentArch") && localStorage.setItem("currentArch", getArchitecture());
!localStorage.getItem("currentFilter") && localStorage.setItem("currentFilter", "0");
const currentSort = ref(localStorage.getItem("currentSort") || "createTime"); // 当前排序方式
const currentArch = ref(localStorage.getItem("currentArch") || getArchitecture()); // 当前架构
const currentFilter = ref(localStorage.getItem("currentFilter") || "0"); // 当前筛选条件
const searchQuery = ref(typeof route.query.search === "string" ? route.query.search : "");

const getApps = async (params: ReqPageParams) => {
  loading.value = true;
  try {
    const { data: appsData } = await getApp({
      pageNo: currentPage.value,
      pageSize: 40,
      name: searchQuery.value, // 传递搜索条件
      sort: currentSort.value,
      lan: i18n.global.locale,
      arch: currentArch.value === "unknown" ? undefined : currentArch.value, // 如果架构为 unknown，则不传递
      categoryId: selectedCategory.value?.categoryId, // 如果有选择的分类，则传递
      filter: currentFilter.value === "0" ? false : true, // 如果没有选择的筛选条件，则不传递
      ...params
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

const load = async () => {
  getApps({}); // 传递空对象以获取所有应用
};

const syncSearchQueryToRoute = async (query: string) => {
  const normalizedQuery = query.trim();
  const currentQuery = typeof route.query.search === "string" ? route.query.search : "";

  if (currentQuery === normalizedQuery) {
    return;
  }

  await router.replace({
    path: "/",
    query: normalizedQuery ? { search: normalizedQuery } : undefined
  });
};

const applySearch = async (query: string, syncRoute = false) => {
  const normalizedQuery = query.trim();

  searchQuery.value = normalizedQuery;
  if (syncRoute) {
    await syncSearchQueryToRoute(normalizedQuery);
  }

  currentPage.value = 1;
  apps.value = [];
  selectedCategory.value = createAllCategory();
  getApps({
    name: normalizedQuery
  });
};

onMounted(async () => {
  // 输出版本信息
  const osVersion = navigator.userAgent || navigator.appVersion;

  // 获取分类数据
  getCategory();

  load();

  // 获取排名数据
  // const { data: rankingData } = await getTop();
  // rankings.value = rankingData.slice(0, 6);

  // 获取登录IP
  let clientIp = "";
  try {
    const clientRepo = await axios.get("https://ipwhois.app/json/");

    if (clientRepo.status === 200) {
      clientIp = clientRepo.data.ip ? clientRepo.data.ip : "";
    }
  } catch (error) {
    console.warn("获取客户端 IP 失败，将继续使用空 IP 上报", error);
  }
  // 存入session中
  sessionStorage.setItem("clientIp", clientIp);
  // 传递 osVersion
  getLogin({ clientIp, osVersion });
});

onActivated(async () => {
  await nextTick();
  window.dispatchEvent(new Event("resize"));
});

watch(
  () => route.query.search,
  query => {
    const nextSearch = typeof query === "string" ? query : "";

    if (nextSearch === searchQuery.value) {
      return;
    }

    applySearch(nextSearch);
  }
);

const getCategory = async () => {
  const { data: categoryData } = await getCategories({ lang: i18n.global.locale });
  categories.value = [{ categoryId: undefined, categoryName: t("appSearchBar.all"), icon: "Files" }, ...categoryData];
  categories.value.forEach(category => {
    if (category.categoryId) {
      categoriesDict.value.set(category.categoryId, category.categoryName);
    }
  });
};

// watch(
//   () => i18n.global.locale,
//   () => {
//     getCategory();
//   }
// );

const fetchAppsByCategory = async (category: Category) => {
  currentPage.value = 1;
  apps.value = [];
  selectedCategory.value = category;
  // 获取选择分类的应用数据
  getApps({
    categoryId: category.categoryId,
    name: searchQuery.value // 传递搜索条件
  });
};

const handleSearch = async (query: string) => {
  applySearch(query, true);
};

const sortChange = async (sort: string) => {
  currentSort.value = sort;
  localStorage.setItem("currentSort", sort); // 保存排序方式
  currentPage.value = 1; // 重置页码
  apps.value = []; // 清空应用列表
  getApps({});
};

const archChange = async (arch: string) => {
  if (currentArch.value === arch) {
    return;
  }
  currentArch.value = arch;
  localStorage.setItem("currentArch", arch); // 保存架构
  currentPage.value = 1; // 重置页码
  apps.value = []; // 清空应用列表
  getApps({});
};

const filterChange = async (filter: string) => {
  currentFilter.value = filter;
  localStorage.setItem("currentFilter", filter); // 保存筛选条件
  currentPage.value = 1; // 重置页码
  apps.value = []; // 清空应用列表
  getApps({});
};
</script>
<style scoped lang="scss">
.container {
  display: flex;
  gap: 0 60px;
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
  .left-sidebar {
    display: none;
  }

  .right-sidebar {
    display: none;
  }

  .app-list {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
</style>
