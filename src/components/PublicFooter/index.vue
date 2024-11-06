<template>
  <div class="footer-container flx-justify-between">
    <span> 
      本商店来自于
      <a href="https://github.com/OpenAtom-Linyaps/sig-linyaps-simple-store" target="_blank">简易玲珑商店SIG组</a>
      贡献</span>
    <el-tooltip effect="light" placement="top-start">
      <template #content>
        <div class="flx-column">
          <div class="flx-justify-between info">
            <span>后端：Jokul</span>
            <span> 986432015@qq.com</span>
          </div>
          <div class="flx-justify-between info">
            <span style="margin-right: 12px">前端：Yoloke </span>
            <span> 2575735053@qq.com</span>
          </div>
          <div class="flx-justify-between info">
            <span>设计：Gyro</span>
            <span> bgsdmyck12@163.com</span>
          </div>
        </div>
      </template>
      <span>相关开发人员</span>
    </el-tooltip>
  </div>
</template>
<script setup lang="ts"></script>
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
  color: #808080;
  a:hover {
    color: blue;
  }
  .info {
    color: #808080;
    .item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      background-color: pink;
      font-size: 22px;
    }
  }
}
</style>
