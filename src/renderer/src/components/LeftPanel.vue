<template>
  <div class="left-panel-wrapper">
    <div class="action">
      <div class="path-value">{{ sourceCatalogPath }}</div>
      <div class="browse-btn" @click="getSourceDir">откуда</div>
    </div>
    <div class="action">
      <div class="path-value">{{ targetCatalogPath }}</div>
      <div class="browse-btn" @click="getTargetDir">куда</div>
    </div>
    <div class="combos">
      <SimpleSelect class="mark-combo" :items="marks" @selectionChanged="markChanged" />
      <SimpleSelect class="model-combo" :items="models" @selectionChanged="modelChanged" />
    </div>
    <div id="copy-btn" @click="copyFiles">Копировать</div>
    <ul id="output">
      <li v-for="image in images" :key="image" :class="['image-item', {'selected': selectedImage === image}]" @click="changeImage(image)">{{ image.name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import SimpleSelect from './SimpleSelect.vue'

const emit = defineEmits(['changeSource', 'changeTarget', 'changeImage', 'copyFiles'])
const images = ref([])
const sourceCatalogPath = ref('')
const targetCatalogPath = ref('')
const selectedImage = ref({})
const exiff = ref([])
const marks = ref([
  {text: 'все марки', value: 'all'},
  {text: 'марка 1', value: '1'},
  {text: 'марка 2', value: '2'},
])

const models = ref([
  {text: 'все модели', value: 'all'},
  {text: 'модель 1', value: '1'},
  {text: 'модель 2', value: '2'},

])

const getSourceDir = async () => {
  const getDir = await window.electron.ipcRenderer.invoke('getDir').catch((err) => {
    console.log(err)
  })
  const filePath = getDir.filePaths[0]
  sourceCatalogPath.value = filePath
  emit('changeSource', filePath)
  scanDir(filePath)
  getExif('D:\\ExampleElectron\\IMG_20180415_115550.jpg')
}

const getTargetDir = async () => {
  const getDir = await window.electron.ipcRenderer.invoke('getDir').catch((err) => {
    console.log(err)
  })
  const filePath = getDir.filePaths[0]
  targetCatalogPath.value = filePath
  emit('changeTarget', filePath)
}

const scanDir = (path) => {
  window.electron.ipcRenderer
    .invoke('dir', path)
    .then((filePaths) => {
      images.value = filePaths
      console.log(images)
    })
    .catch(console.error)
}

const getExif = (path) => {
  window.electron.ipcRenderer
    .invoke('exif', path)
    .then((filePaths) => {
      exiff.value.push(filePaths)
      console.log(exiff.value)
    })
    .catch(console.error)
}
const changeImage = (image) => {
  selectedImage.value = image
  emit('changeImage', image)
}

const markChanged = (item) => {
  console.log(item)
}

const modelChanged = (item) => {
  console.log(item)
}

const copyFiles = () => {
  emit('copyFiles')
}
</script>

<style scoped>
.left-panel-wrapper {
  width: 400px;
  height: 100%;
  background: rgba(110,110,110, 0.2);
  border-right: 1px solid rgba(120,120,120, 0.2);

  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: flex-start;
}

.action {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.action > .browse-btn, #copy-btn {
  padding: 2px 5px;
  background: rgba(77,77,77,1);
  border: 1px solid rgba(99,99,99,1);
  font-weight: bold;
  font-size: 14px;
  width: 110px;
  text-align: center;
  cursor: pointer;
}

.combos {
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  align-self: stretch;
  margin: 5px;
}

.combos div:first-child {
  margin-right: 3px;
}

.mark-combo, .model-combo {
  position: relative;
  overflow: hidden;
  overflow-y: visible;
  z-index: 10;
  flex-grow: 1;
}

#copy-btn {
  align-self: flex-end;
  margin-right: 10px;
}

.action > .path-value {
  padding: 2px 5px;
  background: rgba(77,77,77,1);
  border: 1px solid rgba(99,99,99,1);
  font-weight: bold;
  font-size: 14px;
  height: 100%;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  max-width: 180px;
  direction: rtl;
}

#output {
  border: 1px solid white;
  border-left: none;
  border-right: none;
  flex-grow: 1;
  width: 100%;
  height: 100px;
  overflow: auto;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  margin-top: 5px;
}

#output .image-item {
  cursor: pointer;
  padding: 0;
  margin: 1px 5px;
}

#output .image-item:hover, #output .image-item.selected {
  background: rgba(110,110,110, 0.4);
}

</style>
