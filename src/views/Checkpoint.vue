<template>
  <v-row class="justify-center mt-4 mx-auto">
    <v-col cols="10">
      <CrudTable
        title="Puntos de Control"
        entity="Punto de Control"
        :enable_create="false"
        :headers="headers"
        :items="checkpoints"
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
        <template #form="form">
            <v-row>
              <v-col cols="12" >
                {{ form }}
              </v-col>
            </v-row>
        </template>
        <template #pretable>
          <BaseMap
            :route="route"
            width="90%"
            height="350px"
            class="mb-3"
            @polyline_click="addCheckpoint"
          >
          </BaseMap>
        </template>
        <template #column_position=item>
          { lat: {{ item.item.lat }}, lng: {{ item.item.lng }} }
        </template>
        <template #column_action=item>
          <v-icon small color="red" @click="deleteCheckpoint(item.item)" >
            mdi-delete
          </v-icon>
        </template>
      </CrudTable>
    </v-col>
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
      { text: 'Posición', value: 'position', sortable: false },
      { text: 'Acciones', value: 'action' },
    ],
    default_item: { id: 0, name: '', color: '#4A6572', route: [] },
    routes: [],
    next_id: 6,
    route: { checkpoints: [], path: [], path_color: "" },
  }),
  computed: {
    checkpoints() {
      return this.route.checkpoints.filter(checkpoint => checkpoint.id != undefined);
    }
  },
  beforeRouteEnter(to, from, next) {
    axios.get(`${API_URL}/api/route`).then(response => {
      next(vm => vm.routes=response.data);
    });
  },
  methods: {
    updateRoute() {
      return axios.put(`${API_URL}/api/route/${this.route.id}`, this.route).then(response => {
        var index = this.routes.findIndex(_route => _route.id == response.data.id);
        this.routes.splice(index, 1, response.data);
        this.route = response.data;
      });
    },
    addCheckpoint(event) {
      var _checkpoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      axios.put(`${API_URL}/api/route/${this.route.id}/checkpoints`, _checkpoint).then(response => {
        var index = this.routes.findIndex(_route => _route.id == this.route.id);
        this.route.checkpoints.push(response.data);
        this.routes[index] = this.route;
      });
    },
    deleteCheckpoint(checkpoint) {
      var sure = confirm(`¿Está seguro que desea eliminar este Punto de Control?`);
      if (sure) {
        axios.delete(`${API_URL}/api/route/${this.route.id}/checkpoints/${checkpoint.id}`).then(() => {
          var index = this.route.checkpoints.indexOf(checkpoint);
          this.route.checkpoints.splice(index, 1);
          index = this.routes.findIndex(_route => _route.id == this.route.id);
          this.routes[index] = this.route;
        });
      }
    }
  }
}
</script>
