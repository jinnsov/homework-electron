<template>
  <form enctype="multipart/form-data">
    <span>
      <input type="file" @change="fileC($event)" />
      <img alt="logo" class="logo" src="." height="512" width="512" />
      <img alt="logo" class="logo" :src="file" height="512" width="512" />
    </span>
  </form>
  <div class="actions">
    <button type="submit" @click="scanDir">Файлы</button>
  </div>
  <ul>
    <li v-for="files in dir" :key="files">{{ files }}</li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
const file = ref('')
const dir = ref([])
window.electron.ipcRenderer.on('files', (_, files) => {
  dir.value = files
  console.log(dir.value)
})

const img = () => {
  window.electron.ipcRenderer
    .invoke('dir', './build')
    .then((files) => (dir.value = files))
    .catch(console.error)
}
const scanDir = () => {
  window.electron.ipcRenderer
    .invoke('dir', './build')
    .then((files) => (dir.value = files))
    .catch(console.error)
}

const fileC = (event) => {
  file.value = event.target.files[0].path
  console.log('file:', file.value)
}

window.electron.ipcRenderer.send('watch', './build')

// trigger file prompt
window.electron.ipcRenderer.send('chooseFile')

// handle response
window.electron.ipcRenderer.on('chosenFile', (event, base64) => {
  const src = `data:image/jpg;base64,${base64}`
  console.log(src)
  file.value = src
})

</script>

<style scoped>

</style>
