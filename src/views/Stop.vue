<template>
  <v-row class="justify-center mt-4 mx-auto">
    <v-col cols="10">
      <CrudTable
        title="Paradas"
        entity="Parada"
        :enable_create="false"
        :headers="headers"
        :items="stops"
        sortby="id"
        :default_item="default_item"
      >
        <template #subtitle>
          <v-select
            :items="routes"
            v-model="route"
            label="Ruta"
            hide-selected
            hide-details
            single-line
            item-text="name"
            return-object
            prepend-icon="mdi-routes-clock"
            style="max-width: 50%"
          ></v-select>
        </template>
        <template #pretable>
          <BaseMap
            :route="route"
            width="90%"
            height="350px"
            class="mb-3"
            @polyline_click="createStop"
          >
          </BaseMap>
        </template>
        <template #column_position=item>
          { lat: {{ item.item.lat }}, lng: {{ item.item.lng }} }
        </template>
        <template #column_action=item>
          <v-icon small color="red" @click="deleteStop(item.item)" >
            mdi-delete
          </v-icon>
        </template>
      </CrudTable>
    </v-col>
    <v-dialog v-model="add_stop_dialog" max-width="400px">
      <v-card class="primary--text">
        <v-card-title>
          <span class="headline">Nueva Parada</span>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="new_item.name"
                label="Nombre"
                type="text"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="quaternary" text @click="resetNewItem">Cancel</v-btn>
          <v-btn color="primary" text @click="addStop">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'

import BaseMap from '@/components/BaseMap'
import CrudTable from '@/components/CrudTable'

const API_URL = process.env.VUE_APP_API_URL;

export default {
  name: 'Checkpoint',
  components: {
    CrudTable,
    BaseMap
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nombre', value: 'name' },
      { text: 'Posición', value: 'position', sortable: false },
      { text: 'Acciones', value: 'action' },
    ],
    default_item: { id: 0, name: '', lat: 0.0, lng: 0.0 },
    new_item: { name: '', lat: 0.0, lng: 0.0 },
    add_stop_dialog: false,
    routes: [],
    route: { stops: [], path: [], path_color: "" },
  }),
  computed: {
    stops() {
      return this.route.stops.filter(stop => stop.id != undefined);
    }
  },
  beforeRouteEnter(to, from, next) {
    axios.get(`${API_URL}/api/route`).then(response => {
      next(vm => vm.routes=response.data);
    });
  },
  methods: {
    resetNewItem() {
      this.add_stop_dialog = false;
      this.new_item = { ...this.default_item };
      delete this.new_item.id;
    },
    createStop(event) {
      this.add_stop_dialog = true;
      this.new_item.lat = event.latLng.lat();
      this.new_item.lng = event.latLng.lng();
    },
    addStop() {
      axios.put(`${API_URL}/api/route/${this.route.id}/stops`, this.new_item).then(response => {
        var index = this.routes.findIndex(_route => _route.id == this.route.id);
        this.route.stops.push(response.data);
        this.routes[index] = this.route;
        this.resetNewItem();
      });
    },
    deleteStop(stop) {
      var sure = confirm(`¿Está seguro que desea eliminar esta Parada?`);
      if (sure) {
        axios.delete(`${API_URL}/api/route/${this.route.id}/stops/${stop.id}`).then(() => {
          var index = this.route.stops.indexOf(stop);
          this.route.stops.splice(index, 1);
          index = this.routes.findIndex(_route => _route.id == this.route.id);
          this.routes[index] = this.route;
        });
      }
    }
  }
}
</script>
