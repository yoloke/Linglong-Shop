<template>
  <PublicHead />
  <div class="app-detail-page">
    <div class="app-detail-container">
      <div class="detail-toolbar">
        <el-button text class="back-button" @click="handleGoBack"> ← {{ $t("appDetail.actions.back") }} </el-button>
      </div>

      <el-result
        v-if="!detailLoading && detailError"
        icon="warning"
        :title="$t('appDetail.states.unavailableTitle')"
        :sub-title="detailError"
        class="detail-result"
      >
        <template #extra>
          <el-button type="primary" @click="handleGoHome">
            {{ $t("appDetail.actions.backHome") }}
          </el-button>
        </template>
      </el-result>

      <template v-else>
        <section class="hero-card">
          <div v-if="detailLoading && !appDetail" class="hero-skeleton">
            <div class="hero-skeleton__icon"></div>
            <div class="hero-skeleton__content">
              <div class="hero-skeleton__line hero-skeleton__line--title"></div>
              <div class="hero-skeleton__line"></div>
              <div class="hero-skeleton__line hero-skeleton__line--short"></div>
              <div class="hero-skeleton__grid">
                <div v-for="index in 6" :key="`hero-meta-${index}`" class="hero-skeleton__meta"></div>
              </div>
            </div>
          </div>

          <template v-else>
            <div class="hero-icon-box">
              <img
                v-if="appDetail?.icon"
                :src="appDetail.icon"
                :alt="displayName"
                class="hero-icon"
                @error="handleCurrentIconError"
              />
              <DefaultIcon v-else class="hero-icon hero-icon--fallback" />
            </div>

            <div class="hero-body">
              <div class="hero-header">
                <div class="hero-title-group">
                  <div class="hero-title-row">
                    <h1>{{ displayName }}</h1>
                    <el-tag effect="light" type="primary">
                      {{ appDetail?.version || $t("appDetail.meta.unknown") }}
                    </el-tag>
                    <el-tag v-if="appDetail?.categoryName" effect="plain">
                      {{ appDetail.categoryName }}
                    </el-tag>
                  </div>
                  <p class="hero-summary">
                    {{ summaryText }}
                  </p>
                </div>

                <div class="hero-actions">
                  <el-button type="primary" size="large" @click="handleInstall">
                    {{ $t("appDetail.actions.install") }}
                  </el-button>
                  <el-button size="large" @click="handleShareLink">
                    {{ $t("appDetail.actions.shareLink") }}
                  </el-button>
                </div>
              </div>

              <dl class="hero-meta-grid">
                <div class="meta-item">
                  <dt>{{ $t("appDetail.meta.appId") }}</dt>
                  <dd>{{ formatValue(appDetail?.appId) }}</dd>
                </div>
                <div class="meta-item">
                  <dt>{{ $t("appDetail.meta.arch") }}</dt>
                  <dd>{{ formatArch(appDetail?.arch) }}</dd>
                </div>
                <div class="meta-item">
                  <dt>{{ $t("appDetail.meta.developer") }}</dt>
                  <dd>{{ formatValue(appDetail?.user || appDetail?.devName) }}</dd>
                </div>
                <div class="meta-item">
                  <dt>{{ $t("appDetail.meta.source") }}</dt>
                  <dd>{{ formatValue(appDetail?.repoName) }}</dd>
                </div>
                <div class="meta-item">
                  <dt>{{ $t("appDetail.meta.size") }}</dt>
                  <dd>{{ formatFileSize(appDetail?.size) }}</dd>
                </div>
                <div class="meta-item">
                  <dt>{{ $t("appDetail.meta.downloads") }}</dt>
                  <dd>{{ formatMetric(appDetail?.installCount) }}</dd>
                </div>
              </dl>
            </div>
          </template>
        </section>

        <section class="detail-section">
          <div class="section-header">
            <div>
              <h2>{{ $t("appDetail.description.title") }}</h2>
            </div>
          </div>

          <div v-if="detailLoading && !appDetail" class="content-skeleton">
            <div v-for="index in 4" :key="`desc-skeleton-${index}`" class="content-skeleton__line"></div>
          </div>
          <p v-else class="description-content">
            {{ descriptionText }}
          </p>
        </section>

        <section class="detail-section">
          <div class="section-header">
            <div>
              <h2>{{ $t("appDetail.screenshots.title") }}</h2>
            </div>
            <span v-if="screenshotList.length" class="section-count">
              {{ $t("appDetail.screenshots.count", { count: screenshotList.length }) }}
            </span>
          </div>

          <div v-if="detailLoading && !appDetail" class="screenshot-grid screenshot-grid--loading">
            <div v-for="index in 3" :key="`shot-skeleton-${index}`" class="screenshot-card screenshot-card--skeleton"></div>
          </div>
          <el-empty v-else-if="!screenshotList.length" :description="$t('appDetail.screenshots.empty')" />
          <div v-else class="screenshot-grid">
            <el-image
              v-for="(screenshot, index) in screenshotList"
              :key="screenshot.screenshotKey || index"
              :src="screenshot.screenshotKey"
              :preview-src-list="screenshotPreviewList"
              :initial-index="index"
              fit="cover"
              preview-teleported
              class="screenshot-card"
            >
              <template #error>
                <div class="screenshot-card screenshot-card--error">
                  {{ $t("appDetail.screenshots.unavailable") }}
                </div>
              </template>
            </el-image>
          </div>
        </section>

        <section class="detail-section">
          <div class="section-header">
            <div>
              <h2>{{ $t("appDetail.versions.title") }}</h2>
            </div>
            <div v-if="versionHistory.length" class="section-actions">
              <span class="section-count">
                {{ $t("appDetail.versions.count", { count: versionHistory.length }) }}
              </span>
              <el-button v-if="hiddenVersionCount > 0" text class="section-toggle" @click="toggleVersionHistory">
                {{
                  showAllVersions
                    ? $t("appDetail.versions.collapse")
                    : $t("appDetail.versions.expand", { count: hiddenVersionCount })
                }}
              </el-button>
            </div>
          </div>

          <div v-if="detailLoading && !appDetail" class="version-list version-list--loading">
            <div v-for="index in 3" :key="`version-skeleton-${index}`" class="version-card version-card--skeleton"></div>
          </div>
          <el-empty v-else-if="!versionHistory.length" :description="$t('appDetail.versions.empty')" />
          <div v-else class="version-list">
            <article
              v-for="(version, index) in visibleVersionHistory"
              :key="buildVersionKey(version, index)"
              class="version-card"
            >
              <div class="version-card__header">
                <div class="version-card__title">
                  <strong>{{ version.version || $t("appDetail.meta.unknown") }}</strong>
                  <el-tag v-if="index === 0" size="small" type="primary" effect="light">
                    {{ $t("appDetail.versions.latest") }}
                  </el-tag>
                </div>
                <span class="version-card__source">
                  {{ formatValue(version.repoName) }}
                </span>
              </div>
              <div class="version-card__meta">
                <span>{{ $t("appDetail.versions.labels.arch") }}：{{ formatArch(version.arch) }}</span>
                <span>{{ $t("appDetail.versions.labels.channel") }}：{{ formatValue(version.channel) }}</span>
                <span>{{ $t("appDetail.versions.labels.module") }}：{{ formatValue(version.module) }}</span>
                <span>{{ $t("appDetail.versions.labels.size") }}：{{ formatFileSize(version.size) }}</span>
                <span>{{ $t("appDetail.versions.labels.downloads") }}：{{ formatMetric(version.installCount) }}</span>
              </div>
            </article>
          </div>
        </section>

        <section class="detail-section comments-section">
          <div class="section-header">
            <div>
              <h2>{{ $t("appDetail.comments.title") }}</h2>
              <p class="section-tip">{{ $t("appDetail.comments.readonlyHint") }}</p>
            </div>
            <span v-if="comments.length" class="section-count">
              {{ $t("appDetail.comments.count", { count: comments.length }) }}
            </span>
          </div>

          <div v-if="commentsLoading" class="comment-list comment-list--loading">
            <div v-for="index in 3" :key="`comment-skeleton-${index}`" class="comment-card comment-card--skeleton"></div>
          </div>
          <el-empty v-else-if="!comments.length" :description="$t('appDetail.comments.empty')" />
          <div v-else class="comment-list">
            <article v-for="comment in comments" :key="comment.id" class="comment-card">
              <div class="comment-card__header">
                <div class="comment-card__version">
                  <span v-if="comment.version">{{ $t("appDetail.comments.versionLabel", { version: comment.version }) }}</span>
                </div>
                <time class="comment-card__time">{{ formatDateTime(comment.createTime) }}</time>
              </div>
              <p class="comment-card__content">
                {{ comment.remark }}
              </p>
              <div class="comment-card__stats">
                <span>{{ $t("appDetail.comments.likes") }} {{ comment.agreeNum || 0 }}</span>
                <span>{{ $t("appDetail.comments.dislikes") }} {{ comment.disagreeNum || 0 }}</span>
              </div>
            </article>
          </div>
        </section>
      </template>
    </div>
  </div>
  <PublicRight />
  <PublicFooter />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import type { AppComment, AppDetail, AppScreenshot } from "@/api/interface";
import { getAppCommentList, getAppDetail } from "@/api/modules/project";
import PublicFooter from "@/components/PublicFooter/index.vue";
import PublicHead from "@/components/PublicHead/index.vue";
import PublicRight from "@/components/PublicRight/index.vue";
import DefaultIcon from "@/assets/images/default.svg?component";
import { formatFileSize } from "@/utils/format";
import { copyText } from "@/utils/common";
import { getAppDetailLanguage, getPreferredAppArch, installLinglongApp, resolveSvgIconDataUrl } from "@/utils/app";

const COMMENT_PAGE_SIZE = 20;

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

const detailLoading = ref(true);
const commentsLoading = ref(true);
const detailError = ref("");
const appDetail = ref<AppDetail | null>(null);
const versionHistory = ref<AppDetail[]>([]);
const comments = ref<AppComment[]>([]);
const activeRequestId = ref(0);
const showAllVersions = ref(false);

const appId = computed(() => {
  const routeAppId = route.params.appId;
  return typeof routeAppId === "string" ? decodeURIComponent(routeAppId) : "";
});
const currentArch = computed(() => getPreferredAppArch(typeof route.query.arch === "string" ? route.query.arch : undefined));
const detailLanguage = computed(() => getAppDetailLanguage(locale.value));
const screenshotList = computed(() => {
  return appDetail.value?.appScreenshotList?.filter((item: AppScreenshot) => item.screenshotKey) || [];
});
const screenshotPreviewList = computed(() => {
  return screenshotList.value.map((item: AppScreenshot) => item.screenshotKey);
});
const visibleVersionHistory = computed(() => {
  return showAllVersions.value ? versionHistory.value : versionHistory.value.slice(0, 1);
});
const hiddenVersionCount = computed(() => {
  return Math.max(versionHistory.value.length - 1, 0);
});
const isEnglishLocale = computed(() => locale.value.toLowerCase().startsWith("en"));
const displayName = computed(
  () =>
    (isEnglishLocale.value
      ? appDetail.value?.name || appDetail.value?.zhName
      : appDetail.value?.zhName || appDetail.value?.name) ||
    appId.value ||
    t("appDetail.meta.unknown")
);
const summaryText = computed(() => appDetail.value?.description || appDetail.value?.descInfo || t("appDetail.states.noSummary"));
const descriptionText = computed(
  () => appDetail.value?.descInfo || appDetail.value?.description || t("appDetail.states.noDescription")
);
const shareLink = computed(() => `${window.location.origin}${route.fullPath}`);

const ARCH_LABEL_MAP: Record<string, string> = {
  x86_64: "x86_64",
  arm64: "ARM64",
  loong64: "LoongArch64",
  loongarch64: "LoongArch64"
};

const getUniqueVersionHistory = (details: AppDetail[]) => {
  const uniqueVersionMap = new Map<string, AppDetail>();

  details.forEach(detail => {
    const uniqueKey = `${detail.version || "unknown"}-${detail.arch || "unknown"}`;
    const currentVersion = uniqueVersionMap.get(uniqueKey);

    if (!currentVersion || (detail.module === "binary" && currentVersion.module !== "binary")) {
      uniqueVersionMap.set(uniqueKey, detail);
    }
  });

  return Array.from(uniqueVersionMap.values());
};

const buildVersionKey = (version: AppDetail, index: number) => {
  return `${version.appId || appId.value}-${version.version || "unknown"}-${version.arch || "unknown"}-${index}`;
};

const toggleVersionHistory = () => {
  showAllVersions.value = !showAllVersions.value;
};

const formatValue = (value?: string | null) => {
  return value || t("appDetail.meta.unknown");
};

const formatMetric = (value?: number | null) => {
  if (typeof value !== "number") {
    return t("appDetail.meta.unknown");
  }

  return value.toLocaleString();
};

const formatArch = (arch?: string | null) => {
  if (!arch) {
    return t("appDetail.meta.unknown");
  }

  return ARCH_LABEL_MAP[arch] || arch;
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return t("appDetail.meta.unknown");
  }

  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD HH:mm") : value;
};

const loadAppDetailPage = async () => {
  if (!appId.value) {
    appDetail.value = null;
    versionHistory.value = [];
    comments.value = [];
    detailLoading.value = false;
    commentsLoading.value = false;
    detailError.value = t("appDetail.states.invalidAppId");
    return;
  }

  const requestId = activeRequestId.value + 1;
  activeRequestId.value = requestId;
  detailLoading.value = true;
  commentsLoading.value = true;
  detailError.value = "";
  showAllVersions.value = false;

  const [detailResult, commentResult] = await Promise.allSettled([
    getAppDetail([{ appId: appId.value, arch: currentArch.value, lang: detailLanguage.value }]),
    getAppCommentList({ appId: appId.value, pageNo: 1, pageSize: COMMENT_PAGE_SIZE })
  ]);

  if (requestId !== activeRequestId.value) {
    return;
  }

  if (detailResult.status === "fulfilled") {
    const detailMap = detailResult.value.data || {};
    const detailList = Array.isArray(detailMap[appId.value]) ? detailMap[appId.value] : [];
    const normalizedVersionHistory = getUniqueVersionHistory(detailList);

    versionHistory.value = normalizedVersionHistory;
    appDetail.value = normalizedVersionHistory[0] || detailList[0] || null;
    detailError.value = appDetail.value ? "" : t("appDetail.states.notFound");
  } else {
    appDetail.value = null;
    versionHistory.value = [];
    detailError.value = t("appDetail.states.loadFailed");
  }

  if (commentResult.status === "fulfilled") {
    comments.value = Array.isArray(commentResult.value.data) ? commentResult.value.data : [];
  } else {
    comments.value = [];
  }

  detailLoading.value = false;
  commentsLoading.value = false;
};

const handleGoBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  handleGoHome();
};

const handleGoHome = () => {
  router.push({ name: "home" });
};

const handleInstall = async () => {
  if (!appDetail.value) {
    return;
  }

  await installLinglongApp(appDetail.value, t);
};

const handleShareLink = async () => {
  const shareData = {
    title: displayName.value,
    text: t("appDetail.share.message", { name: displayName.value }),
    url: shareLink.value
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      ElMessage.success(t("appDetail.share.shared"));
      return;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
    }
  }

  const copied = await copyText(shareLink.value);
  if (copied) {
    ElMessage.success(t("appDetail.share.copied"));
    return;
  }

  ElMessage.error(t("appDetail.share.copyFailed"));
};

const handleCurrentIconError = async () => {
  if (!appDetail.value) {
    return;
  }

  const fallbackIcon = await resolveSvgIconDataUrl(appDetail.value.icon);
  appDetail.value = {
    ...appDetail.value,
    icon: fallbackIcon
  };
};

watch(
  [appId, currentArch, detailLanguage],
  () => {
    loadAppDetailPage();
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.app-detail-page {
  --detail-card-radius: 8px;
  --detail-inner-radius: 8px;

  padding: 118px var(--container-margin) 60px;
  min-height: 100vh;
}

.app-detail-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-toolbar {
  display: flex;
  align-items: center;
}

.back-button {
  padding: 0;
  font-size: 14px;
  color: #6b7280;
}

.detail-result {
  border-radius: var(--detail-card-radius);
  padding: 32px 16px;
  background: #fff;
}

.hero-card,
.detail-section {
  border-radius: var(--detail-card-radius);
  background: #fff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
}

.hero-card {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 28px;
  padding: 32px;
}

.hero-icon-box {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.hero-icon {
  border-radius: 12px;
  width: 132px;
  height: 132px;
  background: linear-gradient(180deg, #f7f9fc 0%, #eef4ff 100%);
  object-fit: cover;
}

.hero-icon--fallback {
  padding: 24px;
}

.hero-body {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.hero-title-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.hero-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-title-row h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
  color: #111827;
}

.hero-summary {
  margin: 0;
  line-height: 1.75;
  white-space: pre-line;
  color: #4b5563;
}

.hero-actions {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-shrink: 0;
}

.hero-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
}

.meta-item {
  border-radius: var(--detail-inner-radius);
  padding: 16px 18px;
  background: #f8fafc;
}

.meta-item dt {
  margin-bottom: 8px;
  font-size: 13px;
  color: #6b7280;
}

.meta-item dd {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
  color: #111827;
}

.detail-section {
  padding: 28px 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  font-size: 22px;
  color: #111827;
}

.section-tip {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
}

.section-count {
  font-size: 14px;
  white-space: nowrap;
  color: #6b7280;
}

.section-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.section-toggle {
  padding: 0;
}

.description-content {
  margin: 0;
  line-height: 1.9;
  white-space: pre-line;
  color: #374151;
}

.screenshot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.screenshot-card {
  border-radius: var(--detail-inner-radius);
  width: 100%;
  height: 180px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%);
  overflow: hidden;
}

.screenshot-card :deep(img) {
  transition: transform 0.25s ease;
}

.screenshot-card:hover :deep(img) {
  transform: scale(1.02);
}

.screenshot-card--error,
.screenshot-card--skeleton {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.screenshot-card--skeleton,
.hero-skeleton__icon,
.hero-skeleton__line,
.hero-skeleton__meta,
.content-skeleton__line,
.version-card--skeleton,
.comment-card--skeleton {
  position: relative;
  background: linear-gradient(90deg, #eff3f8 0%, #f8fafc 50%, #eff3f8 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  overflow: hidden;
}

.version-list,
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.version-card,
.comment-card {
  border: 1px solid #e5eef7;
  border-radius: var(--detail-inner-radius);
  padding: 20px 22px;
  background: #fcfdff;
}

.version-card__header,
.comment-card__header,
.comment-card__stats,
.version-card__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.version-card__title {
  justify-content: flex-start;
}

.version-card__title strong {
  font-size: 20px;
  color: #111827;
}

.version-card__source,
.comment-card__time {
  font-size: 13px;
  color: #6b7280;
}

.version-card__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 16px;
  font-size: 14px;
  color: #475569;
}

.comment-card__version {
  font-size: 13px;
  color: #2563eb;
}

.comment-card__content {
  margin: 14px 0 0;
  line-height: 1.8;
  white-space: pre-line;
  color: #374151;
}

.comment-card__stats {
  justify-content: flex-start;
  margin-top: 16px;
  font-size: 13px;
  color: #6b7280;
}

.hero-skeleton {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 28px;
  width: 100%;
}

.hero-skeleton__icon {
  border-radius: 12px;
  width: 132px;
  height: 132px;
}

.hero-skeleton__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-skeleton__line {
  border-radius: 999px;
  height: 16px;
}

.hero-skeleton__line--title {
  width: 42%;
  height: 26px;
}

.hero-skeleton__line--short {
  width: 58%;
}

.hero-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.hero-skeleton__meta {
  border-radius: var(--detail-inner-radius);
  height: 88px;
}

.content-skeleton {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.content-skeleton__line {
  border-radius: 999px;
  height: 14px;
}

.content-skeleton__line:last-child {
  width: 68%;
}

.version-card--skeleton,
.comment-card--skeleton {
  min-height: 120px;
}

.comments-section :deep(.el-empty),
.detail-section :deep(.el-empty) {
  padding: 16px 0 8px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media screen and (width <= 1250px) {
  .app-detail-page {
    padding-inline: 24px;
  }

  .hero-card,
  .hero-skeleton {
    grid-template-columns: 1fr;
  }

  .hero-icon-box {
    justify-content: flex-start;
  }

  .hero-header {
    flex-direction: column;
  }

  .hero-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .hero-meta-grid,
  .hero-skeleton__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media screen and (width <= 768px) {
  .app-detail-page {
    padding: 102px 16px 48px;
  }

  .hero-card,
  .detail-section {
    padding: 22px 18px;
  }

  .hero-title-row h1 {
    font-size: 26px;
  }

  .hero-meta-grid,
  .hero-skeleton__grid {
    grid-template-columns: 1fr;
  }

  .screenshot-grid {
    grid-template-columns: 1fr;
  }
}
</style>
