<script setup>
import Versions from './components/Versions.vue'
import { ref } from 'vue'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')
const dir = ref([])
window.electron.ipcRenderer.on('files', (_, files) => {
  dir.value = files
})
const scanDir = () => {
  window.electron.ipcRenderer
    .invoke('dir', './build')
    .then((files) => (dir.value = files))
    .catch(console.error)
}
window.electron.ipcRenderer.send('watch', './build')
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
      <button type="submit" @click="scanDir">Файлы</button>
    </div>
    <ul>
      <li v-for="files in dir" :key="files">{{ files }}</li>
    </ul>
  </div>
  <Versions />
</template>
