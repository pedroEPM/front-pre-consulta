<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card color="primary" dark>
        <v-toolbar flat color="primary">
          <v-toolbar-title> Editor </v-toolbar-title>

          <v-spacer />

          <div class="hidden-sm-and-down">
            <v-btn
              :depressed="selected[0].pressed"
              :outlined="!selected[0].pressed"
              :style="'color:' + selected[0].text"
              color="white"
              class="ml-3"
              @click="mode = 1"
            >
              <v-icon left>mdi-newspaper-variant-outline</v-icon>
              Notas
            </v-btn>
            <v-btn
              :depressed="selected[1].pressed"
              :outlined="!selected[1].pressed"
              :style="'color:' + selected[1].text"
              color="white"
              class="ml-3"
              @click="mode = 2"
            >
              <v-icon left>mdi-image</v-icon>
              Imagenes
            </v-btn>
            <v-btn
              :depressed="selected[2].pressed"
              :outlined="!selected[2].pressed"
              :style="'color:' + selected[2].text"
              color="white"
              class="ml-3"
              @click="mode = 3"
            >
              <v-icon left>mdi-file</v-icon>
              PDFs
            </v-btn>

            <v-btn outlined class="ml-3" disabled>
              <v-icon left>mdi-video-box</v-icon>
              Multimedia
            </v-btn>
          </div>

          <div class="hidden-md-and-up">
            <v-btn
              :depressed="selected[0].pressed"
              :style="'color:' + selected[0].text"
              color="white"
              icon
              class="pa-0"
              @click="mode = 1"
            >
              <v-icon>mdi-newspaper-variant-outline</v-icon>
            </v-btn>
            <v-btn
              :depressed="selected[1].pressed"
              :style="'color:' + selected[1].text"
              color="white"
              icon
              @click="mode = 2"
            >
              <v-icon>mdi-image</v-icon>
            </v-btn>
            <v-btn
              :depressed="selected[2].pressed"
              :style="'color:' + selected[2].text"
              color="white"
              icon
              @click="mode = 3"
            >
              <v-icon>mdi-file</v-icon>
            </v-btn>

            <v-btn icon disabled>
              <v-icon>mdi-video-box</v-icon>
            </v-btn>
          </div>
        </v-toolbar>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <Editor-Note-Card ref="noteCard" v-if="mode == 1" />
      <Editor-Image-Card ref="noteCard" v-if="mode == 2" />
      <Editor-PDF-Card ref="noteCard" v-if="mode == 3" />
      <EditorGraphics ref="graphicsCard" v-if="mode == 5" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from "vuex";

import EditorNoteCard from "~/components/editor/EditorNoteCard";
import EditorImageCard from "~/components/editor/EditorImageCard";
import EditorPDFCard from "~/components/editor/EditorPDFCard";
import EditorGraphics from "~/components/editor/EditorGraphicsCard";

export default {
  components: {
    EditorNoteCard,
    EditorImageCard,
    EditorPDFCard,
    EditorGraphics,
  },
  data: () => ({
    mode: 1,
    showMenu: true,
    items: [],
    headers: [
      {
        text: "Título",
        align: "start",
        sortable: false,
        value: "title",
      },
      { text: "Subtítulo", value: "name" },
      { text: "Notas", value: "publication" },
      { text: "Publicación", value: "publication" },
      { text: "Cuaderno", value: "publication" },
      { text: "Fecha de publicación	", value: "publication" },
      { text: "Autor", value: "publication" },
      { text: "Página", value: "publication" },
      { text: "Acciones", align: "center", value: "action", sortable: false },
    ],
    selected: [
      { pressed: true, color: "white", text: "#004D9C" },
      { pressed: false, color: "white", text: "white" },
      { pressed: false, color: "white", text: "white" },
      { pressed: false, color: "white", text: "white" },
      { pressed: false, color: "white", text: "white" },
    ],
  }),
  watch: {
    mode(val) {
      switch (val) {
        case 1:
          this.selected[0] = { pressed: true, color: "white", text: "#004D9C" };
          this.selected[1] = { pressed: false, color: "white", text: "white" };
          this.selected[2] = { pressed: false, color: "white", text: "white" };
          this.selected[3] = { pressed: false, color: "white", text: "white" };
          this.selected[4] = { pressed: false, color: "white", text: "white" };
          break;

        case 2:
          this.selected[0] = { pressed: false, color: "white", text: "white" };
          this.selected[1] = { pressed: true, color: "white", text: "#004D9C" };
          this.selected[2] = { pressed: false, color: "white", text: "white" };
          this.selected[3] = { pressed: false, color: "white", text: "white" };
          this.selected[4] = { pressed: false, color: "white", text: "white" };
          break;

        case 3:
          this.selected[0] = { pressed: false, color: "white", text: "white" };
          this.selected[1] = { pressed: false, color: "white", text: "white" };
          this.selected[2] = { pressed: true, color: "white", text: "#004D9C" };
          this.selected[3] = { pressed: false, color: "white", text: "white" };
          this.selected[4] = { pressed: false, color: "white", text: "white" };
          break;
        case 5:
          this.selected[0] = { pressed: false, color: "white", text: "white" };
          this.selected[1] = { pressed: false, color: "white", text: "white" };
          this.selected[2] = { pressed: false, color: "white", text: "white" };
          this.selected[3] = { pressed: false, color: "white", text: "white" };
          this.selected[4] = { pressed: true, color: "white", text: "#004D9C" };
          break;
      }
    },
  },
  async created() {
    if (process.browser) {
      await Promise.allSettled([
        this.getPublicationsS(),
        this.getNotebooksS(),
      ]);
    }
  },
  computed: {
    ...mapState(["notebooksStore", "publicationsStore"]),
  },
  methods: {
    ...mapActions([
      "getNotebooksS",
      "getPublicationsS",
    ]),
  },
};
</script>

<style scoped>
.v-card__title {
  padding: 5px !important;
}
.v-card__actions {
  padding: 0px !important;
}
.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 1px !important;
}
</style>
