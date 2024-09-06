<template>
  <div id="app">
    <header style="padding-left: 30px">
      <h1>Поиск и копирование изображений (*.jpg, *.jpeg) по Exif</h1>
    </header>
    <Workplace />
    <footer><Versions /></footer>
  </div>
</template>

<script setup>
import Versions from './components/Versions.vue'
import Workplace from './components/Workplace.vue'
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: self-start;
}

.content {
  width: 100%;
  margin-top: 15px;
}
</style>
