<template>
  <div class="wrapper1">
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="getDir">Выбор каталога</a>
      {{ dirC }}
    </div>
    <ul>
      <li v-for="files in dir" :key="files" @click="imgView(files)">{{ files }}</li>
    </ul>
  </div>
  <div class="wrapper2">
    <img alt="logo" class="img_class logo" :src="file" height="128" width="128" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
const dir = ref([])
const dirC = ref('')
const file = ref('')
const scanDir = () => {
  window.electron.ipcRenderer
    .invoke('dir', dirC.value)
    .then((files) => (dir.value = files))
    .catch(console.error)
}

const imgView = (fileName) => {
  window.electron.ipcRenderer
    .invoke('getFile', dirC.value + fileName)
    .then((base64) => (file.value = `data:image/jpg;base64,${base64}`))
    .catch(console.error)
}
const getDir = async () => {
  const getDir = await window.electron.ipcRenderer.invoke('getDir').catch((err) => {
    console.log(err)
  })
  const filePath = getDir.filePaths[0]
  dirC.value = filePath.endsWith('\\') ? filePath : filePath + '\\'
  await scanDir()
}
watch(dir, () => {
  console.log(dirC.value)
  window.electron.ipcRenderer.send('watch', dirC.value)
})
window.electron.ipcRenderer.on('files', (_, files) => {
  dir.value = files
})
onMounted(() => {
  imgView('./resources/icon.png')
})
</script>

<style scoped>
li {
  cursor: pointer;
  border: #42d392;
}
li:hover {
  color: palegoldenrod;
}
body {
  max-width: 1170px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
}
.wrapper1 {
  height: 10px;
  width: 800px;
  max-width: 100%;
  padding: 10px;
}
.wrapper2 {
  height: 400px;
  width: 10px;
  max-width: 100%;
  padding: 30px;
}
</style>
