<template>
  <div class="footer-container flx-justify-between select-user-none">
    <span>
      {{ $t("footer.aboutPre") }}
      <a href="https://github.com/OpenAtom-Linyaps/sig-linyaps-simple-store" target="_blank">{{ $t("footer.about") }}</a>
      {{ $t("footer.aboutAft") }}
    </span>
    <div class="contact">
      <span class="text">联系我们</span>
      <facebook @click="openUrl('https://www.facebook.com/groups/mydeepinlinux')" class="icon facebook" />
      <telegram @click="openUrl('https://deepin.org/to/tg')" class="icon telegram" />
      <el-popover class="box-item" placement="top">
        <template #reference>
          <wechat class="icon wechat" />
        </template>
        <img src="@/assets/images/wechatQRCode.jpg" alt="wechat" />
      </el-popover>
      <a href="mailto:appstore@deepin.org"><email class="icon email" /></a>
    </div>
  </div>
</template>
<script setup lang="ts">
import facebook from "@/assets/icons/facebook.svg?component";
import telegram from "@/assets/icons/telegram.svg?component";
import wechat from "@/assets/icons/wechat.svg?component";
import email from "@/assets/icons/email.svg?component";
import { openUrl } from "@/utils/common";
</script>
<style scoped lang="scss">
.footer-container {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 var(--container-margin);
  width: 100%;
  height: 40px;
  opacity: 1;
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  z-index: 9999;
  font-size: 12px;
  color: #383838;
  display: flex;
  align-items: center;
  justify-content: space-between;
  a:hover {
    color: #189eff;
  }
  .contact {
    display: flex;
    align-items: center;
    gap: 6px;
    .text {
      margin-right: 8px;
    }
    .icon {
      cursor: pointer;
      width: 16px;
      height: 16px;
      color: #b6b6b6;
      &:hover {
        &.facebook {
          color: #3c5a99;
        }
        &.telegram {
          color: #1296db;
        }
        &.wechat {
          color: #28c445;
        }
        &.email {
          color: #189eff;
        }
      }
    }
  }
  // .info {
  //   color: #808080;
  //   .item {
  //     width: 100%;
  //     display: flex;
  //     justify-content: space-between;
  //     margin-bottom: 8px;
  //     background-color: pink;
  //     font-size: 22px;
  //   }
  // }
}
</style>
