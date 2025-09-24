<!-- image -->
<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  name?: string;
  src?: string;
  width?: string;
  height?: string;
  round?: boolean;
  radius?: string;
  fileType?: string;
  dir?: string;
}>();

const image = ref();
if (props.src) {
  image.value = props.src;
} else if (props.name && props.name.includes("http")) {
  image.value = props.name;
} else if (props.dir) {
  import(
    `@/assets/img/${props.dir}/${props.name}.${props.fileType || "png"}`
  ).then((module) => {
    image.value = module.default;
  });
} else {
  import(`@/assets/img/${props.name}.${props.fileType || "png"}`).then(
    (module) => {
      image.value = module.default;
    }
  );
}
</script>

<template>
  <van-image
    :src="image"
    :width="props.width"
    :height="props.height"
    :round="props.round"
    :radius="props.radius"
  >
    <template v-slot:loading>
      <van-loading type="spinner" size="20" />
    </template>
  </van-image>
</template>

<style scoped></style>
