<script lang="ts" setup>
const props = defineProps<{
  name: string;
  color?: string;
}>();

const href = "#icon-" + props.name;
</script>

<template>
  <svg
    aria-hidden="true"
    class="svg-icon icon"
    :class="$attrs.class"
    :style="{ color: props.color }"
  >
    <use :href="href" :fill="props.color"></use>
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  width: 4vw;
  height: 4vw;
}

/* 确保 SVG 图标能够继承外部样式 */
.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
