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
              <v-col cols="12" >
                <v-text-field
                  v-model="form.edited_item.itinerary"
                  label="Itinerario"
                  type="text"
                ></v-text-field>
                <v-text-field
                  v-model="form.edited_item.driver"
                  label="Conductor"
                  type="text"
                  class="pt-0"
                ></v-text-field>
                <v-text-field
                  v-model="form.edited_item.plate"
                  label="No. de placa"
                  type="text"
                  class="pt-0"
                ></v-text-field>
              </v-col>
            </v-row>
        </template>
      </CrudTable>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import CrudTable from "@/components/CrudTable.vue";

export default {
  name: 'Bus',
  components: {
    CrudTable
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Itinerario', value: 'itinerary' },
      { text: 'Conductor', value: 'driver', sortable: false },
      { text: 'No. de placa', value: 'plate' },
      { text: 'Acciones', value: 'action' },
    ],
    default_item: { id: 0, itinerary: '', driver: '', plate: '' },
    buses: [
      { id: 1, itinerary: 'Villa Salome - PUC', driver: "Jose Perez", plate: "123-ABC" },
      { id: 2, itinerary: 'Chasquipampa - PUC', driver: "Juan Mamani", plate: "124-ABC" },
      { id: 3, itinerary: 'Inca LLojeta - PUC', driver: "Pedro Quispe", plate: "125-ABC" },
      { id: 4, itinerary: 'Irpavi II - PUC', driver: "Jorge Mamani", plate: "126-ABC" },
      { id: 5, itinerary: 'Achumani - San Pedro', driver: "Roberto Huanca", plate: "127-ABC" },
    ],
    next_id: 6,
  }),
  methods: {
    create(bus) {
      console.log('creating bus:', bus);
      var _bus = { ...bus };
      _bus.id = this.next_id++;
      this.buses.push(_bus);
    },
    update(bus) {
      console.log('updating bus:', bus);
      var index = this.buses.findIndex(_bus => _bus.id == bus.id);
      this.buses.splice(index, 1, bus);
    },
    remove(bus) {
      console.log('removing bus:', bus);
      this.buses.splice(this.buses.indexOf(bus), 1);
    }
  }
}
</script>
