<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="zoom"
    :style="{ width: width, height: height }"
    @click="event => $emit('click', event)"
  >
    <!-- polyline -->
    <GmapPolyline
      :editable="editable"
      :path.sync="route.path"
      :options="{ strokeColor: route.path_color, strokeWeight: line_weight }"
      @click="event => $emit('polyline_click', event)"
      @path_changed="event => route.path=event.i"
    ></GmapPolyline>
    <GmapMarker
      v-if="route.path.length"
      :position="route.path[0]"
      :icon="routeMarkerIcon(route.path_color)"
      :clickable="true"
      @click="toggleInfoWindow('inicio', route.path[0], `start-${route.id}`, -16)"
    ></GmapMarker>
    <GmapMarker
      v-if="route.path.length > 1"
      :position="route.path[route.path.length - 1]"
      :icon="routeMarkerIcon(route.path_color)"
      :clickable="true"
      @click="toggleInfoWindow('fin', route.path[route.path.length - 1], `end-${route.id}`, -16)"
    ></GmapMarker>
    <template v-if="!editable">
      <!-- checkpoints -->
      <GmapMarker
        v-for="(checkpoint, index) in route.checkpoints"
        :key="`cp-${index}`"
        :position="checkpoint"
        :icon="{ url: '/assets/checkpoint_marker.svg' }"
        :clickable="true"
        @click="toggleInfoWindow(`Punto de Control ${checkpoint.id}`, checkpoint, `cp-${index}`)"
      ></GmapMarker>
      <!-- stops -->
      <GmapMarker
        v-for="(stop, index) in route.stops"
        :key="`s-${index}`"
        :position="stop"
        :icon="{ url: '/assets/stop_marker.svg' }"
        :clickable="true"
        @click="toggleInfoWindow(stop.name, stop, `s-${index}`)"
      ></GmapMarker>
    </template>
    <!-- info window -->
    <GmapInfoWindow
      :options="info_options"
      :position="info_window_pos"
      :opened="info_win_open"
      @closeclick="info_win_open=false"
    ></GmapInfoWindow>
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
    route: { type: Object, default: () => ({ path: [], path_color: "", checkpoints: [], stops: [] }) },
    line_weight: { type: Number, default: 6 },
    editable: { type: Boolean, default: false },
    center: { type: Object, default: () => ({ lat: -16.5, lng: -68.15 }) }
  },
  data: () => ({
    map: null,
    info_window_pos: null,
    info_win_open: false,
    current_marker: null,
    info_options: {
      content: '',
      pixelOffset: {
        width: 0,
        height: -32
      }
    },
  }),
  computed: {
    google: gmapApi,
    bounds() {
      return this.route.path;
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
      if (this.map && !this.editable && !equal) {
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
    },
    toggleInfoWindow(content, position, key, offset=-32) {
      this.info_window_pos = position;
      this.info_options.content = content;
      this.info_options.pixelOffset.height = offset;
      //check if its the same marker that was selected if yes toggle
      if (this.current_marker == key) {
        this.info_win_open = !this.info_win_open;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.info_win_open = true;
        this.current_marker = key;
      }
    }
  }
}
</script>

<style>

</style>