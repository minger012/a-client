<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    name: string;
    size?: string;
    color?: string;
  }>(),
  {
    size: () => "4vw",
    color: () => "#333",
  }
);

const href = "#icon-" + props.name;
</script>

<template>
  <svg
    aria-hidden="true"
    class="svg-icon icon"
    :style="{ width: props.size, height: props.size, color: props.color }"
  >
    <use :href="href" fill="#333"></use>
  </svg>
</template>

<style scoped></style>
