<template>
  <div class="right-container flx-column-align-center" @click="openBoard">
    <span>问题答疑</span>
    <el-icon>
      <Edit/>
    </el-icon>
  </div>

  <el-dialog class="question-board" v-model="questionDialogVisible" title="答疑看板" width="500">
    <el-collapse>
      <el-collapse-item v-for="(question,index) in questionList" :title="`问题：${question?.question}`" :name="index">
        <div>
          解答：{{ question?.reply }}
        </div>
      </el-collapse-item>
    </el-collapse>

    <template #footer>
      <div class="feedback-tip">
        <span>找不到想要的问题?</span>
        <el-link type="primary" @click="centerDialogVisible=true">我要反馈 →</el-link>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="centerDialogVisible" title="意见反馈" width="549">
    <div style="margin-bottom: 12px">您的建议是我改进的动力!</div>

    <el-input v-model="message" :rows="4" type="textarea" placeholder="请输入意见反馈"/>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {ref, h, onMounted} from "vue";
import {ElMessage} from "element-plus";
import {CircleClose} from "@element-plus/icons-vue"; // 引入自定义图标
import {addSuggest, getQuestionList} from "@/api/modules/project";

const questionDialogVisible = ref(true);
const centerDialogVisible = ref(false);
const message = ref("");

// 答疑面板问题列表
const questionList = ref([])

// 打开面板
const openBoard = () => {
  // 存在上架问题则展示答疑面板
  if (questionList?.value?.length > 0) {
    questionDialogVisible.value = true
  } else {
    // 不存在则直接打开反馈面板
    centerDialogVisible.value = true
  }
}

// 提交处理函数
const handleSubmit = async () => {
  if (!message.value.trim()) {
    ElMessage.error({
      showClose: true,
      message: "请输入意见反馈",
      type: "error",
      icon: h(CircleClose, {style: "width: 1em; height: 1em;"}) // 使用VNode渲染自定义图标
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
    questionDialogVisible.value = false;
  } catch (error) {
    alert("提交时出现错误，请稍后重试");
  }
};

const init = async () => {
  try {
    const {data: questions} = await getQuestionList()
    questionList.value = [...questions]
  } finally {

  }
}

onMounted(async () => {
  await init()

})

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


::v-deep .el-collapse-item {
  border: 1px solid rgba(229, 229, 229, 1);
  border-radius: 2px 2px;
  margin-top: 8px;
}

::v-deep .el-collapse-item__header {
  background: rgba(247, 250, 255, 1);
  border-bottom: 1px solid rgba(229, 229, 229, 1);

  font-size: 12px;
  font-weight: 400;
  line-height: 17.38px;
  color: rgba(56, 56, 56, 1);
  text-align: left;
  vertical-align: top;
  padding-left: 10px;
}

::v-deep .el-collapse-item__content {
  padding: 5px 10px;
}

::v-deep .el-collapse-item__wrap {
  border-bottom: 0;
}


.feedback-tip span {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 20px;
  color: rgba(40, 47, 54, 0.8);
  text-align: left;
  vertical-align: middle;
}

::v-deep .el-link__inner {
  margin-left: 5px;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 20px;
}

</style>
