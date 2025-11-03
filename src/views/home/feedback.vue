<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { feedbackSubmitApi } from "@/services/api";
import { showSuccessToast } from "vant";

const { t } = useI18n();
const router = useRouter();

// 表单数据
const formData = ref({
  subject: "",
  content: "",
});

// 按钮禁用状态
const submitDisabled = ref(true);

// 监听表单变化，控制按钮状态
watch(
  formData,
  (newVal) => {
    submitDisabled.value = !(newVal.subject.trim() && newVal.content.trim());
  },
  { deep: true }
);

// 提交反馈
const onSubmit = async () => {
  if (!formData.value.subject.trim()) {
    showToast(t("feedback.validation.subjectRequired"));
    return;
  }
  if (!formData.value.content.trim()) {
    showToast(t("feedback.validation.contentRequired"));
    return;
  }

  try {
    await feedbackSubmitApi(
      formData.value.subject.trim(),
      formData.value.content.trim()
    );
    showSuccessToast(t("feedback.submitSuccess"));
    // 清空表单
    formData.value = {
      subject: "",
      content: "",
    };
    // 延迟返回
    setTimeout(() => {
      router.back();
    }, 1500);
  } catch (error) {
    // 错误已在http拦截器中处理
  }
};
</script>

<template>
  <CpNavBar :title="t('feedback.title')"></CpNavBar>
  <div class="page">
    <div class="feedback-container">
      <!-- 提示文案 -->
      <div class="hint-text">{{ t("feedback.hint") }}</div>

      <!-- 主题输入框 -->
      <div class="input-section">
        <van-field
          v-model="formData.subject"
          type="text"
          maxlength="50"
          :placeholder="t('feedback.subjectPlaceholder')"
          show-word-limit
          class="subject-input"
        />
      </div>

      <!-- 内容输入框 -->
      <div class="input-section">
        <van-field
          v-model="formData.content"
          rows="8"
          autosize
          type="textarea"
          maxlength="500"
          :placeholder="t('feedback.contentPlaceholder')"
          show-word-limit
          class="content-input"
        />
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <van-button
          type="primary"
          block
          round
          :disabled="submitDisabled"
          @click="onSubmit"
          class="submit-btn"
        >
          {{ t("feedback.submit") }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #ffffff;
  padding-top: var(--van-nav-bar-height);
}

.feedback-container {
  padding: 1.5rem 1rem;
}

.hint-text {
  font-size: 1rem;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-weight: 500;
}

.input-section {
  margin-bottom: 1rem;
  background-color: #f7f8fa;
  border-radius: 0.5rem;
  overflow: hidden;

  :deep(.van-cell) {
    padding: 0.8rem 1rem;
    background-color: #f7f8fa;
    border-radius: 0.5rem;
  }

  :deep(.van-field__control) {
    font-size: 0.9rem;
    color: #333;
    line-height: 1.6;
  }

  :deep(.van-field__word-limit) {
    font-size: 0.75rem;
    color: #999;
  }
}

.content-input {
  :deep(.van-field__control) {
    min-height: 12rem;
  }
}

.submit-section {
  margin-top: 2rem;
  padding: 0 1rem;
}

.submit-btn {
  height: 3rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;

  &:disabled {
    background: #c8c9cc;
    opacity: 0.6;
  }
}
</style>
