<script setup>
import Versions from './components/Versions.vue'
import {ref} from "vue";

const ipcHandle = () => window.electron.ipcRenderer.send('ping')
const scanDir = ref([])
function dir() {
  window.electron.ipcRenderer
    .invoke('dir', '.')
    .then((files) => (scanDir.value = files))
    .catch(console.error)
}
</script>

<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
    <div>
      <button type="submit" @click="dir">Файлы</button>
    </div>
    <ul>
      <li v-for="files in scanDir" :key="files">{{ files }}</li>
    </ul>
  </div>
  <Versions />
</template>
