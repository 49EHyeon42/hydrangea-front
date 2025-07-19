<script setup lang="ts">
defineProps<{
  nickname: string;
  content: string;
}>();
</script>

<template>
  <div class="ma-1" style="overflow-wrap: break-word; word-break: break-word">
    <span class="mr-1">{{ nickname }}</span>
    <span>{{ content }}</span>
  </div>
</template>

<style scoped></style>
