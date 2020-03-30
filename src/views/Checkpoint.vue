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
          <BaseMap :bounds="route.path" width="90%" height="350px" class="mb-3">
            <GmapPolyline
              :path.sync="route.path"
              :options="{ strokeColor: route.path_color, strokeWeight: 6 }"
              @click="addCheckpoint"
            ></GmapPolyline>
            <GmapMarker
              v-if="route.path.length"
              :position="route.path[0]"
              :icon="routeMarkerIcon(route.path_color)"
            ></GmapMarker>
            <GmapMarker
              v-if="route.path.length > 1"
              :position="route.path[route.path.length - 1]"
              :icon="routeMarkerIcon(route.path_color)"
            ></GmapMarker>
            <!-- checkpoints -->
            <GmapMarker
              v-for="(checkpoint, index) in checkpoints"
              :key="index"
              :position="checkpoint"
              :icon="{ url: '/assets/checkpoint_marker.svg' }"
            ></GmapMarker>
          </BaseMap>
        </template>
        <template #column_position=item>
          { lat: {{ item.item.lat }}, lng: {{ item.item.lng }} }
        </template>
        <template #column_action=item>
          <v-icon small color="red" @click="deleteCheckpoint(item)" >
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
    updateRoute() {
      return axios.put(`${API_URL}/api/route/${this.route.id}`, this.route).then(response => {
        var index = this.routes.findIndex(_route => _route.id == response.data.id);
        this.routes.splice(index, 1, response.data);
        this.route = response.data;
      });
    },
    addCheckpoint(event) {
      var _checkpoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      this.route.checkpoints.push(_checkpoint);
      this.updateRoute().catch(error => {
        console.log(error);
        this.route.checkpoints.pop();
      });
    },
    deleteCheckpoint(checkpoint) {
      var sure = confirm(`¿Está seguro que desea eliminar este Punto de Control?`);
      if (sure) {
        var index = this.route.checkpoints.indexOf(checkpoint);
        this.route.checkpoints.splice(index, 1);
        this.updateRoute().catch(error => {
          console.log(error);
          this.route.checkpoints.splice(index, 0, checkpoint);
        });
      }
    }
  }
}
</script>
