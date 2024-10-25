<template>
  <svg :class="className" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface SvgProps {
  name: string; // 图标的名称 ==> 必传
  prefix?: string; // 图标的前缀 ==> 非必传（默认为"icon"）
  className?: string; // 图标的类名 ==> 非必传
}

const props = withDefaults(defineProps<SvgProps>(), {
  prefix: "icon",
  className: "default-icon" // 默认使用 "default-icon" 类名
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
