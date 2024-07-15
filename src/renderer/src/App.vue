<script setup>
import Versions from './components/Versions.vue'
import ImageView from './components/ImageView.vue'
//const ipcHandle = () => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <!--  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
  </div>
  -->
  <div id="app">
    <header style="padding-left: 70px">
      <h1>Просмотр изображений (*.jpg, *.jpeg, *.gif, *.png и *.bmp)</h1>
    </header>
    <ImageView class="content"></ImageView>
    <!--    <div class="actions">
          <div class="action">
            <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
          </div>
          <div class="action">
            <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
          </div>
        </div>
        <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>-->
    <footer style="padding-left: 200px"><Versions /></footer>
  </div>
</template>

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
