<template>
  <GmapMap
    :center="{lat:10, lng:10}"
    :zoom="7"
    map-type-id="terrain"
    style="width: 500px; height: 300px"
    >
    <GmapMarker
      :key="index"
      v-for="(marker, index) in markers"
      :position="marker.position"
      :icon="marker.icon"
      :clickable="true"
      :draggable="true"
      @click="center=marker.position"
    />
  </GmapMap>
</template>

<script>
export default {
  name: "Map",
  data: () => ({
    markers: [
      { position: {lat:10, lng:10}, icon: { url: "/assets/checkpoint_marker.svg" } }
    ]
  })
}
</script>

<style>

</style>