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
              <v-col cols="12" >
                <v-text-field
                  v-model="form.edited_item.name"
                  label="Nombre"
                  type="text"
                ></v-text-field>
                <v-text-field
                  v-model="form.edited_item.color"
                  label="Color"
                  type="text"
                  class="pt-0"
                  @focus="color_picker=true"
                ></v-text-field>
                <v-dialog v-model="color_picker" width="300">
                  <v-card>
                    <v-color-picker v-model="form.edited_item.color"></v-color-picker>
                  </v-card>
                </v-dialog>
                <!-- route -->
                <span class="body-2">Ruta</span>
                <BaseMap height="300px" @click="event => form.edited_item.route.push(event.latLng)">
                  <GmapPolyline
                    :editable="true"
                    :path.sync="form.edited_item.route"
                    :options="{ strokeColor: form.edited_item.color, strokeWeight: 6 }"
                    @path_changed="event => form.edited_item.route=event.i"
                  ></GmapPolyline>
                  <GmapMarker
                    v-if="form.edited_item.route.length"
                    :position="form.edited_item.route[0]"
                    :icon="routeMarkerIcon(form.edited_item.color)"
                  ></GmapMarker>
                  <GmapMarker
                    v-if="form.edited_item.route.length > 1"
                    :position="form.edited_item.route[form.edited_item.route.length - 1]"
                    :icon="routeMarkerIcon(form.edited_item.color)"
                  ></GmapMarker>
                </BaseMap>
              </v-col>
            </v-row>
        </template>
        <template #column_color="item">
          <span :style="{color: item.item.color}">{{ item.item.color }}</span>
        </template>
        <template #column_route="item">
          <v-dialog v-model="show_route[item.item.id]" width="600px">
            <template v-slot:activator="{ on }">
              <v-btn icon color="primary" v-on="on" >
                <v-icon>mdi-map-search</v-icon>
              </v-btn>
            </template>
            <v-card>
              <BaseMap height="300px">
                <GmapPolyline
                  :path.sync="item.item.route"
                  :options="{ strokeColor: item.item.color, strokeWeight: 6 }"
                ></GmapPolyline>
                <GmapMarker
                  v-if="item.item.route.length"
                  :position="item.item.route[0]"
                  :icon="routeMarkerIcon(item.item.color)"
                ></GmapMarker>
                <GmapMarker
                  v-if="item.item.route.length > 1"
                  :position="item.item.route[item.item.route.length - 1]"
                  :icon="routeMarkerIcon(item.item.color)"
                ></GmapMarker>
              </BaseMap>
            </v-card>
          </v-dialog>
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
      { text: 'Nombre', value: 'name' },
      { text: 'Color', value: 'color', sortable: false },
      { text: 'Ruta', value: 'route' },
      { text: 'Acciones', value: 'action' },
    ],
    default_item: { id: 0, name: '', color: '#4A6572', route: [] },
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
