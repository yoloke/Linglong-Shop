<template>
  <div class="right-container flx-column-align-center" @click="centerDialogVisible = true">
    <span>我要反馈</span>
    <el-icon><Edit /></el-icon>
  </div>
  <el-dialog v-model="centerDialogVisible" title="意见反馈" width="500">
    <div style="margin-bottom: 12px">您的建议是我改进的动力!</div>

    <el-input v-model="message" :rows="4" type="textarea" placeholder="请输入意见反馈" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, h } from "vue";
import { ElMessage } from "element-plus";
import { CircleClose } from "@element-plus/icons-vue"; // 引入自定义图标
import { addSuggest } from "@/api/modules/project";
const centerDialogVisible = ref(false);
const message = ref("");
// 提交处理函数
const handleSubmit = async () => {
  if (!message.value.trim()) {
    ElMessage.error({
      showClose: true,
      message: "请输入意见反馈",
      type: "error",
      icon: h(CircleClose, { style: "width: 1em; height: 1em;" }) // 使用VNode渲染自定义图标
    });
    return;
  }
  const osVersion = navigator.userAgent || navigator.appVersion;
  await addSuggest({
    osVersion,
    message: message.value
  }); // 传递 osVersion
  try {
    // 清空表单并关闭对话框
    message.value = "";
    centerDialogVisible.value = false;
  } catch (error) {
    alert("提交时出现错误，请稍后重试");
  }
};
</script>
<style scoped lang="scss">
.right-container {
  position: fixed;
  bottom: 50%;
  right: 0;
  background-color: #1890ff;
  color: #fff;
  z-index: 9999;
  border-radius: 6px 0px 0px 6px;
  padding: 12px 8px;
  font-size: 12px;
  letter-spacing: 4px;
  cursor: pointer;
  span {
    writing-mode: vertical-rl; /* 文字从上到下排列，从右到左 */
    text-orientation: upright; /* 确保文字直立，而不是旋转90度 */
  }
}
.title {
  margin-bottom: 12px;
}
</style>
