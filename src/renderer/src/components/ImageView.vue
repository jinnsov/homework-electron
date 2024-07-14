<template>
  <div class="wrapper1">
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="getDir">Выбор каталога</a>
      {{ catalogPath }}
    </div>
    <ul>
      <li v-for="files in fileList" :key="files" @click="imgView(files)">{{ files }}</li>
    </ul>
  </div>
  <div class="wrapper2">
    <div v-if="imgBase64.length > 0">
      <Loading :is-show="isLoad">
        <img alt="image" class="logo" :src="imgBase64" />
        <pre>
          {{ 'файл: ' + fileName }}
          {{ 'размер: ' + humanFileSize(fileStat.size) }}
          {{ 'дата обращения: ' + new Date(fileStat.atimeMs).toLocaleString() }}
          {{ 'дата создания: ' + new Date(fileStat.birthtimeMs).toLocaleString() }}
          {{ 'дата модификации прав доступа или владельца : ' + new Date(fileStat.ctimeMs).toLocaleString() }}
          {{ 'дата изменения содержимого: ' + new Date(fileStat.mtimeMs).toLocaleString() }}
        </pre>
      </Loading>
    </div>
    <div v-else>
      <img alt="no image" class="img_class logo" src="./../assets/electron.svg" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from 'vue'
import Loading from './Loading.vue'
const fileList = ref([])
const catalogPath = ref('')
const imgBase64 = ref('')
const fileName = ref('')
const isLoad = ref(false)
const fileStat = reactive({ size: 0, atimeMs: 0.0, birthtimeMs: 0.0, ctimeMs: 0.0, mtimeMs: 0.0 })
const scanDir = () => {
  window.electron.ipcRenderer
    .invoke('dir', catalogPath.value)
    .then((files) => (fileList.value = files))
    .catch(console.error)
}

const imgView = async (selectedFileName) => {
  isLoad.value = true
  fileName.value = selectedFileName
  await window.electron.ipcRenderer
    .invoke('getFile', catalogPath.value + selectedFileName)
    .then((base64) => (imgBase64.value = `data:image/jpg;base64,${base64}`))
    .catch(console.error)
  isLoad.value = false
  await getFileStat(catalogPath.value + selectedFileName)
}
const getDir = async () => {
  imgBase64.value = ''
  const getDir = await window.electron.ipcRenderer.invoke('getDir').catch((err) => {
    console.log(err)
  })
  const filePath = getDir.filePaths[0]
  catalogPath.value = filePath.endsWith('\\') ? filePath : filePath + '\\'
  await scanDir()
}
const getFileStat = async (file) => {
  const getStat = await window.electron.ipcRenderer.invoke('getFileStat', file).catch((err) => {
    console.log(err)
  })
  const stat = await getStat
  fileStat.atimeMs = stat['atimeMs']
  fileStat.birthtimeMs = stat['birthtimeMs']
  fileStat.ctimeMs = stat['ctimeMs']
  fileStat.mtimeMs = stat['mtimeMs']
  fileStat.size = stat['size']
}
watch(catalogPath, () => {
  console.log(catalogPath.value)
  window.electron.ipcRenderer.send('watch', catalogPath.value)
})
window.electron.ipcRenderer.on('files', (_, files) => {
  fileList.value = files
})
function humanFileSize(size) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return `${+(size / Math.pow(1024, i)).toFixed(2)} ${['Б', 'кБ', 'МБ', 'ГБ', 'ТБ'][i]}`
}
onMounted(() => {
  // imgView('./resources/icon.png')
})
</script>

<style scoped>
/*img {
  background-image: url('./../assets/electron.svg');
  width: 400px;
}*/
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
.logo {
  -webkit-user-drag: none;
  /*height: 300px;
  width: 400px;*/
  max-height: 350px;
  object-fit: Contain;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 1.2em #6988e6aa);
}
</style>
