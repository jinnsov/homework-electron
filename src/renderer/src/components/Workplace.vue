<template>
  <div id="workplace">
    <LeftPanel class="left-panel"
               @changeSource="onSourcePathChange"
               @changeTarget="onTargetPathChange"
               @copyFiles = "onCopyFilesClick"
               @changeImage = "onImageChange"
    />
    <div class="canvas">
      <div class="image-preview">
        <img v-if="imgBase64 !== ''" class="image-content" :src="imgBase64" />
        <div v-else>
          <img alt="no image" class="img_class logo" src="./../assets/electron.svg" />
        </div>
      </div>
      <ImageInfo class="image-info" :info="fileInfo" />
    </div>
  </div>
</template>

<script setup>
  import LeftPanel from "./LeftPanel.vue";
  import ImageInfo from "./ImageInfo.vue";
  import {onMounted, ref} from "vue";

  const imgBase64 = ref('')
  const isLoad = ref(false)
  const fileName = ref('')
  const sourceCatalogPath = ref('')
  const targetCatalogPath = ref('')

  const fileInfo = ref([])

  onMounted(() => {

  })

  const onSourcePathChange = (path) => {
    sourceCatalogPath.value = path
    console.log('source path changed', path)
  }

  const onTargetPathChange = (path) => {
    targetCatalogPath.value = path
    console.log('target path changed', path)
  }

  const onImageChange = (image) => {
    const fullPath = `${image.path}/${image.name}`
    getImage(fullPath)
    getFileInfo(fullPath, image)
  }

  const onCopyFilesClick = () => {
    console.log('copy clicked')
  }

  const getImage = async (selectedFileName) => {
    isLoad.value = true
    fileName.value = selectedFileName
    await window.electron.ipcRenderer
      .invoke('getFile', selectedFileName)
      .then((base64) => (imgBase64.value = `data:image/jpg;base64,${base64}`))
      .catch(console.error)
    isLoad.value = false
  }

  const getFileInfo = async (fullPath, image) => {
    const stat = await window.electron.ipcRenderer.invoke('getFileStat', fullPath).catch((err) => {
      console.log(err)
    })
    console.log(stat)
    fileInfo.value = (stat === undefined) ? [] : [
      { caption: 'файл:', value: image.name },
      { caption: 'размер:', value: humanFileSize(stat['size']) },
      { caption: 'дата обращения:', value: new Date(stat['atimeMs']).toLocaleString() },
      { caption: 'дата создания:', value: new Date(stat['birthtimeMs']).toLocaleString() },
      { caption: 'дата модификации:', value: new Date(stat['mtimeMs']).toLocaleString() },
      { caption: 'дата изменения:', value: new Date(stat['ctimeMs']).toLocaleString() }
    ]
  }

  const humanFileSize = (size) => {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
    return `${+(size / Math.pow(1024, i)).toFixed(2)} ${['Б', 'кБ', 'МБ', 'ГБ', 'ТБ'][i]}`
  }

</script>

<style scoped>
  #workplace {
    border: 1px solid rgba(180,180,180, 0.3);
    flex-grow: 1;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: flex-start;
  }

  .left-panel {

  }

  .canvas {
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
  }

  .image-preview {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .image-info {

  }

  .image-content {
    max-width: 95%;
    max-height: 95%;
  }
</style>
