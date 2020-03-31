<template>
  <v-row class="justify-center mt-4 mx-auto">
    <v-col cols="10">
      <CrudTable
        title="Rutas"
        entity="Ruta"
        :headers="headers"
        :items="routes"
        sortby="id"
        :default_item="default_item"
        @create="create"
        @update="update"
        @remove="remove"
      >
        <template #form="form">
            <v-row>
              <v-col cols="12" class="pb-0">
                <v-text-field
                  v-model="form.edited_item.name"
                  label="Nombre"
                  type="text"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="pb-0">
                <v-text-field
                  v-model="form.edited_item.status"
                  label="Estado"
                  type="text"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="pb-0">
                <v-text-field
                  v-model="form.edited_item.path_color"
                  label="Color"
                  type="text"
                  hide-details
                  @focus="color_picker=true"
                ></v-text-field>
                <v-dialog v-model="color_picker" width="300">
                  <v-card>
                    <v-color-picker v-model="form.edited_item.path_color"></v-color-picker>
                  </v-card>
                </v-dialog>
                <!-- route -->
              </v-col>
              <v-col cols="12">
                <span class="body-2">Ruta</span>
                <BaseMap
                  height="300px"
                  :editable="true"
                  :route="form.edited_item"
                  @click="event => form.edited_item.path.push(event.latLng)"
                ></BaseMap>
              </v-col>
            </v-row>
        </template>
        <template #column_path_color="item">
          <span :style="{color: item.item.path_color}">{{ item.item.path_color }}</span>
        </template>
        <template #column_path="item">
          <v-dialog v-model="show_route[item.item.id]" width="600px">
            <template v-slot:activator="{ on }">
              <v-btn icon color="primary" v-on="on" >
                <v-icon>mdi-map-search</v-icon>
              </v-btn>
            </template>
            <v-card>
              <BaseMap :route="item.item"></BaseMap>
            </v-card>
          </v-dialog>
        </template>
      </CrudTable>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

import BaseMap from '@/components/BaseMap'
import CrudTable from '@/components/CrudTable'

const API_URL = process.env.VUE_APP_API_URL;

export default {
  name: 'Route',
  components: {
    CrudTable,
    BaseMap
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nombre', value: 'name' },
      { text: 'Estado', value: 'status' },
      { text: 'Color', value: 'path_color', sortable: false },
      { text: 'Ruta', value: 'path' },
      { text: 'Acciones', value: 'action' },
    ],
    default_item: { id: 0, name: '', status: "active", path_color: '#4A6572', path: [] },
    routes: [],
    color_picker: false,
    show_route: {},
  }),
  beforeRouteEnter(to, from, next) {
    axios.get(`${API_URL}/api/route`).then(response => {
      next(vm => vm.routes=response.data);
    });
  },
  methods: {
    create(route) {
      console.log('creating route:', route);
      var _route = { ...route };
      delete _route.id;
      axios.post(`${API_URL}/api/route`, _route).then(response => {
        this.routes.push(response.data);
        this.default_item.path = [];
      });
    },
    update(route) {
      console.log('updating route:', route);
      axios.put(`${API_URL}/api/route/${route.id}`, route).then(response => {
        var index = this.routes.findIndex(_route => _route.id == response.data.id);
        this.routes.splice(index, 1, response.data);
      });
    },
    remove(route) {
      console.log('removing route:', route);
      axios.delete(`${API_URL}/api/route/${route.id}`).then(() => {
        this.routes.splice(this.routes.indexOf(route), 1);
      });
    }
  }
}
</script>
