<template>
  <div class="combo">
    <select @change="handleChange" v-model="selectedItem">
      <option v-for="item in items" :value="item">{{ item.text }}</option>
    </select>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  items: []
})

const items = computed(() => (props.items.length === 0) ? [{text: '*', value: 'all'}] : props.items)

const selectedItem = ref(items.value.length > 0 ? items.value[0] : {} )

const handleChange = (item) => {
  emit('selectionChanged', selectedItem.value)
}

const emit = defineEmits(['selectionChanged'])
</script>

<style scoped>
*.unselectable {
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;

  /*
    Introduced in Internet Explorer 10.
    See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
  */
  -ms-user-select: none;
  user-select: none;
}

.combo {
  width: 100%;
  height: 40px;
}

.combo > select {
  width: 100%;
  height: 100%;
  background: rgba(77,77,77,1);
  border: 1px solid rgba(99,99,99,1);
  color: #fff;
}

.combo > select:focus {
  border: inherit;
}

</style>
