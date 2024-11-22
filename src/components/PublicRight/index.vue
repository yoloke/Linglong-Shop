<template>
  <div class="right-container flx-column-align-center" @click="openBoard">
    <span>{{ $t('feedback.title') }}</span>
    <el-icon>
      <Edit />
    </el-icon>
  </div>

  <el-dialog class="question-board" v-model="questionDialogVisible" :title="$t('feedback.board.title')" width="50vw">
    <el-input
      class="question-search"
      :placeholder="$t('feedback.board.searchPlaceholder')"
      :suffix-icon="Search"
      v-model="questionSearchInput"
      @change="searchQuestionList"
    />

    <div
      class="question-list"
      v-infinite-scroll="moreQuestionList"
      :infinite-scroll-disabled="loadQuestionDisable"
      infinite-scroll-distance="10"
    >
      <el-collapse>
        <el-collapse-item v-for="(question, index) in questionList" :name="index" :key="index">
          <template #title>
            <el-text truncated>{{ $t('feedback.board.question') }}：{{ question.question }}</el-text>
          </template>

          <div>{{ $t('feedback.board.answer') }}：{{ question.reply }}</div>
        </el-collapse-item>
      </el-collapse>

      <p class="loading-tip" v-show="questionLoading" v-loading="questionLoading" element-loading-text></p>
      <el-divider class="no-more-tip" v-if="questionList.length > questionPageSize && noMoreQuestion"> The End </el-divider>

      <el-empty v-if="questionList.length === 0 && noMoreQuestion" :description="$t('feedback.board.empty')" />
    </div>

    <template #footer>
      <div class="feedback-tip">
        <span>{{ $t('feedback.board.notFound') }}</span>
        <el-link type="primary" @click="centerDialogVisible = true">{{ $t('feedback.board.feedback') }} →</el-link>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="centerDialogVisible" :title="$t('feedback.feedback.title')" width="55vw" style="margin-top: 30vh">
    <div style="margin-bottom: 12px">{{ $t('feedback.feedback.subtitle') }}</div>

    <el-input v-model="message" :rows="4" type="textarea" :placeholder="$t('feedback.feedback.placeholder')" show-word-limit maxlength="2400" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">{{ $t('feedback.feedback.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ $t('feedback.feedback.submit') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, h, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { CircleClose, Search } from "@element-plus/icons-vue"; // 引入自定义图标
import { addSuggest, getQuestionList } from "@/api/modules/project";
import { Question } from "@/api/interface";

const centerDialogVisible = ref(false);
const message = ref("");

// 答疑面板问题列表
const questionDialogVisible = ref(false);
const questionList = ref<Question[]>([]);
const questionLoading = ref(false);
const loadQuestionDisable = ref(false);
const questionSearchInput = ref("");
const questionPageNo = ref(1);
const questionPageSize = ref(10);
const noMoreQuestion = ref(false);
const existQuestion = ref(false);

const queryQuestionList = async () => {
  const { data: questions } = await getQuestionList({
    questionKeyWord: questionSearchInput.value,
    pageNo: questionPageNo.value,
    pageSize: questionPageSize.value
  });

  if (questions && questions?.length === questionPageSize.value) {
    questionPageNo.value += 1;
  } else {
    noMoreQuestion.value = true;
  }

  return questions;
};

const searchQuestionList = async () => {
  questionPageNo.value = 1;
  questionList.value = [];
  questionLoading.value = true;
  loadQuestionDisable.value = true;
  noMoreQuestion.value = false;

  try {
    const questions = await queryQuestionList();
    questionList.value = [...questions];
  } finally {
    questionLoading.value = false;
    loadQuestionDisable.value = false;
  }
};

const moreQuestionList = async () => {
  if (noMoreQuestion.value) {
    return;
  }

  questionLoading.value = true;
  loadQuestionDisable.value = true;

  try {
    const questions = await queryQuestionList();
    questionList.value.push(...questions);
  } finally {
    questionLoading.value = false;
    loadQuestionDisable.value = false;
  }
};

// 打开面板
const openBoard = () => {
  // 存在上架问题则展示答疑面板
  if (existQuestion.value) {
    questionDialogVisible.value = true;
  } else {
    // 不存在则直接打开反馈面板
    centerDialogVisible.value = true;
  }
};

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
    questionDialogVisible.value = false;
    ElMessage.success({
      message: "提交成功",
      type: "success"
    });
  } catch (error) {
    alert("提交时出现错误，请稍后重试");
  }
};

onMounted(async () => {
  try {
    const questions = await queryQuestionList();
    questionList.value = [...questions];
    if (questions.length) {
      existQuestion.value = true;
    }
  } finally {
  }
});
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

:deep(.el-collapse-item) {
  border: 1px solid rgba(229, 229, 229, 1);
  border-radius: 2px 2px;
  margin-top: 8px;
}

:deep(.el-collapse-item__header) {
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

:deep(.el-collapse-item__content) {
  padding: 5px 10px;
}

:deep(.el-collapse-item__wrap) {
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

:deep(.el-link__inner) {
  margin-left: 5px;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 20px;
}

.question-list {
  height: 45vh;
  overflow-y: auto;
}

:deep(.el-divider__text) {
  font-size: 10px;
  color: grey;
}

:deep(.el-loading-mask) {
  top: 5px;
  bottom: auto;
}

:deep(.el-collapse-item__header) {
  height: auto;
  padding-top: 15px;
  padding-bottom: 15px;
}

:deep(.el-collapse-item__header.is-active .el-text) {
  white-space: pre-wrap;
}

.loading-tip {
  height: 50px;
}
</style>
