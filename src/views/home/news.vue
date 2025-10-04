<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
const id = route.query.id as unknown as number;
</script>
<template>
  <CpNavBar :isLogin="true" :is-lang="false"> </CpNavBar>
  <div class="page">
    <div class="content" v-if="id == 1">
      <p>
        The 7 Star is a dynamic media planning and buying agency that delivers
        tailored advertising solutions across multiple platforms. With a strong
        foundation in data-driven strategy and creative execution, we empower
        brands to maximize visibility, drive engagement, and achieve measurable
        growth.
      </p>
      <p>
        Our team works closely with clients to identify the most effective media
        channels — including TV, digital, radio, and out-of-home — ensuring each
        campaign is optimized for performance. Leveraging strategic partnerships
        and real-time analytics, Guerillascope helps businesses reach targeted
        audiences and generate meaningful results.
      </p>
      <p>
        Put simply, we provide end-to-end media services that enable brands to
        connect with consumers, expand market presence, and enhance return on
        investment through intelligent, integrated advertising.
      </p>
    </div>
    <div class="content" v-else-if="id == 2">
      <p>
        The reasons for not being able to deposit could be influenced by various
        factors. This includes your payment method, account status, or system
        issues. For example, your payment method might not be accepted, or there
        could be issues with your account preventing the deposit. If you
        encounter issues when trying to deposit, the best choice is to contact
        the service provider's customer support directly.
      </p>
    </div>
    <div class="content" v-else-if="id == 3">
      <p>
        The reasons for not being able to deposit could be influenced by various
        factors. This includes your payment method, account status, or system
        issues. For example, your payment method might not be accepted, or there
        could be issues with your account preventing the deposit. If you
        encounter issues when trying to deposit, the best choice is to contact
        the service provider's customer support directly.
      </p>
    </div>
    <div class="content" v-else-if="id == 4">
      <p>
        The duration of the The 7 Star Audience Network Partner program can vary
        depending on your specific goals and strategies. your specific timeline
        may vary depending on your ad settings and goals.For more information,
        contact online customer support.
      </p>
    </div>
    <div class="content" v-else-if="id == 5">
      <p>
        Of course, it is possible. As long as you meet The 7 Star requirements
        and comply with its policies, you can. The The 7 Star Partner program
        allows you to earn money by showing The 7 Star ads to users through your
        website or app. This is an option for you to earn money, but you must
        comply with The 7 Star advertising policies and terms.
      </p>
      <p><br /></p>
      <p>
        First, you need a The 7 Star account, and your website or app must meet
        The 7 Star quality standards and policies. Then, apply to join the The 7
        Star partnership. Once your application is approved, you can display ads
        and earn money.
      </p>
      <p><br /></p>
      <p>
        Please note that this activity requires time and effort. Earnings may
        vary due to various factors, including traffic, ad placements, and user
        behavior. If you have any questions, we recommend visiting the official
        website or contacting customer service for more information.
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  padding: 5.12821vw 4.10256vw;
  .content {
    font-size: 3.58974vw;
    line-height: 8.20513vw;
    word-break: break-all;
    color: #000000e0;
  }
}
</style>
