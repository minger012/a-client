<script setup lang="ts"></script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page">
    <div class="content">
      <p>Salary Payment Plan (Settled Three Times Per Month):</p>
      <p>Complete a total of 3 working days: Receive USD 150</p>
      <p>Complete a total of 12 working days: Receive USD 600</p>
      <p>Complete a total of 30 working days: Receive USD 1,500</p>
      <p>
        If 30 working days are completed in a month, the total basic monthly
        salary will be USD 2,250
      </p>
      <p>Working Day Calculation Rule:</p>
      <p>
        Users must complete at least 3 groups of advertising per day to count as
        1 working day
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
