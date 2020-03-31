<template>
  <v-row class="justify-center mt-4 mx-auto">
    <v-col cols="10">
      <v-select
        :items="routes"
        v-model="selected_routes"
        label="Rutas"
        hide-selected
        multiple
        hide-details
        item-text="name"
        item-value="id"
      ></v-select>
    </v-col>
    <v-col cols="10">
      <v-select
        :items="buses"
        v-model="selected_buses"
        label="Buses"
        hide-selected
        multiple
        hide-details
        item-text="plate"
        item-value="id"
      ></v-select>
    </v-col>
    <v-col cols="10" sm="5">
      <v-select
        :items="periods"
        v-model="period"
        label="Periodo"
        hide-details
      ></v-select>
    </v-col>
    <v-col cols="10" sm="5">
      <v-btn
        color="primary"
        class="float-right mt-3"
        @click="requestReport()"
      >Generar reporte</v-btn>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import axios from "axios"

const API_URL = process.env.VUE_APP_API_URL;

export default {
  name: 'Report',
  data: () => ({
    routes: [],
    selected_routes: [],
    buses: [],
    selected_buses: [],
    periods: ["diario", "semanal", "mensual"],
    period: null
  }),
  beforeRouteEnter(to, from, next) {
    axios.get(`${API_URL}/api/route`).then(routes => {
      axios.get(`${API_URL}/api/vehicle`).then(vehicles => {
        next(vm => {
          vm.routes = routes.data;
          vm.buses = vehicles.data;
        });
      });
    });
  },
  methods: {
    requestReport() {
      console.log(this.selected_routes);
      console.log(this.selected_buses);
      console.log(this.period);
    }
  }
}
</script>
