<template>
  <div>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title> Notas </v-toolbar-title>

        <v-spacer />
        <v-chip class="mr-2" color="white" v-if="elementsCounter !== null">
          <strong> Total: {{ elementsCounter }} </strong>
        </v-chip>

        <v-btn
          class="mr-2"
          color="primary"
          @click="$refs.addDialog.openDialog()"
        >
          Crear nota
        </v-btn>
        <v-btn
          style="width: 200px"
          class="mr-2"
          color="secondary"
          @click="search()"
          ><v-icon left>mdi-magnify</v-icon> Buscar</v-btn
        >
      </v-toolbar>

      <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 class="pa-5">
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
                    :disabled="publications.length === 0"
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

                <!-- <v-flex xs12 md4 class="pa-1">
                  <v-select
                    label="Editar en"
                    outlined
                    dense
                    hide-details
                  ></v-select>
                </v-flex> -->
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

                <v-flex xs12 md4 class="pa-1">
                  <v-text-field
                    label="Palabra clave"
                    outlined
                    dense
                    hide-details
                    v-model="advObj.keywords"
                  ></v-text-field>
                </v-flex>

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

                <v-flex xs12 md4 class="pa-1">
                  <v-text-field
                    label="Clave de archivo"
                    placeholder="Ingresa el número de Nota"
                    outlined
                    dense
                    hide-details
                    v-model="advObj.key"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <!-- <v-layout row wrap>
                <v-flex xs12 md2 class="pa-1">
                  <v-spacer />

                  <v-btn block color="primary" @click="getNotes()"
                    ><v-icon left>mdi-magnify</v-icon> Buscar</v-btn
                  >
                </v-flex>
              </v-layout> -->
            </v-flex>

            <v-flex xs12 md3>
              <v-btn
                block
                color="#1E2899"
                style="color: white"
                @click="$refs.editorNoteEditMultipleDialog.openDialog()"
                :disabled="isSelected"
                >Editar Notas</v-btn
              >
            </v-flex>

            <v-flex xs12 md3>
              <v-btn
                block
                color="#1E2899"
                style="color: white"
                :disabled="isSelected"
                @click="$refs.editorNoteDeleteMultipleDialog.openDialog()"
                >Eliminar notas</v-btn
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
                  <v-btn color="primary" v-bind="attrs" v-on="on">
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
                @click="selectedAll()"
                v-show="selectedall === false"
                block
              >
                Marcar todos
              </v-btn>
              <v-btn
                color="primary"
                v-show="selectedall === true"
                @click="deselectAll()"
                block
              >
                Desmarcar todos
              </v-btn>
            </v-flex>
          </v-layout>

          <LoaderSearchCard
            ref="LoaderSearchCard"
            @listencancelar="cancelarsearch()"
            v-show="loading === true"
          />
          <LoaderNoresultCard v-show="noresult === true" />

          <v-layout row wrap justify-center>
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
            <!-- <v-flex
              xs12
              md2
              v-show="
                loading === false && successdata === true && cancel != true
              "
            >
              <p class="total">total notas: {{ elementsCounter }}</p>
            </v-flex> -->
          </v-layout>

          <v-layout
            v-show="loading === false && successdata === true && cancel != true"
          >
            <v-flex xs12>
              <client-only>
                <v-data-table
                  :headers="headers"
                  :items="showImage"
                  :items-per-page="totalResult2"

                  :sort-desc="false"
                  hide-default-footer
                  loading-text="Cargando... Por favor, espere"
                >
                  <template v-slot:[`item.selected`]="{ item }">
                    <v-checkbox
                      class="mt-0 ml-1"
                      hide-details
                      style="padding-top: 0.5rem"
                      v-model="item.selected"
                      @click="selectedNote(item)"
                    ></v-checkbox>
                  </template>
                  <template v-slot:[`item.title`]="{ item }">
                    <span>
                      {{ item.title.substring(0, 180) + "..." }}
                    </span>
                  </template>
                  <template v-slot:[`item.date`]="{ item }">
                    <span>
                      {{
                        new Date(item.date).toISOString().substring(8, 10) +
                        "-" +
                        getMonth(
                          new Date(item.date).toISOString().substring(5, 7)
                        ) +
                        "-" +
                        new Date(item.date).toISOString().substring(0, 4)
                      }}
                    </span>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-icon
                      class="mr-2"
                      @click="
                        $refs.editDialog.openDialog(
                          item,
                          new Date(item.date).toISOString().substring(0, 4)
                        )
                      "
                      >mdi-pencil</v-icon
                    >
                    <v-icon
                      class="mr-2"
                      @click="$refs.deleteDialog.openDialog(item)"
                      >mdi-delete</v-icon
                    >
                  </template>
                </v-data-table>
              </client-only>
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
    <v-dialog v-model="loadingSelected" persistent max-width="300">
      <v-card>
        <v-card-title>Advertencía</v-card-title>
        <v-card-text>Agregando a las notas seleccionadas</v-card-text>
      </v-card>
    </v-dialog>

    <Editor-Note-Add-Dialog ref="addDialog" />
    <EditorNoteEditDialog ref="editDialog" />
    <EditorNoteDeleteDialog ref="deleteDialog" />
    <EditorNoteDeleteMultipleDialog ref="editorNoteDeleteMultipleDialog" />
    <EditorNoteEditMultipleDialog ref="editorNoteEditMultipleDialog" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";

import LoaderSearchCard from "~/components/LoaderSearchCard";
import LoaderNoresultCard from "~/components/LoaderNoresultcard.vue";
import EditorNoteAddDialog from "~/components/editor/EditorNoteAddDialog";
import EditorNoteEditDialog from "~/components/editor/EditorNoteEditDialog";
import EditorNoteDeleteDialog from "~/components/editor/EditorNoteDeleteDialog";

import EditorNoteDeleteMultipleDialog from "~/components/editor/EditorNoteDeleteMultipleDialog.vue";
import EditorNoteEditMultipleDialog from "~/components/editor/EditorNoteEditMultiplesDialog.vue";
import { orderNotebooks } from '~/static/functions';


export default {
  components: {
    LoaderSearchCard,
    LoaderNoresultCard,
    EditorNoteAddDialog,
    EditorNoteEditDialog,
    EditorNoteDeleteDialog,
    EditorNoteDeleteMultipleDialog,
    EditorNoteEditMultipleDialog,
  },
  data: () => ({
    loading: null,
    successdata: null,
    cancel: false,
    headers: [
      { text: "", align: "center", value: "selected", sortable: false },
      {
        text: "Título",
        align: "start",
        sortable: false,
        value: "title",
      },
      { text: "Subtítulo", sortable: false, value: "subTitle" },
      // { text: "Publicación",  sortable: false, value: "publicationRef.publicationName" },
      { text: "Cuaderno", sortable: false, value: "noteBookRef.NoteBookName" },
      { text: "Fecha de publicación	", value: "date" },
      { text: "Autor", sortable: false, value: "originalAuthor" },
      { text: "Página", value: "page" },
      {
        text: "Acciones",
        sortable: false,
        align: "center",
        value: "action",
        sortable: false,
      },
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
    notes: [],
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
      search: "Notas",
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
    elementsCounter: null,
    sort: true,
    minDate: "1864-01-01",
    maxDate: new Date().getFullYear() + "-12-31",
    totalresult: 0,
    totalResultSelected: [
      { pressed: false, color: "white", text: "black" },
      { pressed: true, color: "primary", text: "white" },
      { pressed: false, color: "white", text: "black" },
      { pressed: false, color: "white", text: "black" },
    ],
    totalResults: [10, 20, 50, 100],
    totalResult2: 20,
    selected: [],

    // savePage : [],
    isSelected: true,
    saveSearchedPage: [],
    showImage: [],

    loadingSelected: false,
    checkAll: false,
    selectedall: false,
    minDate: new Date("1960-01-01").toISOString(),
    maxDate: new Date().toISOString(),
  }),
  async created() {
    if (process.browser) {
      this.selectedall = false;
      this.getPublications();
      await this.getNotebooks();
      this.getYears();
      // this.search();
      /*this.loading = true;
      await this.getNotes();


      for( let i = 1; i < this.saveSearchedPage.length; i++){
        // console.log('AAAAAAAA')
        if( typeof(this.saveSearchedPage[i]) == typeof([]) ){
          this.showImage.push(this.saveSearchedPage[i])
        }else{
          break;
        }
      }
      console.log(this.showImage)
      this.loading = false;
      this.getPagination();
      this.totalPages = 100;
      this.generateArrayPages(this.totalPages);*/
    }
  },
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
    async getNotes() {
      this.noresult = false;
      this.loading = true;

      try {
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
        this.notes = resultdata;
        //console.log(this.notes)
        this.saveSearchedPage.push(this.page);
        this.notes.forEach((x) => {
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
      } catch (error) {
        console.log(error.response);
      }
    },

    async getPagination() {
      try {
        // this.loading = false
        this.pages = [];
        this.totalPages = 1;
        this.page = 1;
        // this.elementsCounter = '"Contando"';
        // const axiosSource = this.$axios.CancelToken.source();
        // this.request2 = { cancel: axiosSource.cancel, msg: "Loading..." };
        let response;
        if (
          this.advObj.allwords ||
          this.advObj.keysentence ||
          this.advObj.keywords ||
          this.advObj.ignoredwords
        ) {
          let auxdate = this.advObj.date;
          let auxdaterange = this.advObj.dateRange;
          this.advObj.date = this.advObj.date
            ? this.advObj.date
            : new Date("2015-12-31");
          this.advObj.dateRange = this.advObj.dateRange
            ? this.advObj.dateRange
            : new Date("2015-01-01");
          const aux0 = auxdate ? auxdate.split("-") : ["2015"];
          let auxdate2 = aux0[0];
          let totalfound = 0;
          let fianlresponse;
          let forend = auxdaterange ? auxdaterange.split("-") : [1988];
          //for(let i=0;i<100;i++){
          //  this.advObj.date = auxdate2+'-12-31'
          //  this.advObj.dateRange = auxdate2+'-01-01'
          let responseaux = await this.$axios.$get("/AdvanceSearch", {
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
              firstTimeSearch: true,

              quantity: "",
              ordenamiento: this.sort,
              searchId: localStorage.user_idC,
              quantity: this.advObj.quantity,
              totalResults: this.totalResult2,
            },
            headers: { Authorization: "Bearer " + localStorage.token },
            // cancelToken : axiosSource.token,
          });
          totalfound =
            Number(totalfound) + (Number(responseaux.data.CountNotes) || 0);
          // totalfound = Number(totalfound) + (Number(responseaux.data.CountImages) || 0)
          // totalfound = Number(totalfound) + (Number(responseaux.data.Countpdfs) || 0)
          this.elementsCounter = totalfound + " Buscando ";
          auxdate2 = auxdate2 - 1;
          //Math.ceil(this.elementsCounter / 20)
          this.totalPages =
            Math.ceil(Number(totalfound) / this.totalResult2) > 0
              ? Math.ceil(Number(totalfound) / this.totalResult2)
              : 1;
          this.generateArrayPages(this.totalPages);
          // this.loading = false;
          // this.generateArrayPages(Number(totalfound))
          //    i = (auxdate2 < Number(forend[0]) ) ? 101 : i
          //  }
          response = {
            data: {
              // CountImages: totalfound,
              CountNotes: totalfound,
              // Countpdfs: totalfound,
            },
          };
          this.advObj.dateRange = auxdaterange;
          this.advObj.date = auxdate;
        } else {
          // this.loading = false;
          response = await this.$axios.$get("/AdvanceSearch", {
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
              searchId: localStorage.user_idC,
              totalResults: this.totalResult2,
              quantity: this.advObj.quantity,
            },
            // timeout: 30,
            headers: { Authorization: "Bearer " + localStorage.token },
            // cancelToken : axiosSource.token,
          });
        }
        this.elementsCounter =
          response.data.CountNotes != null &&
          response.data.CountNotes != undefined
            ? response.data.CountNotes
            : 0;

        if (this.elementsCounter > 0) {
          this.hasElements = true;
        } else {
          this.hasElements = false;
        }
        //this.totalPages = Math.ceil(response.data.CountNotes / 20);
        this.totalPages =
          this.elementsCounter > this.totalResult2
            ? Math.ceil(this.elementsCounter / this.totalResult2)
            : 1;
        this.totalPages =
          this.totalPages != null && this.totalPages != undefined
            ? this.totalPages
            : 1;
        this.generateArrayPages(this.totalPages);
        if (this.cancel == false) {
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
        console.log(error.response);
        // this.elementsCounter = 0;
      }
    },
    generateArrayPages(total) {
      this.pages = Array.from(Array(total + 1).keys());
      this.pages.shift();
    },
    async nextPage() {
      this.checkAll = false;
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
        }, 300);
      } else {
        this.showImage = [];
        this.advObj.quantity = this.page;
        await this.getNotes();
        this.nextPage();
      }
    },
    cancelarsearch() {
      this.loading = true;
      this.successdata = false;
      this.cancel = true;
      this.noresult = false;
      console.log("SE CANCELO LA BUSQUEDA");
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
    getPublications() {
      setTimeout(() => {
        this.publications = this.publicationsStore;
      }, 1000);

    },
    getNotebooks() {
      setTimeout(() => {
        this.notebooks = this.notebooksStore;
      }, 1000);
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
        const temp = this.publications.find(
          (el) => el._id == this.advObj.publicationRef
        );
        try {
          this.minDate = new Date("1860-01-01").toISOString().substring(0, 10);
          const oldYear = new Date("1860-01-01").getFullYear();
          // this.minDate = new Date(temp.minDate).toISOString().substring(0, 10);
          // const oldYear = new Date(temp.minDate).getFullYear();
          const years = (back) => {
            const year = new Date().getFullYear();
            return Array.from({ length: back }, (v, i) => year - back + i);
          };
          this.years = years(new Date().getFullYear() - oldYear);
          this.years = this.years.reverse();
        } catch (error) {
          console.log("This is error date from publicationRef");
          console.log(error);
        }
      }
    },
    async search() {
      this.saveSearchedPage = [];
      this.selected = [];
      this.showImage = [];
      // console.log(1)
      this.cancel = false;
      this.$refs.LoaderSearchCard.resetcard();

      // await Promise.allSettled([
      this.getNotes();
      await this.getPagination()
        // ]);
      // console.log(3)
      this.nextPage();
      // console.log(4)
    },
    async changeSort(sort) {
      this.sort = sort;

      // await Promise.allSettled([


        this.search();
    },
    selectedNote(item) {
      console.log(item);
      this.loadingSelected = true;
      if (item.selected == true) {
        this.selected.push(item);
      } else {
        this.selected.forEach((x, index) => {
          if (x._id == item._id) {
            this.selected.splice(index, 1);
          }
        });
      }

      this.loadingSelected = false;
    },
    selectedAll() {
      this.loadingSelected = true;
      console.log("selectedAll");
      this.notes.forEach((x, index) => {
        x.selected = true;
        this.selected.push(x);
      });
      this.loadingSelected = false;
      this.selectedall = true;
    },
    deselectAll() {
      this.loadingSelected = true;
      console.log("deselectedAll");
      this.notes.forEach((x, index) => {
        x.selected = false;
        //this.selected.splice( index, 1 );
      });
      this.selected = [];
      this.loadingSelected = false;
      this.selectedall = false;
    },
    getMonth(month) {
      let months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      return months[parseInt(month - 1)];
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
    showImage(newValue) {
      let count = 0;
      newValue.forEach((x, i) => {
        if (x.selected == true) {
          count++;
        }
      });
      if (count == newValue.length) {
        this.totalresult = count;
        this.checkAll = true;
      } else {
        this.checkAll = false;
        this.totalresult = 0;
      }
    },
    dateOption(val) {
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
.total {
  font-weight: 600;
  font-size: 18px;
}
</style>>
