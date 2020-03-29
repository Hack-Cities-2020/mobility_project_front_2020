<template>
  <GmapMap
    :center="center"
    :zoom="zoom"
    :style="{ width: width, height: height }"
    @click="event => $emit('click', event)"
  >
    <slot></slot>
  </GmapMap>
</template>

<script>
export default {
  name: "BaseMap",
  props: {
    width: { type: String, default: "100%" },
    height: { type: String, default: "500px" },
    zoom: { type: Number, default: 10 },
    center: { type: Object, default: () => ({lat: -16.6143771, lng: -64.1916404}) }
  },
  data: () => ({}),
}
</script>

<style>

</style>