<template>
  <div>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title> PDFs </v-toolbar-title>

        <v-spacer />

        <v-chip class="mr-2" color="white" v-if="elementsCounter !== null">
          <strong> Total: {{ elementsCounter }} </strong>
        </v-chip>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" class="mr-2" v-bind="attrs" v-on="on">
              Crear PDF
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="$refs.addDialog.openDialog(1)">
              <v-list-item-title> Un PDF </v-list-item-title>
            </v-list-item>

            <v-list-item @click="$refs.addMultipleDialog.openDialog(2)">
              <v-list-item-title> Multiples PDFS </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          style="width: 200px"
          class="mr-2"
          color="secondary"
          @click="search()"
          ><v-icon left>mdi-magnify</v-icon> Buscar</v-btn
        >

        <!-- <v-btn color="primary" @click="$refs.addDialog.openDialog()">
          Crear PDF
        </v-btn> -->
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

                <!-- <v-flex xs12 md3 class="pa-1">
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
                    placeholder="Ingresa el número de PDF"
                    outlined
                    dense
                    hide-details
                    v-model="advObj.key"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <!-- <v-layout row wrap>
                <v-flex xs12 md3 class="pa-1">
                  <v-btn block color="grey lighten-2"
                    ><v-icon left>mdi-magnify</v-icon> Lista descargas</v-btn
                  >
                </v-flex>

                <v-flex xs12 md3 class="pa-1">
                  <v-btn block color="grey lighten-2"
                    ><v-icon left>mdi-magnify</v-icon> Uso del CC</v-btn
                  >
                </v-flex>

                <v-flex xs12 md3 class="pa-1">
                  <v-btn block color="primary" @click="search()"
                    ><v-icon left>mdi-magnify</v-icon> Buscar</v-btn
                  >
                </v-flex>
              </v-layout> -->
            </v-flex>

            <v-flex xs12 md3>
              <v-btn
                @click="$refs.eDitorEditMultipleDialog.openDialog()"
                :disabled="isSelected"
                block
                color="#1E2899"
                style="color: white"
                >Editar PDFs</v-btn
              >
            </v-flex>

            <v-flex xs12 md3>
              <v-btn
                @click="$refs.editorDeleteMultiplePDF.openDialog()"
                :disabled="isSelected"
                block
                color="#1E2899"
                style="color: white"
                >Eliminar PDFs</v-btn
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
                        sort == 10
                          ? ""
                          : sort == -1
                          ? "mdi-sort-ascending"
                          : "mdi-sort-descending"
                      }}
                    </v-icon>
                    {{
                      sort == 10
                        ? "Ordenar por"
                        : sort == -1
                        ? "De Reciente a Antiguo"
                        : "De Antiguo a Reciente"
                    }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="changeSort(1)">
                    <v-list-item-title>
                      De Antiguo a Reciente
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="changeSort(-1)">
                    <v-list-item-title>
                      De Reciente a Antiguo
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="changeSort(10)">
                    <v-list-item-title> Sin orden </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-flex>
            <v-flex xs12 md3>
              <v-btn
                color="primary"
                @click="selectedAll()"
                v-show="seleccionatodo === false"
                block
              >
                Marcar todos
              </v-btn>
              <v-btn
                color="primary"
                v-show="seleccionatodo === true"
                block
                @click="deselectAll()"
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
              <Editor-Search-PDF-Card
                :image="imgPath + item.imageSrc"
                :title="
                  item.title != undefined ? item.title.substring(0, 20) : ''
                "
                :notebookName="
                  item.notebook != undefined ? item.notebook.NoteBookName : null
                "
                :icon="
                  item.publication != undefined
                    ? imgPath + item.publication.icon
                    : null
                "
                :seleccionatodo="seleccionatodo"
                :date="
                  item.dateCreation != undefined
                    ? new Date(item.dateCreation).toISOString().substring(0, 10)
                    : null
                "
                :id="item._id"
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

    <Editor-PDF-Add-Dialog ref="addDialog" />
    <EditorPDFAddMultipleDialog ref="addMultipleDialog" />
    <EditorPDFEditDialog ref="editPDFDialog" />
    <EditorDeletePDFDialog ref="deleteDialog" />
    <EditorDeleteMultiplePDF ref="editorDeleteMultiplePDF" />
    <EDitorEditMultipleDialog ref="eDitorEditMultipleDialog" />
  </div>
</template>

<script>
import moment from "moment";

import LoaderSearchCard from "~/components/LoaderSearchCard.vue";
import LoaderNoresultCard from "~/components/LoaderNoresultcard.vue";
import EditorPDFAddDialog from "~/components/editor/EditorPDFAddDialog";
import EditorPDFAddMultipleDialog from "~/components/editor/EditorPDFAddMultipleDialog";
import EditorPDFEditDialog from "~/components/editor/EditorPDFEditDialog";
import EditorSearchPDFCard from "~/components/editor/EditorSearchPDFCard";
import EditorDeletePDFDialog from "~/components/editor/EditorPDFDeleteDialog";
import EditorDeleteMultiplePDF from "~/components/editor/EditorPDFDeleteMultipleDialog";
import EDitorEditMultipleDialog from "~/components/editor/EditorPDFEditMultipleDialog";

export default {
  components: {
    LoaderSearchCard,
    LoaderNoresultCard,
    EditorPDFAddDialog,
    EditorSearchPDFCard,
    EditorPDFAddMultipleDialog,
    EditorPDFEditDialog,
    EditorDeletePDFDialog,
    EditorDeleteMultiplePDF,
    EDitorEditMultipleDialog,
  },
  data: () => ({
    loading: null,
    successdata: null,
    cancel: false,
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
    pdfs: [],
    page: 1,
    noresult: false,
    pages: [],
    totalPages: 5,
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
      search: "PDFs",
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
    sort: 10,
    imgPath: process.env.imgPath,

    selected: [],
    isSelected: true,
    saveSearchedPage: [],
    showImage: [],
    seleccionatodo: false,
    elementsCounter: null,
    minDate: new Date('1960-01-01').toISOString(),
    maxDate: new Date().toISOString()
  }),
  async created() {
    if (process.browser) {
      this.seleccionatodo = false;
      this.getPublications();
      this.getNotebooks();
      this.getYears();
      /*this.loading = true;
      await this.getPDFs();
      this.getPublications();
      this.getNotebooks();
      this.getYears();
      for( let i = 1; i < this.saveSearchedPage.length; i++){
        if( typeof(this.saveSearchedPage[i]) == typeof([])){
          this.showImage.push( this.saveSearchedPage[i] );
        }else{
          break;
        }
      }
      this.loading = false;
      await this.getPagination();*/
    }
  },
  methods: {
    async getPDFs() {
      this.noresult = false;
      this.loading = true;
      console.log("SE ESTA EJECUTANDO getPDFs()");
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
          extended: false,
          firstTimeSearch: false,
          quantity: this.advObj.quantity,
          ordenamiento: this.sort,
        },
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      let resultdata = [];
      resultdata = response.data.foundItems;
      // console.log(resultdata)
      this.pdfs = resultdata;
      this.saveSearchedPage.push(this.page);
      this.pdfs.forEach((x) => {
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
      this.successdata = false;
      this.cancel = true;
      this.loading = true;
      this.noresult = false;
      console.log("SE CANCELO LA BUSQUEDA");
    },
    openEditDialog(id) {
      this.$refs.editPDFDialog.openDialog(id);
    },
    // async getPagination() {
    //   this.page = 1;
    //   //console.log(JSON.parse(atob(this.$route.query.search)));
    //   const response = await this.$axios.$get("/AdvanceSearch", {
    //     params: {
    //       x: 0,
    //       search: this.advObj.search,
    //       allwords: this.advObj.allwords,
    //       keywords: this.advObj.keywords,
    //       keysentence: this.advObj.keysentence,
    //       publicationRef: this.advObj.publicationRef,
    //       noteBookRef: this.advObj.noteBookRef,
    //       date: this.advObj.date,
    //       dateRange: this.advObj.dateRange,
    //       key: this.advObj.key,
    //       firstTimeSearch: true,
    //       quantity: "",
    //       ordenamiento: this.sort,
    //     },
    //     headers: { Authorization: "Bearer " + localStorage.token },
    //   });
    //   //console.log(response);

    //   this.elementsCounter = response.data.Countpdfs;
    //   if (this.elementsCounter < 1) {
    //     this.hasElements = false;
    //   }
    //   this.totalPages = Math.ceil(response.data.Countpdfs / 20);
    //   this.generateArrayPages(this.totalPages);
    //   this.loading = false;
    // },
    async getPagination() {
      try {
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
          // for(let i=0;i<100;i++){
          // this.advObj.date = auxdate2+'-12-31'
          // this.advObj.dateRange = auxdate2+'-01-01'
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
              extended: false,
              quantity: "",
              ordenamiento: this.sort,
              searchId: localStorage.user_idC,
              totalResults: 20,
            },
            headers: { Authorization: "Bearer " + localStorage.token },
            // cancelToken : axiosSource.token,
          });
          // totalfound = Number(totalfound) + (Number(responseaux.data.CountNotes) || 0)
          // totalfound = Number(totalfound) + (Number(responseaux.data.CountImages) || 0)
          totalfound =
            Number(totalfound) + (Number(responseaux.data.Countpdfs) || 0);
          this.elementsCounter = totalfound + " Buscando ";
          auxdate2 = auxdate2 - 1;
          //Math.ceil(this.elementsCounter / 20)
          this.totalPages =
            Math.ceil(Number(totalfound) / 20) > 0
              ? Math.ceil(Number(totalfound) / 25)
              : 1;
          this.generateArrayPages(this.totalPages);
          if (this.cancel == false) {
            this.loading = false;
          }
          // this.generateArrayPages(Number(totalfound))
          // i = (auxdate2 < Number(forend[0]) ) ? 101 : i
          // }
          response = {
            data: {
              // CountImages: totalfound,
              // CountNotes: totalfound,
              Countpdfs: totalfound,
            },
          };
          this.advObj.dateRange = auxdaterange;
          this.advObj.date = auxdate;
        } else {
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
              totalResults: 20,
            },
            // timeout: 30,
            headers: { Authorization: "Bearer " + localStorage.token },
            // cancelToken : axiosSource.token,
          });
        }
        this.elementsCounter =
          response.data.Countpdfs != null &&
          response.data.Countpdfs != undefined
            ? response.data.Countpdfs
            : 0;

        if (this.elementsCounter > 0) {
          this.hasElements = true;
        } else {
          this.hasElements = false;
        }
        //this.totalPages = Math.ceil(response.data.CountNotes / 20);
        this.totalPages =
          this.elementsCounter > 20 ? Math.ceil(this.elementsCounter / 20) : 1;
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
        await this.getPDFs();
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
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      let publicationsAux = response.data.publicaciones;

      publicationsAux.sort(function (a, b) {
        return a.orden - b.orden;
      });
      publicationsAux.splice(0, 0, {
        publicationName: "Todas las publicaciones",
        status: true,
        _id: null,
      });
      publicationsAux.splice(1, 0, {
        publicationName: "Medios Tradicionales",
        status: false,
        _id: "Megamedia Editorial",
        disable: true,
      });
      publicationsAux.splice(6, 0, {
        publicationName: "La Factoría",
        status: false,
        _id: "La Factoría",
        disable: true,
      });
      publicationsAux.splice(11, 0, {
        publicationName: "Medios ligeros",
        status: false,
        _id: "Medios ligeros",
        disable: true,
      });
      publicationsAux.splice(15, 0, {
        publicationName: "Otras publicaciones",
        status: false,
        _id: "Otras publicaciones",
        disable: true,
      }); //console.log(publicationsAux)
      this.publications = publicationsAux;
    },
    async getNotebooks() {
      const response = await this.$axios.$get("/NoteBooks", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.notebooks = response.data.notebooks;
      let newObjetVoidT = [];
      let newObjetVoidF = [];

      this.notebooks.forEach((x, index) => {
        if (x.status == true) {
          newObjetVoidT.push(x);
        }
      });

      newObjetVoidT.sort(function (a, b) {
        if (a.order > b.order) {
          return 1;
        }
        if (a.order < b.order) {
          return -1;
        }
        return 0;
      });

      newObjetVoidT.unshift({
        NoteBookName: "Vigente",
        status: true,
        _id: "NO-VALIDO",
        disable: true,
      });
      newObjetVoidT.unshift({
        NoteBookName: "Todos los cuadernos",
        status: true,
        _id: null,
      });

      this.notebooks.forEach((x, index) => {
        if (x.status == false) {
          newObjetVoidF.push(x);
        }
      });

      newObjetVoidF.sort(function (a, b) {
        if (a.order > b.order) {
          return 1;
        }
        if (a.order < b.order) {
          return -1;
        }
        return 0;
      });

      newObjetVoidF.unshift({
        NoteBookName: "No vigente",
        status: false,
        _id: "NOVALIDO",
        disable: true,
      });

      this.notebooks = [];

      newObjetVoidT.forEach((x) => {
        this.notebooks.push(x);
      });
      newObjetVoidF.forEach((x) => {
        this.notebooks.push(x);
      });
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
          // minDate: "1864-01-01",
          this.minDate = new Date('1860-01-01').toISOString().substring(0, 10);
          const oldYear = new Date('1860-01-01').getFullYear();
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
    deletePDF(id) {
      this.$refs.deleteDialog.openDialog(id);
    },
    async search() {
      this.saveSearchedPage = [];
      this.selected = [];
      this.showImage = [];
      this.page = 1;
      this.advObj.quantity = 1;
      this.cancel = false;
      this.$refs.LoaderSearchCard.resetcard();
      await this.getPDFs();
      this.nextPage();
      await this.getPagination();
    },
    async changeSort(sort) {
      this.sort = sort;
      this.advObj.quantity = 1;
      this.page = 1;
      this.cancel = false;
      await this.getPDFs();
      this.nextPage();
      await this.getPagination();
    },
    selectedAll() {
      this.loading = true;
      this.pdfs.forEach((x, index) => {
        x.selected = true;
        this.selected.push(x);
      });
      this.loading = false;
      this.seleccionatodo = true;
    },
    deselectAll() {
      this.loading = true;
      this.pdfs.forEach((x, index) => {
        x.selected = false;
        //this.selected.splice( index, 1 );
      });
      this.selected = [];
      this.loading = false;
      this.seleccionatodo = false;
    },
  },
  // mounted() {
  //   this.search();
  // },
  watch: {
    publicationsStore(newValue){
      this.getPublications();
    },
    notebooksStore(newValue){
      this.getNotebooks();
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
      // console.log(val);
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
      for (let i = 0; i < this.publications.length; i++) {
        if (newValue == this.publications[i]._id) {
          this.icon = this.publications[i].icon;
        }
      }
      this.notebooks2 = [];
      this.notebooks.forEach((x) => {
        if (x.PublicationReference && x.PublicationReference._id == newValue) {
          this.notebooks2.push(x);
        }
      });
      if (this.notebooks2.length == 0) {
        this.notebooks2.push({
          NoteBookName: "No se encontraron cuadernos",
          status: true,
          _id: "NO-VALIDO",
          disable: true,
        });
      } else {
        let newObjetVoidT = [];
        let newObjetVoidF = [];

        this.notebooks2.forEach((x, index) => {
          if (x.status == true) {
            newObjetVoidT.push(x);
          }
        });

        newObjetVoidT.sort(function (a, b) {
          if (a.order > b.order) {
            return 1;
          }
          if (a.order < b.order) {
            return -1;
          }
          return 0;
        });

        newObjetVoidT.unshift({
          NoteBookName: "Vigente",
          status: true,
          _id: "NO-VALIDO",
          disable: true,
        });
        //newObjetVoidT.unshift({ NoteBookName : 'Todos los cuadernos', status : true, _id : null});

        this.notebooks2.forEach((x, index) => {
          if (x.status == false) {
            newObjetVoidF.push(x);
          }
        });

        newObjetVoidF.sort(function (a, b) {
          if (a.order > b.order) {
            return 1;
          }
          if (a.order < b.order) {
            return -1;
          }
          return 0;
        });

        newObjetVoidF.unshift({
          NoteBookName: "No vigente",
          status: false,
          _id: "NOVALIDO",
          disable: true,
        });

        this.notebooks2 = [];

        newObjetVoidT.forEach((x) => {
          this.notebooks2.push(x);
        });
        newObjetVoidF.forEach((x) => {
          this.notebooks2.push(x);
        });
      }

      this.notebooks2.unshift({
        NoteBookName: "Todos los cuadernos",
        status: true,
        _id: null,
      });
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
</style>
