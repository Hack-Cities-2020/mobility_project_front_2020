<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :sort-by="sortby"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title class="primary--text">{{ title }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" outlined v-on="on" >
              <v-icon>mdi-plus</v-icon>
              Nuevo {{ entity }}
            </v-btn>
          </template>
          <v-card class="primary--text">
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <slot name="form" v-bind:edited_item="edited_item">
                Empty form
              </slot>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="quaternary" text @click="close">Cancel</v-btn>
              <v-btn color="primary" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-for="slot in columnSlots" v-slot:[slot.name]="{ item }">
      <div :key="slot.value">
        <slot :name="'column_' + slot.value" v-bind:item="item">
          <div v-if="slot.value == 'action'">
            <slot name="extra_actions" v-bind:item="item"></slot>
            <v-icon small class="mr-2" @click="editItem(item)" >
              mdi-pencil
            </v-icon>
            <v-icon small color="red" @click="deleteItem(item)" >
              mdi-delete
            </v-icon>
          </div>
          <div v-else>
            {{ item[slot.value] }}
          </div>
        </slot>
      </div>
    </template>
    <template v-slot:no-data>
      No data for {{ title }}
    </template>
  </v-data-table>
</template>

<script>
  export default {
    props: {
      title: String,
      entity: String,
      headers: { type: Array, default: () => [] },
      items: { type: Array, default: () => [] },
      sortby: String,
      default_item: { type: Object, default: () => ({}) }
    },

    data() {
      return {
        dialog: false,
        edited_index: -1,
        edited_item: { ...this.default_item },
      }
    },

    computed: {
      formTitle () {
        var action = this.edited_index === -1 ? 'New' : 'Edit';
        return action + ' ' + this.entity;
      },
      columnSlots() {
        return this.headers.map(header => ({name: 'item.' + header.value, value: header.value}));
      }
    },

    watch: {
      dialog (val) {
        val || this.close();
      },
    },

    methods: {
      editItem (item) {
        this.edited_index = this.items.indexOf(item);
        this.edited_item = {...item};
        this.dialog = true;
      },

      deleteItem (item) {
        confirm(`¿Está seguro que desea eliminar este ${this.entity}?`) && this.$emit('remove', item);
      },

      close () {
        this.dialog = false;
        setTimeout(() => {
          this.edited_item = {...this.default_item};
          this.edited_index = -1;
        }, 300);
      },

      save () {
        var event_type = this.edited_index > -1 ? 'update' : 'create';
        this.$emit(event_type, this.edited_item);
        this.close();
      },
    },
  }
</script>
