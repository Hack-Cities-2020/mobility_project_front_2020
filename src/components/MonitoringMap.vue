<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="zoom"
    :style="{ width: width, height: height }"
    @click="event => $emit('click', event)"
  >
    <template v-for="(route, i) in routes">
      <!-- polyline -->
      <GmapPolyline
        :key="`p-${i}`"
        :path.sync="route.path"
        :options="{ strokeColor: route.path_color, strokeWeight: line_weight }"
      ></GmapPolyline>
      <GmapMarker
        :key="`sp-${i}`"
        v-if="route.path.length"
        :position="route.path[0]"
        :icon="routeMarkerIcon(route.path_color)"
      ></GmapMarker>
      <GmapMarker
        :key="`ep-${i}`"
        v-if="route.path.length > 1"
        :position="route.path[route.path.length - 1]"
        :icon="routeMarkerIcon(route.path_color)"
      ></GmapMarker>
      <!-- checkpoints -->
      <GmapMarker
        v-for="(checkpoint, j) in route.checkpoints"
        :key="`cp-${i}-${j}`"
        :position="checkpoint"
        :icon="{ url: '/assets/checkpoint_marker.svg' }"
      ></GmapMarker>
      <!-- stops -->
      <GmapMarker
        v-for="(stop, j) in route.stops"
        :key="`s-${i}-${j}`"
        :position="stop"
        :icon="{ url: '/assets/stop_marker.svg' }"
      ></GmapMarker>
    </template>
    <slot></slot>
  </GmapMap>
</template>

<script>
import {gmapApi} from 'vue2-google-maps'

export default {
  name: "MonitoringMap",
  props: {
    width: { type: String, default: "100%" },
    height: { type: String, default: "400px" },
    zoom: { type: Number, default: 10 },
    routes: { type: Array, default: () => [{ path: [], path_color: "", checkpoints: [], stops: [] }] },
    line_weight: { type: Number, default: 6 },
    editable: { type: Boolean, default: false },
    center: { type: Object, default: () => ({ lat: -16.5, lng: -68.15 }) }
  },
  data: () => ({
    map: null
  }),
  computed: {
    google: gmapApi,
    bounds() {
      return this.routes.reduce((paths, route) => {
        return paths.concat(route.path);
      }, []);
    }
  },
  mounted() {
    this.$refs.map.$mapPromise.then(map => {
      this.map = map;
      this.fitBounds(this.bounds);
    });
  },
  watch: {
    bounds(val, oldVal) {
      var equal = JSON.stringify(val)==JSON.stringify(oldVal);
      if (this.map && !equal) {
        this.fitBounds(this.bounds);
      }
    }
  },
  methods: {
    routeMarkerIcon(color) {
      return {
        path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 3.5,
        strokeColor: '#F9AA33',
        scale: 0.5,
      }
    },
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