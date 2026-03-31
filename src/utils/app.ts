import { ElNotification } from "element-plus";
import { installApp, svgUrl2Base64 } from "@/api/modules/project";
import type { App } from "@/api/interface";
import { getArchitecture } from "@/utils/common";

const INSTALL_GUIDE_URL = "https://linyaps.org.cn/guide/start/install.html";
const DEFAULT_ARCH = "x86_64";
const APP_DETAIL_LANG_MAP = {
  zh: "zh_CN",
  en: "en_US"
} as const;

type TranslateFunction = (key: string) => string;

const isLinuxSystem = () => /Linux/i.test(navigator.userAgent || navigator.platform);

export const getPreferredAppArch = (arch?: string) => {
  const resolvedArch = arch || getArchitecture();
  return resolvedArch === "unknown" ? DEFAULT_ARCH : resolvedArch;
};

export const getAppDetailLanguage = (locale?: string) => {
  return APP_DETAIL_LANG_MAP[locale === "en" ? "en" : "zh"];
};

export const buildAppDetailLocation = (appId: string, arch?: string) => {
  const nextArch = arch || undefined;

  return {
    name: "app-detail",
    params: { appId },
    query: nextArch ? { arch: nextArch } : undefined
  };
};

export const installLinglongApp = async (app: App, t: TranslateFunction) => {
  if (!isLinuxSystem()) {
    ElNotification({
      title: t("tips.title"),
      dangerouslyUseHTMLString: true,
      message: `<span>${t("tips.noSupport")}</span>`
    });
    return false;
  }

  const clientIp = sessionStorage.getItem("clientIp") || "";
  const installPayload = {
    ...app,
    clientIp
  };

  ElNotification({
    title: t("tips.title"),
    dangerouslyUseHTMLString: true,
    message: `
      <span>
        ${t("tips.noPopup")}
        <a href="${INSTALL_GUIDE_URL}" target="_blank" style="color: #409EFF; text-decoration: underline;">${t("tips.installLink")}</a>
      </span>
    `
  });

  window.location.href = `og://${app.appId}`;

  try {
    await installApp(installPayload);
  } catch {
    // 安装记录留痕失败不应阻断网页端安装流程。
  }

  return true;
};

export const resolveSvgIconDataUrl = async (url?: string) => {
  if (!url) {
    return undefined;
  }

  try {
    const response = await svgUrl2Base64({ url });
    const dataUrl = typeof response.data === "string" ? response.data : undefined;

    if (String(response.code) !== "200" || !dataUrl) {
      return undefined;
    }

    return await new Promise<string | undefined>(resolve => {
      const image = new Image();

      image.onload = () => resolve(dataUrl);
      image.onerror = () => resolve(undefined);
      image.src = dataUrl;
    });
  } catch {
    return undefined;
  }
};
