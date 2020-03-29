<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="zoom"
    :style="{ width: width, height: height }"
    @click="event => $emit('click', event)"
  >
    <slot></slot>
  </GmapMap>
</template>

<script>
import {gmapApi} from 'vue2-google-maps'

export default {
  name: "BaseMap",
  props: {
    width: { type: String, default: "100%" },
    height: { type: String, default: "400px" },
    zoom: { type: Number, default: 10 },
    bounds: { type: Array, default: () => [] },
    center: { type: Object, default: () => ({lat: -16.5, lng: -68.15}) }
  },
  data: () => ({}),
  computed: {
    google: gmapApi
  },
  mounted() {
    if (this.bounds.length) {
      this.$refs.map.$mapPromise.then(map => {
        var bounds = new this.google.maps.LatLngBounds();
        this.bounds.forEach(point => {
          bounds.extend(point);
        });
        map.fitBounds(bounds);
      });
    }
  }
}
</script>

<style>

</style>