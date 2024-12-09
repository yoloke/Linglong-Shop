<template>
  <div class="left">
    <div class="left_1">
      <el-input :placeholder="$t('appSearchBar.placeholder')" :suffix-icon="Search" v-model="query" @change="handleInputChange" />
    </div>
    <div class="left_2">
      <el-card>
        <template #header>
          <span>{{ $t("appSearchBar.category") }}</span>
        </template>
        <div class="category">
          <div
            v-for="category in categories"
            :key="category.categoryId"
            :class="{
              'is-active': category.categoryName === currentCategory.categoryName
            }"
            @click="handleCategoryClick(category)"
          >
             <el-icon>       <component :is="category.icon" />     </el-icon>
            <span>{{ category.categoryName || $t("appSearchBar.other") }}</span>
          </div>
        </div>
      </el-card>
    </div>
    <div class="left_3" v-if="false">
      <el-card>
        <template #header>
          <span>排行</span>
        </template>
        <el-table :data="rankings">
          <el-table-column prop="appName" label="应用名称">
            <template #default="scope">
              <div class="ranking-item">
                <img :src="scope.row.appIcon" />
                <el-tooltip effect="dark" :content="scope.row.appName" placement="top">
                  <span class="ranking-item-appName">
                    {{ scope.row.appName }}
                  </span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="downloadCount" label="下载数" align="center" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Category, Rankings } from "@/api/interface/index";
import { Search } from "@element-plus/icons-vue";
import { ref } from "vue";
const emit = defineEmits(["selectCategory", "search"]);
const query = ref("");
defineProps<{
  categories: Category[];
  rankings: Rankings[];
  currentCategory: Category;
}>();

const handleCategoryClick = (category: Category) => {
  emit("selectCategory", category);
};

// 输入框内容改变时触发
const handleInputChange = () => {
  emit("search", query.value);
};
</script>

<style scoped lang="scss">
.left {
  width: 320px;
  font-size: 14px;

  > div {
    margin-bottom: 16px;
  }

  .is-active {
    color: #1890ff !important;
  }

  .category {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: 20px;
    grid-column-gap: 8px;
    cursor: pointer;

    .el-icon {
      width: 40px;
      margin-bottom: 4px;
      margin-left: -8px;
    }
  }

  .ranking-item {
    display: flex;
    align-items: center;
    margin-left: -30px;
    z-index: 999;

    img {
      width: 20px;
    }

    .ranking-item-appName {
      margin-left: 10px;
      max-width: 150px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
