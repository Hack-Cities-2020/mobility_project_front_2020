<template>
  <v-row>
    <v-col cols="12" md="9" class="pt-0">
      <MonitoringMap
        :routes="selected_routes"
        height="calc(100vh - 24px)"
        ref="map"
      >
        <template v-for="bus in selected_buses">
          <GmapMarker
            :key="`b-${bus.id}`"
            :ref="`b-${bus.id}`"
            :icon="{ url: '/assets/bus_marker.svg' }"
            :position="bus_positions[bus.id] || { lat: 0.0, lng: 0.0 }"
            :clickable="true"
            @click="toggleInfoWindow(`Bus:<br>placa: ${bus.plate}<br>velocidad: ${bus_positions[bus.id].speed}`, bus_positions[bus.id], `b-${bus.id}`)"
          ></GmapMarker>
        </template>
      </MonitoringMap>
    </v-col>
    <v-col cols="12" md="3" class="pt-0">
      <h3 class="mt-3">Rutas</h3>
      <v-checkbox
        v-for="route in routes"
        :key="`r-${route.id}`"
        v-model="selected_routes"
        :label="route.name"
        :value="route"
        :color="route.path_color"
        class="mt-0"
        hide-details
        dense
      ></v-checkbox>
      <h3 class="mt-3">Buses</h3>
      <v-checkbox
        v-for="bus in buses"
        :key="`b-${bus.id}`"
        v-model="selected_buses"
        :label="bus.plate"
        :value="bus"
        class="mt-0"
        hide-details
        dense
      ></v-checkbox>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import axios from "axios"

import MonitoringMap from "@/components/MonitoringMap"
import { db } from "../db";

const API_URL = process.env.VUE_APP_API_URL;

export default {
  name: 'Home',
  components: {
    MonitoringMap
  },
  data: () => ({
    routes: [],
    selected_routes: [],
    buses: [],
    selected_buses: [],
    bus_positions: {},
    last_tracking: [],
    route: { path: [], path_color: '', checkpoints: [], stops: [] }
  }),
  firestore: {
    last_tracking: db.collection('gps_tracking').orderBy('date', 'desc').limit(1)
  },
  watch: {
    last_tracking(val) {
      var record = val[0];
      if (record) {
        if (this.selected_buses.findIndex(bus => bus.id == record.idBus) != -1) {
          var position = {
            lat: parseFloat(record.latitude),
            lng: parseFloat(record.longitude),
            speed: parseFloat(record.speed)
          };
          this.bus_positions[record.idBus] = position;
          this.$refs[`b-${record.idBus}`][0].$markerObject.setPosition(position);
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    axios.get(`${API_URL}/api/route`).then(routes => {
      axios.get(`${API_URL}/api/vehicle`).then(vehicles => {
        next(vm => {
          vm.routes = routes.data;
          vm.selected_routes = routes.data;
          vm.buses = vehicles.data;
          vm.selected_buses = vehicles.data;
        });
      });
    });
  },
  methods: {
    toggleInfoWindow(content, position, key) {
      this.$refs.map.toggleInfoWindow(content, position, key);
    }
  }
}
</script>
