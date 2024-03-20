<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card color="#F5F5F5">
      <v-card-title class="pa-0">
        <v-toolbar dark color="secondary">
          <v-icon> mdi-image </v-icon>
          <v-spacer />

          <v-btn
            :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
            dark
            outlined
            @click="$refs.vzoomer.zoomOut((scale = 0.5))"
          >
            <v-icon>mdi-magnify-minus-outline</v-icon>
          </v-btn>

          <v-btn
            :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
            dark
            outlined
            @click="$refs.vzoomer.reset()"
          >
            <v-icon>mdi-image-filter-center-focus-strong</v-icon>
          </v-btn>

          <v-btn
            :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
            dark
            outlined
            @click="$refs.vzoomer.zoomIn((scale = 2))"
          >
            <v-icon>mdi-magnify-plus-outline</v-icon>
          </v-btn>


          <v-toolbar-title></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>

      <div class="mt-2 text-center noselect">
        <v-zoomer
          :limitTranslation="false"
          style="width: 100vw; height: 90vh"
          ref="vzoomer"
        >
          <img
            :src="image"
            style="object-fit: contain; width: 100%; height: 100%"
          />
        </v-zoomer>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import VueZoomer from "vue-zoomer";

export default {
  data: () => ({
    dialog: false,
    image: null,
    zoom: 50,
  }),
  watch: {
    dialog(val) {
      this.zoom = 50;
    },
  },
  methods: {
    openDialog(image) {
      this.dialog = true;
      this.image = image;
    },
  },
};
</script>

<style>
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
}
</style>
