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
    bounds_updatable: { type: Boolean, default: false },
    center: { type: Object, default: () => ({ lat: -16.5, lng: -68.15 }) }
  },
  data: () => ({
    map: null
  }),
  computed: {
    google: gmapApi
  },
  mounted() {
    this.$refs.map.$mapPromise.then(map => {
      this.map = map;
      this.fitBounds(this.bounds);
    });
  },
  watch: {
    bounds() {
      if (this.map && this.bounds_updatable) {
        this.fitBounds(this.bounds);
      }
    }
  },
  methods: {
    fitBounds(points) {
      if (points.length) {
        var bounds = new this.google.maps.LatLngBounds();
        points.forEach(point => {
          bounds.extend(point);
        });
        this.map.fitBounds(bounds);
      }
    }
  }
}
</script>

<style>

</style>