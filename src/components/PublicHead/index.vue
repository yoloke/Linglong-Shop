<template>
  <div :class="['header-container', 'flx-align-center', { scrolled: true }]">
    <div class="header-logo-area select-user-none">
      <linyapsLogo class="header-logo" />
      <div class="header-logo-title">
        <span :class="`title ${i18n.global.locale === 'zh' ? 'zh' : ''}`">{{ $t("title.title") }}</span>
        <span class="content">- {{ $t("title.subtitle1") }} -</span>
      </div>
    </div>
    <div class="header-search">
      <el-input
        v-model="searchInput"
        :placeholder="$t('title.search')"
        class="search-input"
        @keyup.enter="handleSearch"
        @clear="handleSearch"
        clearable
      >
        <template #append>
          <searchIcon @click="handleSearch" class="search-icon" />
        </template>
      </el-input>
    </div>
    <div class="header-actions">
      <div class="download-client" @click="onInstall">
        <DownloadClientIcon class="download-client-icon" />
        <div class="install-text">{{ $t("title.downloadClient") }}</div>
      </div>
      <a class="tourl" @click="openUrl('https://linyaps.org.cn/')">{{ $t("title.website") }}</a>
      <a class="tourl" @click="openUrl('https://appstore-dev.uniontech.com/#/index')">{{ $t("title.delivery") }}</a>
      <a class="tourl" @click="openUrl('https://linyaps.org.cn/guide/start/whatis.html')">{{ $t("title.documents") }}</a>
      <div class="env-install" @click="openUrl('https://linyaps.org.cn/guide/start/install.html')">
        <div class="install-text">{{ $t("title.installEnv") }}</div>
        <!-- <ArrowBottomIcon class="env-install-icon" /> -->
      </div>
      <div class="language">
        <a :class="`zh ${i18n.global.locale === 'zh' ? 'active' : ''}`" @click="changeLanguage('zh')">简</a>
        <span class="divider select-user-none">/</span>
        <a :class="`en ${i18n.global.locale === 'en' ? 'active' : ''}`" @click="changeLanguage('en')">EN</a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { i18n } from "@/utils/i18n";
import { computed, ref, watch } from "vue";
import onInstall from "@/utils/downloadClient";
import { openUrl } from "@/utils/common";
import { useRoute, useRouter } from "vue-router";

// ########## 组件头部 ########## //
// 标题
import linyapsLogo from "@/assets/images/linyaps_logo.svg?component";

// 搜索框
import searchIcon from "@/assets/icons/search.svg?component";
const searchInput = ref<string>("");
const route = useRoute();
const router = useRouter();

const currentSearchQuery = computed(() => (typeof route.query.search === "string" ? route.query.search : ""));

watch(
  currentSearchQuery,
  value => {
    searchInput.value = value;
  },
  { immediate: true }
);

const handleSearch = async () => {
  const nextSearch = searchInput.value.trim();

  if (route.path !== "/" || currentSearchQuery.value !== nextSearch) {
    await router.push({
      path: "/",
      query: nextSearch ? { search: nextSearch } : undefined
    });
  }
};

// 其他 Icon
import DownloadClientIcon from "@/assets/icons/download_client.svg?component";
// import ArrowBottomIcon from "@/assets/icons/arrow_bottom.svg?component";

const changeLanguage = (lang: "zh" | "en") => {
  if (i18n.global.locale === lang) return;
  i18n.global.locale = lang;
  localStorage.setItem("language", lang);
  location.reload();
};
</script>
<style scoped lang="scss">
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0 var(--container-margin);
  width: 100%;
  height: 86px;
  opacity: 1;
  box-sizing: border-box;
  background: #fafafa;
  z-index: 100;
  .header-logo-area {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-right: auto;
    .header-logo {
      height: 42px;
      width: 42px;
    }
    .header-logo-title {
      display: flex;
      gap: 4px;
      flex-direction: column;
      line-height: 18px;
      .title {
        font-size: 18px;
        font-weight: 600;
        color: #000;
        height: 18px;
        &.zh {
          letter-spacing: 0.05em;
        }
      }
      .content {
        font-size: 12px;
        font-weight: 400;
        color: #000;
        height: 18px;
      }
    }
  }
  .header-search {
    // position: absolute;
    // margin: auto;
    :deep(.search-input) {
      width: 360px;
      height: 42px;
      .el-input__wrapper {
        box-sizing: border-box;
        background-color: #f2f2f2;
        border-radius: 28px 0 0 28px;
        padding: 0 8px 0 16px;
        border: #f2f2f2 1px solid;
        .el-input__inner {
          height: auto;
          &::placeholder {
            color: #747474;
          }
        }
      }
      .el-input-group__append {
        background-color: #f2f2f2;
        border-radius: 0 28px 28px 0;
        box-shadow: none;
        padding: 0 16px 0 12px;
        border: #f2f2f2 1px solid;
        color: #808080;
        .search-icon {
          cursor: pointer;
          width: 18px;
          height: 18px;
        }
      }
      &:has(.is-focus) {
        .el-input__wrapper {
          border: #1890ff 1px solid;
        }
        .el-input-group__append {
          cursor: pointer;
          border: #1890ff 1px solid;
          background-color: #1890ff;
          color: #fff;
        }
      }
    }
    .search-action {
      background-color: #1890ff;
      border-radius: 0 28px 28px 0;
      .search-icon {
        padding: 16px;
        width: 16px;
        height: 16px;
      }
    }
  }
  .header-actions {
    display: flex;
    gap: 36px;
    margin-left: 40px;
    align-items: center;
    font-size: 16px;
    color: #404040;
    .download-client {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      height: 42px;
      background-color: #e8f3fd;
      padding: 0 14px;
      border-radius: 28px;
      transition: background-color 0.3s;
      .download-client-icon {
        width: 18px;
        height: 18px;
      }
      .install-text {
        color: #1890ff;
      }
      &:hover {
        background-color: #d0e7ff;
      }
    }
    .env-install {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      height: 36px;
      background-color: #1890ff;
      padding: 0 16px;
      border-radius: 6px;
      transition: background-color 0.3s;
      .env-install-icon {
        width: 16px;
        height: 16px;
      }
      .install-text {
        color: #fff;
      }
      &:hover {
        background-color: #0d6efd;
      }
    }
    .tourl {
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: #1890ff;
      }
    }
    .language {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 16px;
      a {
        cursor: pointer;
        color: #8f9a9d;
        transition: color 0.3s;
        &:hover {
          color: #409eff;
        }
        &.active {
          color: #383838;
        }
      }
      .divider {
        margin: 0 4px;
        margin-top: 2px;
        color: #6a6a6a;
        font-size: 10px;
      }
    }
  }
  .menu-list {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    a {
      cursor: pointer;
      transition: color 0.2s;
      &:hover {
        color: #409eff;
      }
    }
    .language-icon {
      width: 16px;
      height: 16px;
    }
  }

  &.scrolled {
    // background-color: #fff; /* 滚动后背景色变为白色 */
    box-shadow: 0 2.33px 4.67px rgb(0 0 0 / 5%);
  }

  img {
    width: 120px;
  }
}

@media screen and (width <= 1250px) {
  .download-client {
    display: none !important;
  }
  .tourl {
    display: none !important;
  }
}
</style>
