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
      <SimpleSelect class="mark-combo" :items="marks" @selection-changed="markChanged" />
      <SimpleSelect class="model-combo" :items="models" @selection-changed="modelChanged" />
    </div>
    <div id="copy-btn" @click="copyFiles">{{ copyBtnCaption }}</div>
    <ul id="output">
      <li
        v-for="image in filteredImages"
        :key="image"
        :class="['image-item', { selected: selectedImage === image }]"
        @click="changeImage(image)"
      >
        {{ image.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SimpleSelect from './SimpleSelect.vue'

const emit = defineEmits(['changeSource', 'changeTarget', 'changeImage', 'copyFiles'])
const images = ref([])
const sourceCatalogPath = ref('')
const targetCatalogPath = ref('')
const selectedImage = ref({})
const marks = ref(['все марки'])
const copyBtnCaption = ref('Копировать')

const models = ref(['все модели'])

const selectedMark = ref(undefined)
const selectedModel = ref(undefined)

const getSourceDir = async () => {
  const getDir = await window.electron.ipcRenderer.invoke('getDir').catch((err) => {
    console.log(err)
  })
  const filePath = getDir.filePaths[0]
  sourceCatalogPath.value = filePath
  emit('changeSource', filePath)
  scanDir(filePath)
}

const filteredImages = computed(() => {
  let result = images.value

  if (selectedMark.value !== undefined && selectedMark.value !== 'все марки') {
    result = result.filter((image) => image.make === selectedMark.value)
  }

  if (selectedModel.value !== undefined && selectedModel.value !== 'все модели') {
    result = result.filter((image) => image.model === selectedModel.value)
  }

  return result
})

const getTargetDir = async () => {
  const getDir = await window.electron.ipcRenderer.invoke('getDir').catch((err) => {
    console.log(err)
  })
  const filePath = getDir.filePaths[0]
  targetCatalogPath.value = filePath
  emit('changeTarget', filePath)
}

const scanDir = async (path) => {
  images.value = []
  marks.value = new Set(['все марки'])
  models.value = new Set(['все модели'])

  window.electron.ipcRenderer
    .invoke('dir', path)
    .then((filePaths) => {
      return filePaths.map((f) => {
        return { path: f.path, name: f.name }
      })
    })
    .then((files) => {
      for (let file of files) {
        getExif(file).then((info) => {
          file.make = info.make.replace(/\0/g, '')
          file.model = info.model.replace(/\0/g, '')
          images.value.push(file)
          marks.value.add(file.make)
          models.value.add(file.model)
        })
      } /*
      images.value = filePaths.map(async (f) => {
        const info = await getExif(f)
        return { path: f.path, name: f.name, make: info.make, model: f.model }
      })
      marks.value = images.value.map((f) => ({ text: f.make, value: f.make }))
      models.value = images.value.map((f) => ({ text: f.model, value: f.model }))
      */
    })
    .catch(console.error)
  // for (let file of images.value) {
  //   getExif(file)
  // }
  console.log('images.value ->> ', images.value)
}

const getExif = async (file) => {
  const exifData = await window.electron.ipcRenderer.invoke('exif', file.path + '\\' + file.name)

  return exifData
}
const changeImage = (image) => {
  selectedImage.value = image
  emit('changeImage', image)
}

const markChanged = (item) => {
  console.log(item)
  selectedMark.value = item
}

const modelChanged = (item) => {
  console.log(item)
  selectedModel.value = item
}
const copyFiles = async () => {
  copyBtnCaption.value = 'Копирую'
  emit('copyFiles')
  console.log('copyFiles')
  const files = [...filteredImages.value.map((images) => images.name)]
  const source = sourceCatalogPath.value
  const distance = targetCatalogPath.value
  const copy = await window.electron.ipcRenderer
    .invoke('copyFiles', files, source, distance)
    .then(() => {
      copyBtnCaption.value = 'Готово'
      setTimeout(() => {
        copyBtnCaption.value = 'Копировать'
      }, 500)
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>

<style scoped>
.left-panel-wrapper {
  width: 400px;
  height: 100%;
  background: rgba(110, 110, 110, 0.2);
  border-right: 1px solid rgba(120, 120, 120, 0.2);

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

.action > .browse-btn,
#copy-btn {
  padding: 2px 5px;
  background: rgba(77, 77, 77, 1);
  border: 1px solid rgba(99, 99, 99, 1);
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

.mark-combo,
.model-combo {
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
  background: rgba(77, 77, 77, 1);
  border: 1px solid rgba(99, 99, 99, 1);
  font-weight: bold;
  font-size: 14px;
  height: 100%;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  max-width: 180px;
  direction: ltr;
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

#output .image-item:hover,
#output .image-item.selected {
  background: rgba(110, 110, 110, 0.4);
}
</style>
