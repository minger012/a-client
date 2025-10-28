<!-- RichContent.vue -->
<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const route = useRoute();
const title = ref("");
const content = ref("");

onMounted(() => {
  title.value = route.query.title as string;
  content.value = route.query.content as string;
});
</script>

<template>
  <div class="rich-content-page">
    <CpNavBar :title="title" :isBack="true" />

    <div class="content-container">
      <div class="rich-content" v-html="content"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rich-content-page {
  margin-top: var(--van-nav-bar-height);
  min-height: 100vh;
  background: #fff;
}

.content-container {
  padding: 0.9615rem;
  margin-top: var(--van-nav-bar-height);
}

.rich-content {
  font-size: 0.9615rem;
  line-height: 1.6;
  color: #333;

  // 富文本内容样式
  :deep(p) {
    margin-bottom: 0.7212rem;
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.4808rem;
    margin: 0.4808rem 0;
  }

  :deep(ul, ol) {
    padding-left: 1.4423rem;
    margin-bottom: 0.7212rem;
  }

  :deep(li) {
    margin-bottom: 0.3606rem;
  }

  :deep(h1, h2, h3, h4, h5, h6) {
    margin: 0.9615rem 0 0.4808rem;
    font-weight: bold;
  }

  :deep(blockquote) {
    border-left: 4px solid #4e7cdc;
    padding-left: 0.7212rem;
    margin: 0.7212rem 0;
    color: #666;
    font-style: italic;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0.7212rem 0;

    th,
    td {
      border: 1px solid #e5e5e5;
      padding: 0.4808rem;
      text-align: left;
    }

    th {
      background: #f8f9fa;
      font-weight: bold;
    }
  }
}
</style>
