<template>
  <div class="right-sidebar">
    <el-affix :offset="130">
      <div class="recommended">
        <div class="title-area">
          <div class="title">社区推荐</div>
          <div class="action">换一换</div>
        </div>
        <div class="recommended-apps">
          <div class="recommended-app">
            <div class="icon"></div>
            <div class="info">
              <div class="name">QQ</div>
              <div class="detail">这里是它滴描述这里是它滴描述这里是它...</div>
            </div>
            <div class="install">安装</div>
          </div>
          <div class="recommended-app">
            <div class="icon"></div>
            <div class="info">
              <div class="name">QQ</div>
              <div class="detail">这里是它滴描述这里是它滴描述这里是它...</div>
            </div>
            <div class="install">安装</div>
          </div>
          <div class="recommended-app">
            <div class="icon"></div>
            <div class="info">
              <div class="name">QQ</div>
              <div class="detail">这里是它滴描述这里是它滴描述这里是它...</div>
            </div>
            <div class="install">安装</div>
          </div>
          <div class="recommended-app">
            <div class="icon"></div>
            <div class="info">
              <div class="name">QQ</div>
              <div class="detail">这里是它滴描述这里是它滴描述这里是它...</div>
            </div>
            <div class="install">安装</div>
          </div>
          <div class="recommended-app">
            <div class="icon"></div>
            <div class="info">
              <div class="name">QQ</div>
              <div class="detail">这里是它滴描述这里是它滴描述这里是它...</div>
            </div>
            <div class="install">安装</div>
          </div>
        </div>
      </div>
    </el-affix>
  </div>
</template>
<script setup lang="ts">
// import { Category, Rankings } from "@/api/interface/index";
// const emit = defineEmits(["selectCategory", "search"]);

// defineProps<{
//   categories: Category[];
//   rankings: Rankings[];
//   currentCategory: Category;
// }>();

// const handleCategoryClick = (category: Category) => {
//   emit("selectCategory", category);
// };
</script>

<style scoped lang="scss">
.right-sidebar {
  height: 100%;
  width: 336px;
  .recommended {
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.05);
    background-color: #fff;
    border-radius: 8px;
    max-height: calc(100vh - 86px - 80px);
    display: flex;
    flex-direction: column;
    .title-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e5e5e5;
      .title {
        font-size: 16px;
        font-weight: 500;
        color: #000;
      }
      .action {
        font-size: 14px;
        color: #8f9a9d;
        cursor: pointer;
        &:hover {
          color: #1890ff;
        }
      }
    }
    .recommended-apps {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      // -ms-overflow-style: none;
      // scrollbar-width: none;
      .recommended-app {
        display: flex;
        padding: 24px;
        align-items: center;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          height: 60px;
          background-color: #ccc;
          border-radius: 8px;
          margin-right: 10px;
        }
        .info {
          flex-grow: 1;
          .name {
            font-size: 16px;
            font-weight: 400;
            color: #000;
            height: 24px;
            line-height: 24px;
          }
          .detail {
            font-size: 12px;
            color: #808080;
            line-height: 18px;
            height: 36px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        .install {
          flex: 0 0 60px;
          font-size: 14px;
          text-align: center;
          padding: 6px 0;
          color: #1890ff;
          cursor: pointer;
          background-color: #e6edf8;
          border-radius: 4px;
          margin-left: 24px;
          &:hover {
            background-color: #1890ff;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
