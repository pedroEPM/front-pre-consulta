<template>
  <div>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title> Fotos </v-toolbar-title>

        <v-spacer />

        <v-chip class="mr-2" color="white" v-if="elementsCounter !== null">
          <strong> Total: {{ elementsCounter }} </strong>
        </v-chip>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mr-2" color="primary" v-bind="attrs" v-on="on">
              Crear imagen
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="$refs.addDialog.openDialog(1)">
              <v-list-item-title> Una imagen </v-list-item-title>
            </v-list-item>

            <v-list-item @click="$refs.multipleDialog.openDialog(2)">
              <v-list-item-title> Multiples fotos </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          style="width: 200px"
          class="mr-2"
          color="secondary"
          @click="search()"
        >
          <v-icon left>mdi-magnify</v-icon> Buscar</v-btn
        >
      </v-toolbar>

      <v-card-text class="vCard">
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 class="pr-5 pl-5">
              <v-layout row wrap>
                <v-flex xs12 md4 class="pa-1">
                  <v-select
                    :items="publications"
                    label="Publicación"
                    placeholder="Seleccione una opción"
                    item-text="publicationName"
                    item-value="_id"
                    outlined
                    dense
                    hide-details=""
                    v-model="advObj.publicationRef"
                    class="custom-field"
                    item-disabled="disable"
                  >
                    <template v-slot:item="{ item, attrs, on }">
                      <v-list-item
                        v-on="on"
                        v-bind="attrs"
                        :style="colorstant(item)"
                      >
                        <v-list-item-content
                          :style="
                            item.disable == true ? '' : 'padding-left : 10px'
                          "
                        >
                          <v-list-item-title
                            v-if="item.disable"
                            :class="
                              !item.disable == true
                                ? 'listItemTitleFalse'
                                : 'listItemTitleTrue'
                            "
                          >
                            {{ item.publicationName }}
                          </v-list-item-title>
                          <v-list-item-title v-else>
                            <v-row no-gutters align="center">
                              <span>{{ item.publicationName }}</span>
                              <v-spacer></v-spacer>
                              <!--v-chip x-small>{{
                                    "Megamedia Editorial"
                                  }}</v-chip-->
                            </v-row>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-flex>

                <v-flex xs12 md4 class="pa-1">
                  <v-select
                    :items="
                      advObj.publicationRef != null ? notebooks2 : notebooks
                    "
                    label="Cuaderno"
                    placeholder="Seleccione una opción"
                    item-text="NoteBookName"
                    item-value="_id"
                    outlined
                    dense
                    :disabled="advObj.publicationRef === null"
                    hide-details
                    v-model="advObj.noteBookRef"
                    class="custom-field"
                    item-disabled="disable"
                  >
                    <template v-slot:item="{ item, attrs, on }">
                      <v-list-item
                        ripple
                        v-on="on"
                        v-bind="attrs"
                        :style="
                          item.disable == true
                            ? 'background-color : #b3b3b3'
                            : ''
                        "
                      >
                        <v-list-item-content
                          :style="
                            item.disable == true ? 'padding-left : 2px' : ''
                          "
                        >
                          <v-list-item-title
                            :class="
                              item.disable == true
                                ? 'listItemTitleTrue'
                                : 'listItemTitleFalse'
                            "
                          >
                            {{ item.NoteBookName }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-flex>

                <!-- <v-flex xs12 md4 class="pa-1">
                  <v-select
                    label="Editar en"
                    outlined
                    dense
                    hide-details
                  ></v-select>
                </v-flex> -->

                <v-flex xs12 md4 class="pa-1">
                  <v-text-field
                    label="Palabra clave"
                    outlined
                    dense
                    hide-details
                    class="custom-field"
                    v-model="advObj.keysentence"
                  ></v-text-field>
                </v-flex>

                <!-- <v-flex xs12 md4 class="pa-1">
                  <v-checkbox
                    label="No publicada"
                    hide-details
                    style="margin-top: 0.25rem"
                  >
                  </v-checkbox>
                </v-flex> -->

                <v-flex xs12 md4 class="pa-1">
                  <v-select
                    :items="select"
                    label="Cuando"
                    placeholder="Seleccione una opción"
                    item-text="text"
                    item-value="value"
                    outlined
                    dense
                    hide-details
                    v-model="dateOption"
                    class="custom-field"
                  ></v-select>
                </v-flex>

                <v-flex
                  xs12
                  md4
                  class="pa-1"
                  :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                  v-if="dateOption == 8"
                >
                  <v-select
                    :items="years"
                    label="Año"
                    placeholder="Seleccione un año"
                    outlined
                    dense
                    hide-details
                    v-model="selectYear"
                    class="custom-field"
                  ></v-select>
                </v-flex>

                <v-flex
                  xs12
                  md4
                  class="pa-1"
                  :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                  v-if="dateOption == 9"
                >
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="advObj.date"
                        label="Elija una fecha"
                        append-icon="mdi-calendar"
                        readonly
                        outlined
                        dense
                        v-bind="attrs"
                        v-on="on"
                        class="custom-field"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="advObj.date"
                      :min="minDate"
                      :max="maxDate"
                      @input="menu2 = false"
                      locale="es-MX"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>

                <v-flex
                  xs12
                  md4
                  class="pa-1"
                  :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                  v-if="dateOption == 7"
                >
                  <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="advObj.dateRange"
                        label="Elija la fecha inicial"
                        append-icon="mdi-calendar"
                        readonly
                        outlined
                        dense
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                        class="custom-field"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="advObj.dateRange"
                      :min="minDate"
                      :max="maxDate"
                      @input="menu1 = false"
                      locale="es-MX"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>

                <v-flex xs12 md4 class="pa-1" v-if="dateOption == 7">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="advObj.date"
                        label="Elija la fecha final"
                        append-icon="mdi-calendar"
                        readonly
                        outlined
                        dense
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                        class="custom-field"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="advObj.date"
                      :min="minDate"
                      :max="maxDate"
                      @input="menu2 = false"
                      locale="es-MX"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>

                <!-- <v-flex xs12 md4 class="pa-1" >
                  <v-btn block color="primary" @click="search()"
                    ><v-icon left>mdi-magnify</v-icon> Buscar</v-btn
                  >
                </v-flex> -->
                <v-flex xs12 md3 class="pa-1">
                  <v-text-field
                    label="Clave de archivo"
                    placeholder="Ingresa el número de la imagen"
                    outlined
                    dense
                    hide-details
                    v-model="advObj.key"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12 md3>
              <v-btn
                @click="$refs.editorImageEditMultipleDialog.openDialog()"
                :disabled="isSelected"
                block
                color="#1E2899"
                style="color: white"
                >Editar fotos</v-btn
              >
            </v-flex>

            <v-flex xs12 md3>
              <v-btn
                @click="$refs.editorImageDeleteMultipleDialog.openDialog()"
                :disabled="isSelected"
                block
                color="#1E2899"
                style="color: white"
                >Eliminar fotos</v-btn
              >
            </v-flex>
            <v-flex
              xs12
              md3
              class="pa-3 text-center"
              :class="$vuetify.breakpoint.smAndDown ? 'mr-5' : ''"
            >
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" v-bind="attrs" v-on="on" block>
                    <v-icon>
                      {{
                        sort == true
                          ? "mdi-sort-ascending"
                          : "mdi-sort-descending"
                      }}
                    </v-icon>
                    {{
                      sort == true
                        ? "De Reciente a Antiguo"
                        : "De Antiguo a Reciente"
                    }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="changeSort(false)">
                    <v-list-item-title>
                      De Antiguo a Reciente
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="changeSort(true)">
                    <v-list-item-title>
                      De Reciente a Antiguo
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-flex>
            <v-flex xs12 md3>
              <v-btn
                color="primary"
                block
                @click="selectedAllImages()"
                v-show="selectedall === false"
              >
                Marcar todos
              </v-btn>
              <v-btn
                color="primary"
                v-show="selectedall === true"
                @click="deselectAllImages()"
                block
              >
                Desmarcar todos
              </v-btn>
            </v-flex>
          </v-layout>

          <!---<Loader-card v-show="loading === true" />--->
          <LoaderSearchCard
            ref="LoaderSearchCard"
            @listencancelar="cancelarsearch()"
            v-show="loading === true"
          />
          <LoaderNoresultCard v-show="noresult === true" />

          <v-layout row wrap justify-center class="Paginator">
            <v-flex
              xs12
              md7
              v-show="
                loading === false && successdata === true && cancel != true
              "
            >
              <v-pagination
                v-model="page"
                :length="totalPages"
                :total-visible="$vuetify.breakpoint.mobile ? 5 : 10"
                @input="nextPage()"
              ></v-pagination>
            </v-flex>

            <v-flex
              xs12
              md2
              v-show="
                loading === false && successdata === true && cancel != true
              "
            >
              <v-select
                solo
                dense
                :items="pages"
                v-model="page"
                @input="nextPage()"
                hide-details
                style="width: 100px; margin: auto"
              ></v-select>
            </v-flex>

            <v-flex
              xs12
              md3
              :class="$vuetify.breakpoint.smAndDown ? 'mt-2 mb-2' : ''"
              class="pa-5"
              v-show="!loading"
            >
              <v-row
                :justify="$vuetify.breakpoint.smAndDown ? 'center' : 'end'"
              >
                <v-btn
                  v-for="(item, index) in totalResults"
                  :key="index"
                  class="mr-1"
                  fab
                  dark
                  small
                  :style="'color : ' + totalResultSelected[index].text"
                  :color="totalResultSelected[index].color"
                  @click="changeTotalResult(item)"
                >
                  {{ item }}
                </v-btn>
              </v-row>
            </v-flex>
          </v-layout>

          <v-layout
            row
            wrap
            v-show="loading === false && successdata === true && cancel != true"
          >
            <v-flex
              :class="
                $vuetify.breakpoint.mdAndUp
                  ? 'xs2'
                  : $vuetify.breakpoint.smAndUp
                  ? 'xs3'
                  : 'xs6'
              "
              v-for="(item, index) in showImage"
              v-bind:key="index"
            >
              <Editor-Search-Image-Card
                :image="imgPath + item.imageSrc"
                :imageTitle="item.description"
                :publicationName="
                  item.publicationRef != undefined
                    ? item.publicationRef.publicationName
                    : null
                "
                :notebookName="
                  item.noteBookRef != undefined
                    ? item.noteBookRef.NoteBookName
                    : null
                "
                :icon="
                  item.publicationRef != undefined
                    ? imgPath + item.publicationRef.icon
                    : null
                "
                :selectedall="selectedall"
                :date="
                  item.publicationDate != undefined
                    ? new Date(item.publicationDate).toISOString().substring(0, 10)
                    : null
                "
                :id="item._id"
                :imgSrc="item.imageSrc"
                :item="item"
              />
            </v-flex>
          </v-layout>

          <v-layout row wrap justify-center>
            <v-flex
              xs12
              md10
              v-show="
                loading === false && successdata === true && cancel != true
              "
            >
              <v-pagination
                v-model="page"
                :length="totalPages"
                :total-visible="$vuetify.breakpoint.mobile ? 5 : 10"
                @input="nextPage()"
              ></v-pagination>
            </v-flex>

            <v-flex
              xs12
              md2
              v-show="
                loading === false && successdata === true && cancel != true
              "
            >
              <v-select
                solo
                dense
                :items="pages"
                v-model="page"
                @input="nextPage()"
                hide-details
                style="width: 100px; margin: auto"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>

    <Editor-Image-Add-Dialog ref="addDialog" />
    <Editor-Image-Add-Multiple-Dialog ref="multipleDialog" />
    <Editor-Image-Edit-Dialog ref="editDialog" />
    <DeleteImageDialog ref="deleteImage" />
    <EditorImageDeleteMultipleDialog ref="editorImageDeleteMultipleDialog" />
    <EditorImageEditMultipleDialog ref="editorImageEditMultipleDialog" />
    <EditorImageAddFeaturedEventDialog
      ref="editorImageAddFeaturedEventDialog"
      :imgSrc="imgSrc"
    />
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";

import LoaderSearchCard from "~/components/LoaderSearchCard";
import LoaderNoresultCard from "~/components/LoaderNoresultcard.vue";
import EditorImageAddDialog from "~/components/editor/EditorImageAddDialog";
import EditorImageEditDialog from "~/components/editor/EditorImageEditDialog";
import EditorSearchImageCard from "~/components/editor/EditorSearchImageCard";
import DeleteImageDialog from "~/components/editor/EditorImageDeleteDialog";

import EditorImageAddMultipleDialog from "~/components/editor/EditorImageAddMultipleDialog";
import EditorImageDeleteMultipleDialog from "~/components/editor/EditorImageDeleteMultipleDialog";
import EditorImageEditMultipleDialog from "~/components/editor/EditorImageEditMultipleDialog";

import EditorImageAddFeaturedEventDialog from "~/components/editor/EditorImageAddFeaturedEventDialog";
import { orderNotebooks } from "~/static/functions";

export default {
  components: {
    LoaderSearchCard,
    LoaderNoresultCard,
    EditorImageAddDialog,
    EditorImageAddMultipleDialog,
    EditorImageEditDialog,
    EditorSearchImageCard,
    DeleteImageDialog,
    EditorImageDeleteMultipleDialog,
    EditorImageEditMultipleDialog,
    EditorImageAddFeaturedEventDialog,
  },
  data: () => ({
    successdata: null,
    cancel: false,
    loading: null,

    imgSrc: null,

    headers: [
      {
        text: "Título",
        align: "start",
        sortable: false,
        value: "title",
      },
      { text: "Subtítulo", value: "subTitle" },
      { text: "Publicación", value: "publicationRef.publicationName" },
      { text: "Cuaderno", value: "noteBookRef.NoteBookName" },
      { text: "Fecha de publicación	", value: "date" },
      { text: "Autor", value: "modifierAuthor" },
      { text: "Página", value: "page" },
      { text: "Acciones", align: "center", value: "action", sortable: false },
    ],
    select: [
      { text: "Cualquier fecha", value: "11" },
      { text: "Este año", value: "1" },
      { text: "Año anterior", value: "3" },
      { text: "Este més", value: "2" },
      { text: "Esta semana", value: "4" },
      { text: "Ayer", value: "5" },
      { text: "Hoy", value: "6" },
      { text: "Elegir periodo", value: "7" },
      { text: "Elegir año", value: "8" },
      { text: "Elegir día", value: "9" },
      { text: "Un día como", value: "10" },
    ],
    images: [],
    page: 1,
    pages: [],
    totalPages: 5,
    noresult: false,
    date: null,
    dateMenu: false,
    publications: [],
    notebooks: [],
    notebooks2: [],
    dateOption: null,
    menu1: false,
    menu2: false,
    selectYear: null,
    years: [],
    advObj: {
      search: "Imagenes",
      allwords: null,
      keywords: null,
      keysentence: null,
      publicationRef: null,
      noteBookRef: null,
      date: null,
      dateRange: null,
      key: null,
      firstTimeSearch: null,
      quantity: 1,
    },
    sort: true,
    imgPath: process.env.imgPath,

    selected: [],

    // savePage : [],
    isSelected: true,
    saveSearchedPage: [],
    showImage: [],
    selectedall: false,
    cargando: 0,
    elementsCounter: null,
    totalResultSelected: [
      { pressed: false, color: "white", text: "black" },
      { pressed: true, color: "primary", text: "white" },
      { pressed: false, color: "white", text: "black" },
      { pressed: false, color: "white", text: "black" },
    ],
    totalResults: [10, 20, 50, 100],
    totalResult2: 20,
    minDate: new Date("1960-01-01").toISOString(),
    maxDate: new Date().toISOString(),
  }),
  async created() {
    if (process.browser) {
      this.selectedall = false;
      this.getPublications();
      this.getNotebooks();
      this.getYears();

      /*this.loading = true;
      await this.getImages();
      this.getPublications();
      this.getNotebooks();
      this.getYears();

      for( let i = 1; i < this.saveSearchedPage.length; i++){
        if( typeof(this.saveSearchedPage[i]) == typeof([]) ){
          this.showImage.push(this.saveSearchedPage[i])
        }else{
          break;
        }
      }
      this.loading = false;
      await this.getPagination();*/
    }
  },
  // mounted() {
  //   this.search();
  // },
  computed: {
    ...mapState(["notebooksStore", "publicationsStore"]),
  },
  methods: {
    async changeTotalResult(newVal) {
      this.totalResult2 = newVal;
      this.advObj.quantity = 1;
      this.page = 1;
      this.search();
    },
    async getImages() {
      this.noresult = false;
      this.loading = true;
      const response = await this.$axios.$get("/AdvanceSearch", {
        params: {
          x: 0,
          search: this.advObj.search,
          allwords: this.advObj.allwords,
          keywords: this.advObj.keywords,
          keysentence: this.advObj.keysentence,
          publicationRef: this.advObj.publicationRef,
          noteBookRef: this.advObj.noteBookRef,
          date: this.advObj.date,
          dateRange: this.advObj.dateRange,
          key: this.advObj.key,
          firstTimeSearch: false,
          quantity: this.advObj.quantity,
          ordenamiento: this.sort,
          totalResults: this.totalResult2,
        },
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      let resultdata = [];
      resultdata = response.data.foundItems;
      this.images = resultdata;
      this.saveSearchedPage.push(this.page);
      this.images.forEach((x) => {
        x.selected = false;
        this.saveSearchedPage.push(x);
      });
      if (resultdata.length < 1) {
        this.successdata = false;
        this.noresult = true;
        console.log("No se encontro datos");
      } else {
        this.successdata = true;
      }

      // this.loading = false;
    },
    cancelarsearch() {
      this.loading = true;
      this.successdata = false;
      this.cancel = true;
      this.noresult = false;
      console.log("SE CANCELO LA BUSQUEDA");
    },
    async getPagination() {
      this.page = 1;
      const response = await this.$axios.$get("/AdvanceSearch", {
        params: {
          x: 0,
          search: this.advObj.search,
          allwords: this.advObj.allwords,
          keywords: this.advObj.keywords,
          keysentence: this.advObj.keysentence,
          publicationRef: this.advObj.publicationRef,
          noteBookRef: this.advObj.noteBookRef,
          date: this.advObj.date,
          dateRange: this.advObj.dateRange,
          key: this.advObj.key,
          firstTimeSearch: true,
          quantity: "",
          ordenamiento: this.sort,
          totalResults: this.totalResults2,
        },
        headers: { Authorization: "Bearer " + localStorage.token },
      });

      this.elementsCounter = response.data.CountImages ?? 0;

      if (this.elementsCounter < 1) {
        this.hasElements = false;
      }
      this.totalPages = Math.ceil(
        this.elementsCounter / this.totalResult2
      );

      this.generateArrayPages(this.totalPages);
      if (this.cancel == false) {
        this.loading = false;
      }
      //this.loading = false;
    },
    generateArrayPages(total) {
      this.pages = Array.from(Array(total + 1).keys());
      this.pages.shift();
    },
    async nextPage() {
      this.loading = true;
      let indexPag = null;
      this.saveSearchedPage.findIndex((x, index) => {
        if (x == this.page) {
          indexPag = index;
        }
      });

      if (indexPag != null) {
        this.showImage = [];

        for (let i = indexPag + 1; i < this.saveSearchedPage.length; i++) {
          if (typeof this.saveSearchedPage[i] == typeof []) {
            this.showImage.push(this.saveSearchedPage[i]);
          } else {
            break;
          }
        }
        setTimeout(() => {
          this.loading = false;
        }, 500);
      } else {
        this.showImage = [];
        this.advObj.quantity = this.page;
        await this.getImages();
        this.nextPage();
      }
    },
    colorstant(item) {
      if (item.subtittle == true) {
        return "background-color : #b3b3b3";
      }
      if (item.disable == true) {
        return "background-color : #b3b3b3";
      }
      return "";
    },
    async getPublications() {
      setTimeout(() => {
        this.publications = this.publicationsStore;
      }, 1000);
    },

    openEditDialog(id) {
      this.$refs.editDialog.openDialog(id);
    },
    openEditFeaturedEventDialog() {
      this.$refs.editorImageAddFeaturedEventDialog.openDialog("Hola");
    },
    getYears() {
      if (this.advObj.publicationRef == null) {
        const years = (back) => {
          const year = new Date().getFullYear();
          return Array.from({ length: back }, (v, i) => year - back + i + 1);
        };
        this.years = years(200);
        this.years = this.years.reverse();
      } else {
        try {
          const temp = this.publications.find(
            (el) => el._id == this.advObj.publicationRef
          );
          this.minDate = new Date("1860-01-01").toISOString().substring(0, 10);
          const oldYear = new Date("1860-01-01").getFullYear();
          // console.log(temp);
          // this.minDate = new Date(temp.minDate).toISOString().substring(0, 10);
          // const oldYear = new Date(temp.minDate).getFullYear();
          const years = (back) => {
            const year = new Date().getFullYear();
            return Array.from({ length: back }, (v, i) => year - back + i);
          };
          this.years = years(new Date().getFullYear() - oldYear);
          this.years = this.years.reverse();
        } catch (error) {
          console.log("This is error from publicationRef");
          console.log(error);
        }
      }
    },
    deleteImage(id) {
      this.$refs.deleteImage.openDialog(id);
    },
    async search() {
      this.saveSearchedPage = [];
      this.selected = [];
      this.showImage = [];
      this.cancel = false;
      this.$refs.LoaderSearchCard.resetcard();
      this.getImages();
      await this.getPagination();
      this.nextPage();
    },
    async changeSort(sort) {
      this.sort = sort;
      this.search();
      // await this.getImages();
      // this.nextPage();
      // await this.getPagination();
    },
    selectedAllImages() {
      this.loading = true;
      this.images.forEach((x, index) => {
        x.selected = true;
        this.selected.push(x);
      });
      this.loading = false;
      this.selectedall = true;
    },
    deselectAllImages() {
      this.loading = true;
      this.images.forEach((x, index) => {
        x.selected = false;
        //this.selected.splice( index, 1 );
      });
      this.selected = [];
      this.loading = false;
      this.selectedall = false;
    },
    async getNotebooks() {
      setTimeout(() => {
        this.notebooks = this.notebooksStore;
      }, 1000);
    },
  },
  watch: {
    publicationsStore(newValue){
      this.getPublications();
    },
    notebooksStore(newValue){
      this.getNotebooks();
    },
    totalResult2(newValue) {
      // //console.log( newValue )
      switch (newValue) {
        case 10:
          this.totalResultSelected[0] = {
            pressed: true,
            color: "primary",
            text: "white",
          };
          this.totalResultSelected[1] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[2] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[3] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          break;
        case 20:
          this.totalResultSelected[0] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[1] = {
            pressed: true,
            color: "primary",
            text: "white",
          };
          this.totalResultSelected[2] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[3] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          break;
        case 50:
          this.totalResultSelected[0] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[1] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[2] = {
            pressed: true,
            color: "primary",
            text: "white",
          };
          this.totalResultSelected[3] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          break;
        case 100:
          this.totalResultSelected[0] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[1] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[2] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[3] = {
            pressed: true,
            color: "primary",
            text: "white",
          };
          break;
      }
    },
    selected(newValue) {
      if (newValue.length > 1) {
        this.isSelected = false;
      } else {
        this.isSelected = true;
      }
    },
    dateOption(val) {
      // console.log('VIENDO EL VAL HOY');
      //  console.log(val);
      this.advObj.date = null;
      this.advObj.dateRange = null;

      switch (val) {
        case "1":
          console.log(new Date().getFullYear() + "-01-" + "01");
          console.log(new Date().getFullYear() + "-12-" + "31");
          this.advObj.dateRange = new Date().getFullYear() + "-01-" + "01";
          this.advObj.date = new Date().getFullYear() + "-12-" + "31";
          break;

        case "2":
          console.log(
            new Date(new Date().getFullYear(), new Date().getMonth())
              .toISOString()
              .substr(0, 10)
          );
          console.log(
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
              .toISOString()
              .substr(0, 10)
          );

          this.advObj.dateRange = new Date(
            new Date().getFullYear(),
            new Date().getMonth()
          )
            .toISOString()
            .substr(0, 10);
          this.advObj.date = new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          )
            .toISOString()
            .substr(0, 10);
          break;

        case "3":
          console.log(new Date().getFullYear() - 1 + "-12-" + "31");
          this.advObj.dateRange = new Date().getFullYear() - 1 + "-01-" + "01";
          this.advObj.date = new Date().getFullYear() - 1 + "-12-" + "31";
          break;

        case "4":
          console.log(moment().startOf("week").toISOString().substr(0, 10));
          console.log(moment().endOf("week").toISOString().substr(0, 10));
          this.advObj.dateRange = moment()
            .startOf("week")
            .toISOString()
            .substr(0, 10)
            .toString();
          this.advObj.date = moment()
            .endOf("week")
            .toISOString()
            .substr(0, 10)
            .toString();
          break;

        case "5":
          console.log(moment().subtract(1, "days").toISOString().substr(0, 10));
          this.advObj.dateRange = moment()
            .subtract(1, "days")
            .toISOString()
            .substr(0, 10)
            .toString();
          this.advObj.date = moment()
            .subtract(1, "days")
            .toISOString()
            .substr(0, 10);
          break;

        case "6":
          console.log(moment().toISOString().substr(0, 10));
          this.advObj.dateRange = moment()
            .toISOString()
            .substr(0, 10)
            .toString();
          this.advObj.date = moment().toISOString().substr(0, 10).toString();
          break;

        case "8":
          //console.log(this.selectYear + "-01-" + "01")
          //this.advObj.dateRange = this.selectYear + "-01-" + "01";
          //this.advObj.date = this.selectYear + "-12-" + "31";
          break;

        case "9":
          //this.advObj.dateRange = this.advObj.date;
          break;
        case "11":
          this.advObj.dateRange = null;
          this.advObj.date = null;
          break;
      }
    },
    selectYear(val) {
      console.log(val + "-01-" + "01");
      this.advObj.dateRange = val + "-01-" + "01";
      this.advObj.date = val + "-12-" + "31";
    },
    "advObj.date": function (val) {
      if (this.dateOption == "9") {
        this.advObj.dateRange = val;
      }
    },
    "advObj.publicationRef": function (newValue) {
      this.getYears();
      this.advObj.noteBookRef = null;
      this.notebooks2 = orderNotebooks(this.notebooks, newValue);
    },
  },
};
</script>
<style scoped>
.listItemTitleTrue {
  text-align: left !important;
  color: White !important;
  font-size: 15px !important;
}
.listItemTitleFalse {
  padding-left: 12px !important;
}
.v-btn--is-elevated-custom-byM {
  box-shadow: none !important;
  color: black !important;
}
</style>>
