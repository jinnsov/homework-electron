<template>
  <div class="action">
    <a target="_blank" rel="noreferrer" @click="getDir">Выбор каталога</a>
    {{ catalogPath }}
  </div>
  <div class="image-view">
    <div class="left-block">
      <ul id="output">
        <li v-for="file in fileList" :key="file" @click="imgView(file)">{{ file }}</li>
      </ul>
    </div>
    <div class="right-block">
      <div v-if="imgBase64.length > 0">
        <Loading :is-show="isLoad">
          <div class="image-block">
            <div class="image-canvas">
              <img alt="image" class="logo" :src="imgBase64" />
            </div>
            <div class="image-info">
              <p style="background-color: #515c67; padding: 10px">
                <span class="caption">файл: </span><span>{{ fileName }}</span
                ><br />
                <span class="caption">размер: </span><span>{{ humanFileSize(fileStat.size) }}</span
                ><br />
                <span class="caption">дата обращения: </span
                ><span>{{ new Date(fileStat.atimeMs).toLocaleString() }}</span
                ><br />
                <span class="caption">дата создания: </span
                ><span>{{ new Date(fileStat.birthtimeMs).toLocaleString() }}</span
                ><br />
                <span class="caption">дата модификации прав владельца: </span
                ><span>{{ new Date(fileStat.ctimeMs).toLocaleString() }}</span
                ><br />
                <span class="caption">дата изменения содержимого: </span
                ><span>{{ new Date(fileStat.mtimeMs).toLocaleString() }}</span>
              </p>
            </div>
          </div>
        </Loading>
      </div>
      <div v-else>
        <img alt="no image" class="img_class logo" src="./../assets/electron.svg" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch, reactive, computed} from 'vue'
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
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
  return `${+(size / Math.pow(1024, i)).toFixed(2)} ${['Б', 'кБ', 'МБ', 'ГБ', 'ТБ'][i]}`
}
onMounted(() => {
  // imgView('./resources/icon.png')
})
</script>

<style scoped>
.image-view {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
}

.image-view:first-child {
  margin-left: 20px;
}

.image-view:last-child {
  margin-right: 20px;
}

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
.left-block {
  width: 600px;
  max-width: 300px;
}

.right-block {
  width: 100%;
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
#output {
  overflow: scroll;
  overflow-y: auto;
  overflow-x: auto;
  padding: 15px 5px 5px;
  width: 100%;
  height: 500px;
  white-space: pre;
  box-shadow: inset 0 0 6px rgba(166, 44, 44, 0.3);
  scrollbar-width: thin;
  scrollbar-color: #151414 #d9d6ce;
}

.image-block {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
.image-canvas {
}
.image-info {
}

.image-info span {
  color: #f0f0f0;
}

.image-info .caption {
  color: #b0b0b0;
  font-size: 14px;
}

.action {
  white-space: nowrap;
}
</style>
