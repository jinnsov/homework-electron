<template>
  <p class="agreed">{{ isShow ? 'Загрузка...' : '' }}</p>
  <slot v-if="!isShow"></slot>
</template>

<script setup>
defineProps(['isShow'])
</script>

<style></style>
