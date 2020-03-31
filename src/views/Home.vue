<template>
  <v-row>
    <v-col cols="12" md="9" class="pt-0">
      <MonitoringMap :routes="selected_routes" height="calc(100vh - 24px)">
        <template v-for="bus in selected_buses">
          <GmapMarker
            v-if="bus_positions[bus.id]"
            :key="`b-${bus.id}`"
            :icon="{ url: '/assets/bus_marker.svg' }"
            :position="bus_positions[bus.id]"
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
    route: { path: [], path_color: '', checkpoints: [], stops: [] }
  }),
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
    updateBusPosition(bus_id, lat, lng) {
      this.bus_positions[bus_id] = { lat: lat, lng: lng };
    }
  }
}
</script>
