<script lang="ts" setup>
import { registerApi } from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  usernameRules,
  passwordRules,
  mobileRules,
  codeRules,
} from "@/utils/rules";
const userStore = useUserStore();
const router = useRouter();
const username = ref("");
const password = ref("");
const repassword = ref("");
const mobile = ref("");
const code = ref("");
const checked = ref(false);
const onSubmit = async () => {
  if (!checked.value) {
    showToast("请勾选同意服务条款");
    return;
  }
  showLoadingToast({
    message: "loading...",
    forbidClick: true,
    duration: -1,
  });
  await registerApi({
    username: username.value,
    password: password.value,
    repassword: repassword.value,
    mobile: mobile.value,
    code: code.value,
  }).then((res) => {
    userStore.setUser(res.data);
    router.push("/");
    closeToast();
  });
};

// 服务条款
const showBottom = ref(false);
</script>
<template>
  <!-- 导航 -->
  <CpNavBar title="" :isBack="false" :isLogin="true"> </CpNavBar>
  <div class="page">
    <div class="flex flex-col justify-center items-center">
      <div class="flex justify-center mt-16">
        <CpImage name="logo-C8lBymrN" width="10rem" height="7.75rem"></CpImage>
      </div>
      <div class="text-[1.75rem] font-bold mt-6">创建新账号</div>
      <div class="text-base text-gray-500 mt-3">注册新账号以开始使用</div>
    </div>
    <div class="mt-8">
      <!-- 表单 -->
      <van-form required="auto">
        <van-cell-group inset>
          <van-field
            v-model="username"
            left-icon="user-o"
            placeholder="请输入用户名"
            :rules="usernameRules"
          />
          <van-field
            type="password"
            v-model="password"
            left-icon="shield-o"
            placeholder="请输入密码"
            :rules="passwordRules"
          />
          <van-field
            type="password"
            v-model="repassword"
            left-icon="shield-o"
            placeholder="请确认密码"
            :rules="passwordRules"
          />
          <van-field
            v-model="mobile"
            left-icon="phone-o"
            placeholder="请输入手机号码"
            :rules="mobileRules"
          />
          <van-field
            v-model="code"
            left-icon="label-o"
            placeholder="授权码"
            :rules="codeRules"
          />
        </van-cell-group>
        <div class="flex items-center px-5 pt-3">
          <van-checkbox v-model="checked" shape="square" icon-size="15px" />
          <div class="ml-2">
            我已阅读并同意<span class="text-primary" @click="showBottom = true"
              >服务条款</span
            >
          </div>
        </div>
        <div class="pt-6">
          <van-button
            native-type="submit"
            block
            round
            type="primary"
            @click="onSubmit()"
          >
            <span class="font-[600] text-base">注册</span>
          </van-button>
        </div>
      </van-form>
      <div
        class="flex justify-center items-center mt-12 text-primary text-[15px] pb-4"
        @click="$router.push('login')"
      >
        已有账号？ 登录
      </div>
    </div>
  </div>
  <van-popup
    v-model:show="showBottom"
    round
    position="bottom"
    :style="{ height: '90%' }"
  >
    <h1 class="flex justify-center my-3 text-2xl font-bold">服务条款</h1>
    <div class="p-3">
      <div class="content privacy-policy-content">
        <p><strong>Registration Terms for Whitespidermedia</strong></p>
        <p><br /></p>
        <p><strong>1. Welcome Statement</strong></p>
        <p><br /></p>
        <p>Welcome to Whitespidermedia and its services.</p>
        <p><br /></p>
        <p><strong>2. Purpose and Agreement Acceptance</strong></p>
        <p><br /></p>
        <p>
          To ensure the security of this website and its advertisers
          (“Advertising Placement Services”), please carefully read the
          following Advertising Placement License Agreement. By proceeding, you
          confirm that you fully understand the terms, restrictions,
          supplementary provisions, and related responsibilities outlined
          herein. If you are at least 18 years old, becoming a registered user
          of this website signifies that you have read, understood, and agreed
          to these terms. If you are under 18 years of age, you are not
          authorized to register or use the services. No formal employee may
          invite underage workers to join this job. Once discovered, the right
          to continue this part-time job will be directly deprived.
        </p>
        <p><br /></p>
        <p><strong>3. Advertising Placement Rules</strong></p>
        <p><br /></p>
        <p>
          Users must ensure that all posted content complies with applicable
          national laws and regulations, and must not contain any false,
          infringing, illegal, or otherwise inappropriate content. Advertising
          materials must be truthful, accurate, and free from any form of
          fraudulent promotion. Users shall also control the frequency and scope
          of advertisements to avoid disrupting network order or negatively
          impacting other users’ experience. The platform reserves the right to
          review, modify, or remove advertisements that do not meet these
          requirements. Serious violators may have their account privileges
          suspended or permanently terminated.
        </p>
        <p><br /></p>
        <p><strong>4. Privacy and Account Security</strong></p>
        <p><br /></p>
        <p>
          Upon registration, a user’s account and personal information are
          protected under applicable laws. The platform strictly complies with
          relevant national and international regulations to safeguard user
          privacy and data security. To ensure account security and prevent
          fraudulent activities, any modification of personal information will
          require users to complete real-name verification (KYC) to confirm
          identity and enhance account security.
        </p>
        <p><br /></p>
        <p><strong>5. Anti-Money Laundering (AML) Compliance</strong></p>
        <p><br /></p>
        <p>
          The platform strictly adheres to international Anti-Money Laundering
          (AML) laws and related policies. Users must cooperate by providing
          necessary identity verification and transaction details during
          registration and use. The platform monitors and investigates
          suspicious activity to ensure that all transactions are legal and
          compliant. If a user’s transaction volume exceeds the threshold for
          comprehensive review under applicable regulations, the platform may
          require proof of funds equal to 100% of the account balance to verify
          the legitimacy and compliance of those funds.
        </p>
        <p><br /></p>
        <p><strong>6. Platform Service Commitment</strong></p>
        <p><br /></p>
        <p>
          The platform is committed to providing stable, efficient, and secure
          advertising services. We continually optimize system performance to
          ensure timely and accurate ad publication, improve ad exposure, and
          increase conversion rates. In the event of system maintenance or force
          majeure, the platform will promptly notify users and make every effort
          to minimize impact.
        </p>
        <p><br /></p>
        <p><strong>7. User Rights and Obligations</strong></p>
        <p><br /></p>
        <p>
          Users are entitled to utilize the services provided by the platform
          but must strictly comply with this agreement and all applicable laws
          and regulations. Users are responsible for safeguarding their account
          credentials to prevent unauthorized access. Any account anomalies or
          security concerns must be reported to the platform immediately. Users
          shall not engage in illegal or non-compliant activities using the
          platform. Violations may result in warnings, feature restrictions,
          suspension, or permanent account termination.
        </p>
        <p><br /></p>
        <p><strong>8. Technology and Security Safeguards</strong></p>
        <p><br /></p>
        <p>
          The platform employs advanced encryption technologies to secure user
          data and transactions, and conducts regular security audits and risk
          assessments. Security measures include, but are not limited to,
          identity authentication, data encryption, access control, and
          suspicious activity monitoring. These safeguards protect user assets
          and privacy from unauthorized access or infringement.
        </p>
        <p><br /></p>
        <p><strong>9. Dispute Resolution and Governing Law</strong></p>
        <p><br /></p>
        <p>
          1.The platform conducts settlements with advertisers at the end of
          each month. For orders that have not been settled or advertising tasks
          that are incomplete, advertisers have the right to impose penalties on
          the corresponding account funds.
        </p>
        <p><br /></p>
        <p>
          2.If a user fails to complete withdrawals within the specified time,
          advertisers have the right to file a claim. Once the system detects a
          claim, the user’s account data will be automatically cleared,
          including completed ad records and any pending withdrawal funds.
        </p>
        <p><br /></p>
        <p>
          3.Any resulting financial loss will be borne by the user, and the
          platform will not provide compensation. To avoid risks, please ensure
          that settlements and withdrawals are completed within the specified
          time.
        </p>
        <p><br /></p>
        <p>
          4.Any disputes arising from or in connection with this agreement shall
          be resolved through friendly negotiation. If such negotiation fails,
          either party may bring an action before the competent court at the
          platform’s place of registration. The platform reserves the right to
          interpret this agreement and to amend its terms at any time in
          accordance with legal requirements, regulatory changes, and
          operational needs. All amendments shall take effect upon publication.
        </p>
      </div>
      <!---->
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 20px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 53.33333vw;
    background: linear-gradient(45deg, #1877f21a, #1877f20d);
    clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
    z-index: 0;
  }
  ::v-deep() {
    .van-field {
      padding: 3.2vw 4.26667vw;
      transition: all 0.3s ease;
      &:hover {
        background-color: #1877f20d;
      }
      &:focus-within .van-field__left-icon {
        transform: scale(1.1);
      }
      .van-field__left-icon {
        color: #1877f2;
        font-size: 5.33333vw;
        margin-right: 3.2vw;
        transition: transform 0.3s ease;
      }
    }
    .van-button--primary {
      height: 3rem;
    }
  }
}
</style>
