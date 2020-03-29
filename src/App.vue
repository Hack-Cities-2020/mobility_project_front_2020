<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      color="primary"
      permanent
      dark
      app
    >
      <v-list-item class="px-3 my-4">
        <v-app-bar-nav-icon @click.stop="mini = !mini" />
        <v-list-item-title class="text-center title">HACK-FELLAS</v-list-item-title>
        <v-btn icon @click.stop="mini = !mini" >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-list dense nav rounded>
        <template v-for="item in items">
          <v-list-item
            :key="item.text"
            :to="{ name: item.to }"
            active-class="secondary tertiary--text"
            link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid class="fill-height align-start" style="background-color: #eceff2">
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    mini: false,
    items: [
      { icon: 'mdi-routes-clock', text: "Itinerarios", to: "itinerary" },
      { icon: 'mdi-map-marker-check-outline', text: "Puntos de control", to: "checkpoint" },
      { icon: 'mdi-bus', text: "Buses", to: "bus" },
    ],
  }),
}
</script>

<style>
.v-list-item--active .v-list-item__title {
  font-size: 1.15rem !important;
}
</style>
