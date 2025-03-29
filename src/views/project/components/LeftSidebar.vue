<template>
  <div class="left">
    <el-affix :offset="130">
      <div class="categories">
        <div
          v-for="category in categories"
          :key="category.categoryId"
          :class="{
            'is-active': category.categoryName === currentCategory.categoryName
          }"
          class="category"
          @click="handleCategoryClick(category)"
        >
          <el-icon size="16"><component :is="category.icon" /></el-icon>
          <div class="category-name">{{ category.categoryName || $t("appSearchBar.other") }}</div>
          <!-- <div class="category-count">{{ category.categoryName === currentCategory.categoryName ? "(1000)" : "(1)" }}</div> -->
        </div>
      </div>
    </el-affix>
  </div>
</template>
<script setup lang="ts">
import { Category, Rankings } from "@/api/interface/index";
const emit = defineEmits(["selectCategory", "search"]);

defineProps<{
  categories: Category[];
  rankings: Rankings[];
  currentCategory: Category;
}>();

const handleCategoryClick = (category: Category) => {
  emit("selectCategory", category);
};
</script>

<style scoped lang="scss">
.left {
  height: 100%;
  .categories {
    background-color: #fff;
    padding: 16px;
    border-radius: 8px;
    max-height: calc(100vh - 86px - 80px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    .category {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      &:hover {
        background-color: #1890FF;
        color: #fff;
      }
      .category-icon {
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .category-name {
        font-size: 12px;
        width: 4em;
        margin-right: 16px;
      }
      .category-count {
        min-width: 3em;
        font-size: 12px;
      }
    }
    .is-active {
      background-color: #1890FF;
      color: #fff;
    }
  }
  :deep(.el-affix--fixed) {
    top: 106px !important;
  }
}
</style>
