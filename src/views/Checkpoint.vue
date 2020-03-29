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
        @create="create"
        @update="update"
        @remove="remove"
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
            item-value="id"
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
          <BaseMap width="90%" class="mb-3"></BaseMap>
        </template>
        <template #column_position=item>
          { lat: {{ item.item.lat }}, lng: {{ item.item.lng }} }
        </template>
      </CrudTable>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import BaseMap from '@/components/BaseMap'
import CrudTable from '@/components/CrudTable'

export default {
  name: 'Route',
  components: {
    CrudTable,
    BaseMap
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Ruta', value: 'route' },
      { text: 'Dirección', value: 'address' },
      { text: 'Posición', value: 'position', sortable: false },
      { text: 'Acciones', value: 'action' },
    ],
    default_item: { id: 0, name: '', color: '#4A6572', route: [] },
    checkpoints: [
      { id: 1, route: 'Villa Salome - PUC', lat: -16.3999, lng: -68.005 },
      { id: 2, route: 'Chasquipampa - PUC', lat: -16.3999, lng: -68.015 },
      { id: 3, route: 'Inca LLojeta - PUC', lat: -16.3999, lng: -68.025 },
      { id: 4, route: 'Irpavi II - PUC', lat: -16.3999, lng: -68.035 },
      { id: 5, route: 'Achumani - San Pedro', lat: -16.3999, lng: -68.045 },
    ],
    routes: [
      { id: 1, name: 'Villa Salome - PUC', color: "#121212", route: [] },
      { id: 2, name: 'Chasquipampa - PUC', color: "#454545", route: [] },
      { id: 3, name: 'Inca LLojeta - PUC', color: "#787878", route: [] },
      { id: 4, name: 'Irpavi II - PUC', color: "#232323", route: [] },
      { id: 5, name: 'Achumani - San Pedro', color: "#565656", route: [] },
    ],
    next_id: 6,
    color_picker: false,
    show_route: {},
    route_marker_icon: {
      path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
      fillColor: "#000000",
      fillOpacity: 1,
      strokeWeight: 2.5,
      strokeColor: '#F9AA33',
      scale: 0.5,
    }
  }),
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
    create(route) {
      console.log('creating route:', route);
      var _route = { ...route };
      _route.id = this.next_id++;
      this.routes.push(_route);
    },
    update(route) {
      console.log('updating route:', route);
      var index = this.routes.findIndex(_route => _route.id == route.id);
      this.routes.splice(index, 1, route);
    },
    remove(route) {
      console.log('removing route:', route);
      this.routes.splice(this.routes.indexOf(route), 1);
    }
  }
}
</script>
