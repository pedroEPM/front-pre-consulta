<template>
  <div>
    <v-dialog
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
      v-model="dialog"
    >
      <v-card>
        <v-card-title class="pa-0">
          <v-toolbar dark color="primary">
            <v-icon> mdi-image </v-icon>
            <v-spacer />
            <v-toolbar-title>Edición de documento PDF</v-toolbar-title>
            <v-spacer />
            <v-btn icon dark @click="dialog = false">
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-xl>
            <v-layout row wrap>
              <v-flex xs12 md8>
                <v-card outlined>
                  <v-form ref="formPDF">
                    <v-card-text>
                      <v-text-field
                        outlined
                        label="Título"
                        v-model="title"
                        counter="98800"
                        :rules="
                          dialog != false
                            ? validations.caracterLength
                            : validations.noRules
                        "
                      ></v-text-field>
                      <v-img
                        :src="image"
                        @error="errorHandler"
                        :lazy-src="image"
                        @click="openSelect = true"
                        style="cursor: pointer"
                        contain
                        height="400"
                        class="mb-3"
                      ></v-img>

                      <!-- <v-textarea
                          outlined
                          label="Observaciones"
                          height="5rem"
                          v-model="observations"
                        ></v-textarea> -->
                    </v-card-text>
                  </v-form>
                </v-card>
                <v-card outlined>
                  <v-form ref="formPDF">
                    <!-- <v-card-text>
                      <h3>Editar imagenes de PDF *opcional*</h3>
                      <br />
                      <v-file-input
                        v-model="imgthumbnail"
                        outlined
                        label="Ingrese la imagen para thumbnail"
                        counter
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small>
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
                      <v-card-text>
                        <v-layout row wrap justify-center>
                          <v-flex xs12 md6>
                            <v-card elevation="1" v-if="imgthumbnail != null">
                              <v-img
                                style="max-height: 100px"
                                :src="imgthumbnailSRC"
                                contain
                                imgPreview
                              ></v-img>
                            </v-card>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                      <v-file-input
                        v-model="imgcalidad"
                        outlined
                        label="Ingrese la imagen alta calidad"
                        counter
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small>
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
                      <v-layout row wrap justify-center>
                        <v-flex xs12 md6>
                          <v-card v-if="imgthumbnail != null" elevation="1">
                            <v-img
                              style="max-height: 150px"
                              :src="imgcalidadSRC"
                              contain
                              imgPreview
                            ></v-img>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-card-text> -->
                  </v-form>
                </v-card>
              </v-flex>

              <v-flex xs12 md4>
                <v-card outlined>
                  <v-card-title>Información</v-card-title>
                  <v-card-text>
                    <v-form ref="form">
                      <v-select
                        :items="publications"
                        label="Publicación"
                        placeholder="Seleccione una opción"
                        item-text="publicationName"
                        item-value="_id"
                        outlined
                        dense
                        v-model="publicationRef"
                        class="custom-field mb-4"
                        hide-details
                        :rules="validations.fieldRules"
                        item-disabled="disable"
                      >
                        <template v-slot:item="{ item, attrs, on }">
                          <v-list-item
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
                                item.disable == true
                                  ? ''
                                  : 'padding-left : 10px'
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

                      <v-select
                        :items="publicationRef != null ? noteBooks2 : noteBooks"
                        label="Cuaderno"
                        placeholder="Seleccione una opción"
                        item-text="NoteBookName"
                        item-value="_id"
                        outlined
                        dense
                        v-model="notebookRef"
                        class="custom-field mb-4"
                        :rules="validations.fieldRules"
                        hide-details
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

                      <v-select
                        label="Página"
                        placeholder="Seleccione una opción"
                        outlined
                        dense
                        v-model="page"
                        :items="pages"
                        hide-details
                        class="mb-4"
                      ></v-select>

                      <v-combobox
                        label="Director"
                        placeholder="Seleccione una opción"
                        outlined
                        dense
                        v-model="director"
                        :items="directors"
                        hide-details
                        class="mb-4"
                      ></v-combobox>

                      <!---   <v-text-field
                        label="Lugar"
                        outlined
                        dense
                        v-model="place"
                        class="mb-4"
                        hide-details
                      ></v-text-field>--->

                      <!---   <v-text-field
                        label="Serie local"
                        outlined
                        dense
                        v-model="localSeries"
                        class="mb-4"
                        hide-details
                      ></v-text-field>--->

                      <!----  <v-text-field
                        label="Píe de imprenta"
                        outlined
                        dense
                        v-model="imprint"
                        class="mb-4"
                        hide-details
                      ></v-text-field>--->

                      <!-- <v-select
                        label="Clasificación"
                        placeholder="Seleccione una opción"
                        :items="clasifications"
                        item-text="name"
                        item-value="_id"
                        v-model="clasificationRef"
                        outlined
                        dense
                        :rules="validations.fieldRules"
                        class="mb-4"
                        hide-details
                      ></v-select> -->

                      <!-- <v-select
                        label="Agencia"
                        placeholder="Seleccione una opción"
                        :items="PublishingAgency"
                        item-text="name"
                        item-value="_id"
                        v-model="PublishingAgencyRef"
                        outlined
                        dense
                        :rules="validations.fieldRules"
                        class="mb-4"
                        hide-details
                      ></v-select> -->

                      <!-- <v-select
                        label="Fotógrafo"
                        placeholder="Seleccione una opción"
                        :items="Photographers"
                        item-text="name"
                        item-value="_id"
                        v-model="PhotographerRef"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                      ></v-select> -->

                      <!-- <v-text-field
                        label="Fotógrafo externo"
                        outlined
                        dense
                        v-model="externalPhotographer"
                        class="mb-4"
                        hide-details
                        readonly
                      ></v-text-field> -->

                      <!-- <v-select label="Material" outlined dense class="mb-4" hide-details></v-select> -->

                      <!-- <v-text-field
                        label="Periodicidad"
                        outlined
                        dense
                        v-model="periodicity"
                        class="mb-4"
                        hide-details
                      ></v-text-field> -->

                      <!---     <v-text-field
                        label="Idioma"
                        outlined
                        dense
                        v-model="language"
                        class="mb-4"
                        hide-details
                      ></v-text-field> --->

                      <v-menu
                        v-model="dateMenu1"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="creationDate"
                            label="Fecha de publicación"
                            append-icon="mdi-calendar"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                            class="mb-4"
                            required
                            hide-details
                            :rules="validations.fieldRules"
                            item-disabled="disable"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="creationDate"
                          @input="dateMenu1 = false"
                          :min="'1800-01-01'"
                          locale="es-MX"
                        ></v-date-picker>
                      </v-menu>

                      <!-- <v-text-field
                        label="Nota relacionada"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                        v-model="relatedNote"
                      ></v-text-field>

                      <v-text-field
                        label="Imagen relacionada"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                        v-model="relatedImage"
                      ></v-text-field> -->
                      <!----
                       <v-menu
                        v-model="dateMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="publicationDate"
                            label="Soy una prueba de fecha validada"
                            append-icon="mdi-calendar"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                            :rules="validations.fieldRules"
                            class="mb-4"
                            hide-details
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="publicationDate"
                          @input="dateMenu = false"
                          :min="'1800-01-01'"
                        ></v-date-picker>
                      </v-menu>
                          --->
                      <!---     <v-text-field
                        label="Institución catalogadora"
                        outlined
                        dense
                        v-model="catalogingInstitution"
                        class="mb-4"
                        hide-details
                      ></v-text-field>  --->

                      <v-row>
                        <v-col>
                          <v-checkbox
                            v-model="isSelleable"
                            label="Vendible"
                            hide-details
                          ></v-checkbox>
                        </v-col>

                        <!-- <v-col>
                          <v-checkbox
                            v-model="isPublished"
                            label="Publicada"
                            hide-details
                          ></v-checkbox>
                        </v-col> -->

                        <v-col>
                          <v-checkbox
                            v-model="isYearbook"
                            label="Anuario"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="pl-5 pr-5">
                    <v-layout row wrap class="pa-3">
                      <v-btn
                        block
                        color="primary"
                        @click="validate()"
                        class="mb-3"
                        >Editar PDF</v-btn
                      >
                      <v-btn
                        block
                        color="secondary"
                        @click="confirm2 = true"
                        class="mb-3"
                        >Limpiar datos</v-btn
                      >
                      <!-- <v-btn block color="#3091C5" style="color : white" @click="sendToStatics()"
                      >Ver estadística</v-btn> -->
                    </v-layout>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="openSelect" max-width="300">
      <v-card>
        <v-toolbar elevation="0">
          <v-toolbar-title>Elija una opción</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="openSelect = false"
            ><v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-layout class="pa-3" row wrap>
            <v-btn
              block
              class="mb-2"
              color="primary"
              @click="$refs.contentDFDialog.openDialog(), (openSelect = false)"
              >Ver PDF</v-btn
            >
            <v-btn
              block
              color="secondary"
              @click="
                $refs.contentZoomDialog.openDialog(image), (openSelect = false)
              "
              class="mb-1"
              >Ver imagen</v-btn
            >
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirm" max-width="300">
      <v-card :loading="loading">
        <v-card-title>Advertencia</v-card-title>

        <v-card-text v-if="!loading">
          ¿Esta seguro de proceder con la actualización del documento PDF?
        </v-card-text>

        <v-card-text v-else> Cargando el documento PDF </v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn dark @click="confirm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="updatePDF()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirm2" max-width="300" persistent>
      <v-card>
        <v-card-title>Advertencia</v-card-title>

        <v-card-text> ¿Esta seguro de limpiar todos los campos? </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn dark @click="confirm2 = false">Cancelar</v-btn>
          <v-btn color="primary" @click="reset(), (confirm2 = false)"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ContentZoomDialog ref="contentZoomDialog" />
    <ContentDFDialog
      :pdfSrc="imagePDF"
      :pdfTitle="title != null ? title : ''"
      ref="contentDFDialog"
    />
    <v-dialog v-model="confirm1" max-width="300" persistent>
      <v-card :loading="loading1">
        <v-card-title>
          <center>Mensaje</center>
        </v-card-title>
        <v-card-text>
          Porfavor espere un momento, cargando los datos...
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

import ContentZoomDialog from "~/components/editor/contentZoomDialog";
import ContentDFDialog from "~/components/editor/ContenPDFDialog.vue";
import { orderNotebooks } from "~/static/functions";

export default {
  components: {
    ContentZoomDialog,
    ContentDFDialog,
  },
  data: () => ({
    imgPath: process.env.imgPath,
    notebookname: null,
    loading: false,
    dialog: false,
    loading1: false,
    confirm1: false,
    dateMenu: false,
    dateMenu1: false,
    confirm: false,
    confirm2: false,
    creationDate: null,
    publicationDate: null,
    publicationRef: null,
    page: null,
    status: null,
    title: null,
    imgthumbnail: null,
    imgthumbnailSRC: null,
    showPixel: null,
    pixel: null,
    imgthumbnailB64: null,
    imgcalidadB64: null,
    imgcalidad: null,
    imgcalidadSRC: null,
    PhotographerRef: null,
    notebookRef: null,
    isPublished: false,
    isYearbook: false,
    PublishingAgencyRef: null,
    observations: null,
    place: null,
    graphRef: null,
    externalPhotographer: false,
    wasExported: false,
    clasificationRef: null,
    isSelleable: false,
    material: null,
    relatedImage: null,
    relatedNote: null,
    directors: [
      "Carlos R. Menéndez Navarrete",
      "Abel Menéndez Romero",
      "Carlos R. Menéndez González",
      "Carlos R. Menéndez Losa",
    ],
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
      caracterLength: [
        (v) =>
          (!!v && v.length <= 98800) ||
          "El títutlo debe ser menor a 98800 caracteres",
      ],
      noRules: [],
    },
    imageFoot: null,
    id: null,
    image: null,
    PublishingAgency: [],
    clasifications: [],
    Photographers: [],
    publications: [],
    noteBooks: [],
    noteBooks2: [],
    pages: [],
    files: [],
    mode: null,
    tipo: null,
    catalogingInstitution: null,
    periodicity: null,
    language: null,
    imprint: null,
    director: null,
    localSeries: null,

    openSelect: false,
    workingPath: process.env.workingPath,
    imagePDF: null,
  }),
  watch: {
    publicationRef(newValue) {
      this.noteBooks2 = orderNotebooks(this.noteBooks, newValue);
    },
    imgthumbnail(newValue) {
      console.log("entro al metodo imgthumbnail", newValue);
      if (newValue != undefined || newValue != null) {
        this.imgthumbnailSRC = null;
        this.imgthumbnailSRC = this.getImgPreview(newValue);
        console.log("getImgPreview----");
        console.log(this.imgthumbnailSRC);
        this.imageToBase64(newValue, 1);
      } else {
        this.imgthumbnailB64 = null;
      }
    },
    imgcalidad(newValue) {
      console.log("entro al metodo calidad", newValue);
      if (newValue != undefined || newValue != null) {
        this.imgcalidadSRC = null;
        this.imgcalidadSRC = this.getImgPreview(newValue);
        console.log("getImgPreview---");
        console.log(this.imgcalidadSRC);
        this.imageToBase64(newValue, 2);
      } else {
        this.imgcalidadB64 = null;
      }
    },
  },
  computed: {
    ...mapState(["notebooksStore", "publicationsStore"]),
  },
  methods: {
    async openDialog(id) {
      this.loading1 = true;
      this.confirm1 = true;
      await this.getNotebooks();
      await this.getPublications();
      // await this.newnotebook();
      if (this.id != null) {
        if (this.id != id) {
          this.id = id;
          await this.getPDF();
        }
      } else {
        this.id = id;
        await this.getPDF();
      }

      this.loading1 = false;
      this.confirm1 = false;
      this.dialog = true;

      this.generatePages();
      this.getPhotographers();
      this.getPublishingAgency();
      this.getClasifications();
    },
    async updatePDF() {
      this.loading = true;

      try {
        const response = await this.$axios.$put(
          "/pdfs",
          {
            publication: this.publicationRef,
            notebook: this.notebookRef,
            title:
              this.title !== null
                ? this.title.substring(0, 98800)
                : this.file.name,
            page: this.page !== "Desconocido" ? this.page : 0,
            director: this.director,
            publicationDate: this.creationDate,
            isSelleable: this.isSelleable,
            isYearbook: this.isYearbook,
            _id: this.id,
          },
          { headers: { Authorization: "Bearer " + localStorage.token } }
        );

        this.$store.commit("openSnack", "El documento PDF se ha actualizado");

        this.cleanAndClose();
      } catch (error) {
        this.loading = false;
        this.confirm = false;

        console.log(error);
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return;
      }
    },
    async getPublications() {
      setTimeout(() => {
        this.publications = this.publicationsStore;
      }, 1);
    },
    async getNotebooks() {
      setTimeout(() => {
        this.noteBooks = this.notebooksStore;
      }, 1);
    },
    async getPhotographers() {
      const response = await this.$axios.$get("/Photographer", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.Photographers = response.data.Photographerobj;
      //console.log(this.Photographers)
    },
    async getPublishingAgency() {
      const response = await this.$axios.get("/Agency", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.PublishingAgency = response.data.data.agenciaobj;
    },
    async getClasifications() {
      const response = await this.$axios.$get("/Clasifications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.clasifications = response.data.body;
    },
    async getPDF() {
      const response = await this.$axios.$get("/pdfs/" + this.id, {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      // console.log(response.data)

      this.title = response.data.pdf.title;
      this.creationDate =
        response.data.pdf.datePublication != null
          ? new Date(response.data.pdf.datePublication)
              .toISOString()
              .substring(0, 10)
          : null;
      this.notebookRef =
        response.data.pdf.notebook != null
          ? response.data.pdf.notebook._id
          : null;

      this.publicationRef =
        response.data.pdf.publication != null
          ? response.data.pdf.publication._id
          : null;

      this.PublishingAgencyRef =
        response.data.pdf.agency != null ? response.data.pdf.agency : null;
      this.page =
        response.data.pdf.page != null ? response.data.pdf.page : "Desconocido";
      this.place =
        response.data.pdf.place != null ? response.data.pdf.place : null;

      this.image = this.imgPath + response.data.pdf.imageSrc;
      // console.log('this.image  preview SRC', this.image);
      if (this.image.search("-0.png") != -1) {
        this.image = this.image.replace("-0.png", ".png");
      }
      this.imagePDF = response.data.pdf.imageSrc;

      if (this.imagePDF.search("-0.png") != -1) {
        this.imagePDF = this.imagePDF.replace("-0.png", ".png");
      }

      this.catalogingInstitution =
        response.data.pdf.catalogingInstitution != undefined
          ? response.data.pdf.catalogingInstitution
          : null;
      this.periodicity =
        response.data.pdf.periodicity != undefined
          ? response.data.pdf.periodicity
          : null;
      this.language =
        response.data.pdf.language != undefined
          ? response.data.pdf.language
          : null;

      this.isPublished =
        response.data.pdf.isPublished != undefined
          ? response.data.pdf.isPublished
          : false;
      this.isSelleable =
        response.data.pdf.isSelleable != undefined
          ? response.data.pdf.isSelleable
          : false;
      this.isYearbook =
        response.data.pdf.isYearbook != undefined
          ? response.data.pdf.isYearbook
          : false;

      this.director =
        response.data.pdf.director != undefined
          ? response.data.pdf.director
          : null;
      this.localSeries =
        response.data.pdf.localSeries != undefined
          ? response.data.pdf.localSeries
          : null;
      this.imprint =
        response.data.pdf.imprint != undefined
          ? response.data.pdf.imprint
          : null;
    },
    generatePages() {
      this.pages.push("Desconocido");
      for (let i = 1; i <= 44; i++) {
        this.pages.push(i);
      }
    },

    async cleanAndClose() {
      this.$parent.loading = true;
      let pag = this.$parent.page;

      this.confirm = false;
      this.dialog = false;
      this.loading = false;
      this.cargando = 0;

      this.$parent.page = 1;
      this.$parent.advObj.quantity = 1;
      this.$parent.saveSearchedPage = [];
      await this.$parent.getPDFs();
      await this.$parent.getPagination();

      this.$parent.page = pag;
      this.$parent.nextPage();
      this.$parent.selected = [];

      this.$parent.loading = false;
      this.id = null;
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.formPDF.reset();
      this.isPublished = false;
      this.isSelleable = false;
      this.isYearbook = false;
      this.id = null;
    },
    validate() {
      if (this.$refs.form.validate() && this.$refs.formPDF.validate()) {
        this.confirm = true;
      }
    },
    sendToStatics() {
      this.$router.push({
        path: "/chartsAndGraphics",
        query: {
          content: btoa(JSON.stringify(this.id)),
          mode: "PDF",
        },
      });
    },
    async errorHandler() {
      let img = this.image;
      setTimeout(() => {
        this.image = this.workingPath;
      }, 1);
      try {
        const response = await this.$axios.$get(
          "/pdfs/Createimage/" + this.id,
          {
            haeders: { Authorization: "Bearer " + localStorage.token },
          }
        );

        console.log(response);

        if (response) {
          this.image = img;
        }
      } catch (error) {
        console.log(error.response);
      }
      this.$forceUpdate();
    },
    imageToBase64(file, type) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (type == 1) {
          this.imgthumbnailB64 = reader.result;
          console.log("base 64 full 111", this.imgthumbnailB64);
        }
        if (type == 2) {
          this.imgcalidadB64 = reader.result;
          console.log("base 64 full 222", this.imgcalidadB64);
        }
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    },
    getImgPreview(file) {
      const urlPreview = URL.createObjectURL(file);
      const img = new Image();
      img.src = urlPreview;
      img.onload = () => {
        this.pixel = img.width + " x " + img.height;
        this.showPixel = img.width + " x " + img.height;
      };
      return urlPreview;
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
