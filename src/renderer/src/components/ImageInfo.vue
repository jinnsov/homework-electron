<template>
  <div class="image-info-wrapper">
    <div class="prop-block" v-for="(imgProp, index) in imgProps"><span class="caption">{{imgProp.caption}}</span> <span class="value">{{imgProp.value}}</span></div>
  </div>
</template>

<script setup>

  import {computed} from "vue";

  const props = defineProps({
    info: []
  })

  const imgProps = computed(() => props.info)

</script>

<style scoped>
  .image-info-wrapper {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 200px;
    height: 300px;
    z-index: 1;
    background: rgba(110,110,110, 0.45);
    border-radius: 4px;
  }

  .prop-block {
    margin: 2px 5px;
  }

  .prop-block span {
    font-size: 14px;
    color: #fff;
  }

  .prop-block > .caption {
    font-weight: bold;
  }
  .prop-block > .value {}
</style>
