<script setup lang="ts">
import {
  realnameInfoApi,
  realnameSubmitApi,
  uploadRealnameImageApi,
} from "@/services/api";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showLoadingToast, showToast } from "vant";

const { t } = useI18n();
const router = useRouter();

// 表单数据
const realName = ref("");
const verifyType = ref<number>(1);
const frontImageUrl = ref("");
const frontImagePath = ref("");
const backImageUrl = ref("");
const backImagePath = ref("");

// 认证信息
const realnameData = ref<any>(null);
const isSubmitted = ref(false);
const pageLoading = ref(true);

// 认证类型选择器
const verifyTypeShowPicker = ref(false);
const verifyTypeColumns = [
  { text: t("realname.verifyTypes.passport"), value: 1 },
  { text: t("realname.verifyTypes.driverLicense"), value: 2 },
  { text: t("realname.verifyTypes.ssn"), value: 3 },
  { text: t("realname.verifyTypes.identityId"), value: 4 },
];
const verifyTypeOnConfirm = ({ selectedOptions }: any) => {
  verifyType.value = selectedOptions[0]?.value;
  verifyTypeShowPicker.value = false;
};

// 获取认证类型文本
const getVerifyTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    1: "realname.verifyTypes.passport",
    2: "realname.verifyTypes.driverLicense",
    3: "realname.verifyTypes.ssn",
    4: "realname.verifyTypes.identityId",
  };
  return typeMap[type] ? t(typeMap[type]) : "";
};

// 获取审核状态颜色
const getAuditStatusColor = (status: number) => {
  if (status === 0) return "#ff9800";
  if (status === 1) return "#4caf50";
  if (status === 2) return "#f44336";
  return "#666";
};

// 上传图片
const afterRead = async (file: any, type: "front" | "back") => {
  showLoadingToast({
    message: t("realname.uploading"),
    forbidClick: true,
    duration: 0,
  });

  const formData = new FormData();
  formData.append("image", file.file);

  try {
    const res = await uploadRealnameImageApi(formData);
    if (type === "front") {
      frontImageUrl.value = res.data.url;
      frontImagePath.value = res.data.path;
    } else {
      backImageUrl.value = res.data.url;
      backImagePath.value = res.data.path;
    }
    showToast(t("realname.uploadSuccess"));
  } catch (error) {
    showToast(t("realname.uploadFailed"));
  }
};

// 提交认证
const onSubmit = async () => {
  if (!realName.value) {
    showToast(t("realname.validation.nameRequired"));
    return;
  }
  if (!frontImagePath.value) {
    showToast(t("realname.validation.frontImageRequired"));
    return;
  }
  if (!backImagePath.value) {
    showToast(t("realname.validation.backImageRequired"));
    return;
  }

  showLoadingToast({
    message: t("common.loading"),
    forbidClick: true,
    duration: 0,
  });

  try {
    const res = await realnameSubmitApi({
      real_name: realName.value,
      verify_type: verifyType.value,
      front_image: frontImagePath.value,
      back_image: backImagePath.value,
    });
    showToast(res.msg);
    setTimeout(() => {
      router.back();
    }, 1000);
  } catch (error) {
    // 错误已在拦截器中处理
  }
};

// 获取认证信息
const getRealnameInfo = async () => {
  pageLoading.value = true;
  try {
    const res = await realnameInfoApi();
    if (res.data) {
      realnameData.value = res.data;
      isSubmitted.value = true;
      realName.value = res.data.real_name;
      verifyType.value = res.data.verify_type;
      frontImageUrl.value = res.data.front_image;
      backImageUrl.value = res.data.back_image;
      frontImagePath.value = res.data.front_image;
      backImagePath.value = res.data.back_image;
    }
  } catch (error) {
    // 错误已在拦截器中处理
  } finally {
    pageLoading.value = false;
  }
};

onMounted(() => {
  getRealnameInfo();
});
</script>

<template>
  <CpNavBar :title="t('realname.title')"></CpNavBar>
  <div class="page">
    <!-- 页面加载中 -->
    <van-loading v-if="pageLoading" class="page-loading" type="spinner" size="24px" vertical>
      {{ t("common.loading") }}
    </van-loading>

    <!-- 审核状态提示 -->
    <div v-else-if="isSubmitted" class="status-card">
      <div class="status-header">
        <span class="status-label">{{ t("realname.status") }}:</span>
        <span
          class="status-text"
          :style="{ color: getAuditStatusColor(realnameData?.status) }"
        >
          {{ t(`realname.statusText.${realnameData?.status}`) }}
        </span>
      </div>
      <div v-if="realnameData?.status === 2" class="reject-reason mt-3">
        <span class="reject-label">{{ t("realname.rejectReason") }}:</span>
        <span class="reject-text">{{ realnameData?.reject_reason }}</span>
      </div>
      <div v-if="realnameData?.status === 1" class="success-tip mt-3">
        {{ t("realname.approvedTip") }}
      </div>
    </div>

    <van-form @submit="onSubmit" v-if="!pageLoading && (!isSubmitted || realnameData?.status !== 1)">
      <!-- 真实姓名 -->
      <van-field
        v-model="realName"
        type="text"
        :label="t('realname.realName')"
        :placeholder="t('realname.pleaseEnterName')"
        :disabled="isSubmitted && realnameData?.status === 0"
      />

      <!-- 认证类型 -->
      <van-field
        :model-value="getVerifyTypeText(verifyType)"
        is-link
        readonly
        :label="t('realname.verifyType')"
        :placeholder="t('realname.pleaseSelect')"
        @click="verifyTypeShowPicker = true"
        :disabled="isSubmitted && realnameData?.status === 0"
      />
      <van-popup
        v-model:show="verifyTypeShowPicker"
        destroy-on-close
        position="bottom"
      >
        <van-picker
          :columns="verifyTypeColumns"
          @confirm="verifyTypeOnConfirm"
          @cancel="verifyTypeShowPicker = false"
        />
      </van-popup>

      <!-- 证件正面 -->
      <div class="upload-section">
        <div class="upload-label">{{ t("realname.frontImage") }}</div>
        <van-uploader
          :max-count="1"
          :after-read="(file: any) => afterRead(file, 'front')"
          :disabled="isSubmitted && realnameData?.status === 0"
        >
          <div v-if="!frontImageUrl" class="upload-placeholder">
            <van-icon name="photograph" size="40" />
            <div class="upload-text">{{ t("realname.uploadFront") }}</div>
          </div>
          <img v-else :src="frontImageUrl" class="upload-image" />
        </van-uploader>
      </div>

      <!-- 证件背面 -->
      <div class="upload-section">
        <div class="upload-label">{{ t("realname.backImage") }}</div>
        <van-uploader
          :max-count="1"
          :after-read="(file: any) => afterRead(file, 'back')"
          :disabled="isSubmitted && realnameData?.status === 0"
        >
          <div v-if="!backImageUrl" class="upload-placeholder">
            <van-icon name="photograph" size="40" />
            <div class="upload-text">{{ t("realname.uploadBack") }}</div>
          </div>
          <img v-else :src="backImageUrl" class="upload-image" />
        </van-uploader>
      </div>

      <!-- 提交按钮 -->
      <div class="mt-8 px-4" v-if="!isSubmitted || realnameData?.status === 2">
        <van-button round block type="primary" native-type="submit">
          <span class="text-base">{{ t("realname.submit") }}</span>
        </van-button>
      </div>
    </van-form>

    <!-- 温馨提示 -->
    <div class="tips-section">
      <div class="tips-title">{{ t("realname.tips.title") }}</div>
      <div class="tips-item">{{ t("realname.tips.tip1") }}</div>
      <div class="tips-item">{{ t("realname.tips.tip2") }}</div>
      <div class="tips-item">{{ t("realname.tips.tip3") }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding-top: var(--van-nav-bar-height);
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #969799;
}

.status-card {
  padding: 1.25rem;

  .status-header {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    border-radius: 0.5rem;

    .status-label {
      color: #666;
      margin-right: 0.5rem;
      font-weight: 500;
    }

    .status-text {
      font-weight: bold;
      font-size: 1.05rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;

      &::before {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
      }
    }
  }

  .reject-reason {
    padding: 1rem;
    background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
    border-radius: 0.5rem;
    border-left: 4px solid #f44336;
    font-size: 0.9rem;
    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.1);

    .reject-label {
      color: #f44336;
      font-weight: bold;
      margin-right: 0.5rem;
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .reject-text {
      color: #666;
      line-height: 1.6;
    }
  }

  .success-tip {
    padding: 1rem;
    background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%);
    border-radius: 0.5rem;
    border-left: 4px solid #4caf50;
    color: #2e7d32;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);

    &::before {
      content: "✓";
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #4caf50;
      color: white;
      border-radius: 50%;
      font-weight: bold;
      font-size: 14px;
      flex-shrink: 0;
    }
  }
}

.upload-section {
  padding: 1rem;
  background: white;
  margin-bottom: 0.5rem;

  .upload-label {
    font-size: 0.9rem;
    color: #323233;
    margin-bottom: 0.75rem;
  }

  .upload-placeholder {
    width: 9rem;
    height: 9rem;
    border: 2px dashed #ddd;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f9f9f9;

    .upload-text {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #999;
    }
  }

  .upload-image {
    width: 9rem;
    height: 9rem;
    object-fit: cover;
    border-radius: 0.5rem;
  }
}

.tips-section {
  padding: 1rem;
  background: white;

  .tips-title {
    font-size: 0.95rem;
    font-weight: bold;
    color: #323233;
    margin-bottom: 0.75rem;
  }

  .tips-item {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.6;
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;

    &::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #1989fa;
    }
  }
}

::v-deep() {
  .van-cell {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .van-uploader__wrapper {
    width: 100%;
  }

  .van-uploader__preview {
    width: 100%;
    margin: 0;
  }

  .van-uploader__preview-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
}
</style>
