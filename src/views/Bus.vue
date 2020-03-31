<template>
  <v-row class="justify-center mt-4 mx-auto">
    <v-col cols="10">
      <CrudTable
        title="Buses"
        entity="Bus"
        :headers="headers"
        :items="buses"
        sortby="id"
        :default_item="default_item"
        @create="create"
        @update="update"
        @remove="remove"
      >
        <template #form="form">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  :items="routes"
                  v-model="form.edited_item.route_id"
                  label="Ruta"
                  hide-selected
                  hide-details
                  single-line
                  item-text="name"
                  item-value="id"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.edited_item.plate"
                  label="No. de placa"
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.edited_item.model"
                  label="Marca"
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.edited_item.manufacturer"
                  label="Fabricante"
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.edited_item.year"
                  label="Año de fabricación"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.edited_item.capacity"
                  label="Capacidad"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12"><h3>Datos del conductor</h3></v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.edited_item.driver.full_name"
                  label="Nombre completo"
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.edited_item.driver.ci"
                  label="Carnet de Identidad"
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>
        </template>
        <!-- <template #column_route="item">
          {{ routes.find(route => route.id == item.item.id).name }}
        </template> -->
        <template #column_driver="item">
          {{ item.item.driver.full_name }}
        </template>
      </CrudTable>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import axios from "axios"

import CrudTable from "@/components/CrudTable.vue";

const API_URL = process.env.VUE_APP_API_URL;

export default {
  name: 'Bus',
  components: {
    CrudTable
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'ruta', value: 'route_id' },
      { text: 'No. de placa', value: 'plate' },
      { text: 'Marca', value: 'model' },
      { text: 'Fabricante', value: 'manufacturer' },
      { text: 'Año de fabricación', value: 'year' },
      { text: 'Capacidad', value: 'capacity' },
      { text: 'Conductor', value: 'driver' },
      { text: 'Acciones', value: 'action' },
    ],
    default_item: { id: 0, route_id: 0, plate: '', model: '', manufacturer: '', year: 0, capacity: 0, driver: { full_name: '', ci: '' } },
    routes: [],
    buses: [],
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
    create(bus) {
      console.log('creating bus:', bus);
      var _bus = { ...bus };
      axios.post(`${API_URL}/api/vehicle`, _bus).then(response => {
        this.buses.push(response.data);
      });
    },
    update(bus) {
      console.log('updating bus:', bus);
      var _bus = { ...bus };
      var _driver = { ...bus.driver };
      delete _driver.id;
      _bus.driver = _driver;
      axios.put(`${API_URL}/api/vehicle/${bus.id}`, _bus).then(response => {
        var index = this.buses.findIndex(_bus => _bus.id == response.data.id);
        this.buses.splice(index, 1, response.data);
      });
    },
    remove(bus) {
      console.log('removing bus:', bus);
      axios.delete(`${API_URL}/api/vehicle/${bus.id}`).then(() => {
        this.buses.splice(this.buses.indexOf(bus), 1);
      });
    }
  }
}
</script>
