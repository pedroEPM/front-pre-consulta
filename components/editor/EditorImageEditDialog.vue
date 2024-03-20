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

            <v-toolbar-title>Editor de imagen</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>

        <Loader-card v-show="loading" />

        <v-card-text v-show="!loading">
          <v-container grid-list-xl>
            <v-layout row wrap>
              <v-flex xs12 md8>
                <v-card
                  outlined
                  height="87vh"
                  class="scroll"
                  style="overflow-y: auto"
                >
                  <v-card-text>
                    <v-img
                      :src="image"
                      :lazy-src="image"
                      @click="$refs.contentZoomDialog.openDialog(image)"
                      @error="errorHandler"
                      style="cursor: pointer"
                      contain
                      height="400"
                      class="mb-3"
                    ></v-img>

                    <v-form ref="formIMG">
                      <v-textarea
                        outlined
                        label="Píe de foto"
                        height="10rem"
                        v-model="imageFoot"
                      ></v-textarea>

                      <!-- <v-text-field
                        outlined
                        label="Título atribuido"
                        v-model="attributedTitle"
                      ></v-text-field> -->

                      <v-textarea
                        outlined
                        label="Observaciones"
                        height="5rem"
                        v-model="observations"
                      ></v-textarea>
                    </v-form>
                  </v-card-text>
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
                        :rules="validations.fieldRules"
                        hide-details
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
                        :items="
                          publicationRef !== null ? notebooks2 : notebooks
                        "
                        label="Cuaderno"
                        placeholder="Seleccione una opción"
                        item-text="NoteBookName"
                        item-value="_id"
                        outlined
                        dense
                        :disabled="publicationRef === null"
                        v-model="notebookRef"
                        hide-details
                        class="custom-field mb-4"
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
                        v-model="pageI"
                        :items="pages"
                        hide-details
                        class="mb-4"
                      ></v-select>

                      <v-text-field
                        label="Lugar"
                        outlined
                        dense
                        v-model="place"
                        class="mb-4"
                        hide-details
                      ></v-text-field>

                      <v-select
                        label="Clasificación"
                        placeholder="Seleccione una opción"
                        :items="clasifications"
                        item-text="name"
                        item-value="_id"
                        v-model="clasificationRef"
                        outlined
                        dense
                        hide-details
                        class="mb-4"
                        :rules="validations.fieldRules"
                      ></v-select>

                      <v-select
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
                      ></v-select>
                      <!--
                      <v-text-field
                        label="Fotógrafo"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                        readonly
                        append-icon="mdi-acount"
                        v-if="sinIdRef == true"
                        v-model="PhotographerRef"
                      ></v-text-field> -->

                      <!-- @click:append="sinIdRef = false" -->
                      <!-- @click:append="sinIdRef = true" -->
                      <!-- v-if="sinIdRef == false" -->
                      <v-select
                        label="Fotógrafo"
                        append-icon="mdi-acount"
                        placeholder="Seleccione una opción"
                        :items="Photographers"
                        item-text="name"
                        item-value="_id"
                        v-model="PhotographerRef"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                      >
                        <template slot="selection" slot-scope="data">
                          {{ data.item.name }} {{ data.item.lname }}
                        </template>
                        <template slot="item" slot-scope="data">
                          {{ data.item.name }} {{ data.item.lname }}
                        </template>
                      </v-select>

                      <v-text-field
                        label="Fotógrafo externo"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                        v-model="externalPhotographer"
                      ></v-text-field>

                      <v-text-field
                        label="Medidas"
                        outlined
                        dense
                        readonly
                        class="mb-4"
                        hide-details
                        v-model="showPixel"
                      ></v-text-field>

                      <v-select
                        v-model="material"
                        :items="materialdata"
                        label="Material"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                      ></v-select>

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
                            label="Fecha de publicación"
                            append-icon="mdi-calendar"
                            readonly
                            outlined
                            dense
                            hide-details
                            v-bind="attrs"
                            class="mb-4"
                            v-on="on"
                            :rules="validations.fieldRules"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="publicationDate"
                          @input="dateMenu = false"
                          locale="es-MX"
                        ></v-date-picker>
                      </v-menu>

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
                            label="Fecha de origen"
                            append-icon="mdi-calendar"
                            readonly
                            outlined
                            dense
                            hide-details
                            class="mb-4"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="creationDate"
                          @input="dateMenu1 = false"
                          locale="es-MX"
                        ></v-date-picker>
                      </v-menu>

                      <v-text-field
                        label="Clave de la nota"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                        v-model="idNoticia"
                      ></v-text-field>

                      <!--
                      <v-text-field
                        label="Nota relacionada"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                        v-model="relatedNote"
                      ></v-text-field>

                      <v-text-field
                        label="Pdf relacionado"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                        v-model="relatedPDF"
                      ></v-text-field> -->

                      <v-row>
                        <v-col>
                          <v-checkbox
                            v-model="isSelleable"
                            label="Vendible"
                            hide-details
                          ></v-checkbox>
                        </v-col>

                        <v-col>
                          <v-checkbox
                            v-model="isPublished"
                            label="Publicada"
                            hide-details
                          ></v-checkbox>
                        </v-col>

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
                        @click="validate"
                        class="mb-2"
                        >Actualizar Imagen</v-btn
                      >
                      <v-btn
                        block
                        color="secondary"
                        @click="confirm2 = true"
                        class="mb-2"
                        >Limpiar campos</v-btn
                      >
                      <!-- <v-btn block color="#3091C5" @click="sendToStatics()" style="color : white"
                        >Ver estadísticas</v-btn> -->
                    </v-layout>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirm" max-width="300">
      <v-card :loading="loadingCard">
        <v-card-title> Advertencia </v-card-title>

        <v-card-text v-if="!loadingCard">
          ¿Esta seguro de proceder a actualizar de la imagen?
        </v-card-text>

        <v-card-text v-else> Cargando la imagen </v-card-text>

        <v-card-actions v-if="!loadingCard">
          <v-spacer />
          <v-btn dark @click="confirm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="updateImage()">Aceptar</v-btn>
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
  </div>
</template>

<script>
import { mapState } from "vuex";

import LoaderCard from "~/components/LoaderCard";
import ContentZoomDialog from "~/components/editor/contentZoomDialog";
import { orderNotebooks } from "~/static/functions";

export default {
  components: {
    LoaderCard,
    ContentZoomDialog,
  },
  data: () => ({
    dialog: false,
    loading: false,
    loadingCard: false,
    dateMenu: false,
    dateMenu1: false,
    files: [],
    imgPath: process.env.imgPath,
    errImgPath: process.env.errImgPath,
    image: null,
    confirm: false,
    confirm2: false,
    materialdata: ["Negativo", "Positivo", "Diapositiva", "Impresa", "Digital"],
    id: null,
    creationDate: null,
    publicationDate: null,
    title: null,
    publicationRef: null,
    notebookRef: null,
    PhotographerRef: null,
    sinIdRef: false,
    clasificationRef: null,
    PublishingAgencyRef: null,
    pageI: null,
    status: null,
    imageFoot: null,
    photographer: null,
    exPhotographer: null,
    isPublished: false,
    isYearbook: false,
    observations: null,
    place: null,
    graphRef: null,
    externalPhotographer: null,
    wasExported: false,
    clasification: null,
    isSelleable: false,
    material: null,
    relatedNote: null,
    relatedPDF: null,
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
    },
    Photographers: [],
    PublishingAgency: [],
    clasifications: [],
    pages: [],
    publications: [],
    notebooks: [],
    notebooks2: [],
    tipo: null,

    showPixel: null,
    pixel: null,
    page: null,
    attributedTitle: null,
    idNoticia: null
  }),
  computed: {
    ...mapState(["notebooksStore", "publicationsStore"]),
  },
  watch: {
    publicationRef(newValue) {
      this.notebooks2 = orderNotebooks(this.notebooks, newValue);
      this.tipo = "change";
    },
  },
  methods: {
    async openDialog(id) {
      await this.getNotebooks();
      await this.getPublications();
      this.getPhotographers();
      // this.reset();
      if (this.id !== null) {
        if (this.id !== id) {
          this.id = id;
          this.getImage();
        }
      } else {
        this.id = id;
        this.getImage();
      }
      this.dialog = true;
      this.generatePages();
      this.getPublishingAgency();
      this.getClasifications();
    },

    getImgPreview(file) {
      if (file != null) {
        const urlPreview = URL.createObjectURL(file);
        return urlPreview;
      }
    },

    async getPublications() {
      setTimeout(() => {
        this.publications = this.publicationsStore;
      }, 1);
    },
    async getNotebooks() {
      setTimeout(() => {
        this.notebooks = this.notebooksStore;
      }, 1);
    },
    async getPhotographers() {
      const response = await this.$axios.$get("/Photographer", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.Photographers = response.data.Photographerobj;
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
    async getImage() {
      this.loading = true;
      console.log(this.id)
      const response = await this.$axios.$get("/images/" + this.id, {
        headers: { Authorization: "Bearer " + localStorage.token },
      });

      this.publicationRef = null;

      this.notebookRef =
        response.data.image.noteBookRef !== null
          ? response.data.image.noteBookRef._id
          : null;

      this.publicationRef =
        response.data.image.publicationRef !== null
          ? response.data.image.publicationRef._id
          : null;

      this.pageI =
        response.data.image.page !== null
          ? response.data.image.page
          : "Desconocido";

      this.place =
        response.data.image.place !== null ? response.data.image.place : null;

      this.clasificationRef =
        response.data.image.clasificationRef !== null
          ? response.data.image.clasificationRef._id
          : null;

      this.PublishingAgencyRef =
        response.data.image.idAgency !== null
          ? response.data.image.idAgency._id
          : null;

      this.PhotographerRef = response.data.image?.photographer
        ? response.data.image.photographer?._id
        : null;

      this.externalPhotographer = response.data.image?.externalFotographer
        ? response.data.image.externalFotographer
        : null;

      this.material = response.data?.image?.material;

      this.creationDate =
        response.data.image.origenDate !== null
          ? new Date(response.data.image.origenDate)
              .toISOString()
              .substring(0, 10)
          : null;

      this.publicationDate =
        response.data.image.publicationDate !== null
          ? new Date(response.data.image.publicationDate)
              .toISOString()
              .substring(0, 10)
          : null;

      this.isPublished =
        response.data.image.isPublished !== undefined
          ? response.data.image.isPublished
          : false;

      this.isYearbook =
        response.data.image.isYearBook !== undefined
          ? response.data.image.isYearBook
          : false;

      this.isSelleable =
        response.data.image.isSelleable !== undefined
          ? response.data.image.isSelleable
          : false;
      // this.relatedNote = response.data.image?.idNoticia
      //   ? response.data.image?.idNoticia
      //   : response.data.image?._id;

      this.image = this.imgPath + response.data.image.imageSrc;
      this.idNoticia = response.data.image.idNoticia !== undefined
          ? response.data.image.idNoticia
          : null;

      this.imageFoot = response.data.image.description;
      this.observations =
        response.data.image.observations !== null &&
        response.data.image.observations !== undefined
          ? response.data.image.observations
          : null;

      const isHadPixel = response.data?.image?.pixels;

      if (
        isHadPixel !== undefined &&
        isHadPixel !== "0 x 0" &&
        isHadPixel !== null
      ) {
        this.showPixel = isHadPixel;
        this.pixel = isHadPixel;
      } else {
        try {
          const cImg = await this.getPixel();
          this.pixel = cImg.width + " x " + cImg.height;
          this.showPixel = cImg.width + " x " + cImg.height;
          this.setPixels();
        } catch (error) {
          console.log("img error");
          console.log(error);
        }
      }

      // this.attributedTitle =
      //   response.data.image.attributedTitle != undefined
      //     ? response.data.image.attributedTitle
      //     : null;

      this.loading = false;
      // console.log(response.data)
    },
    async updateImage() {
      this.loadingCard = true;
      try {
        const response = await this.$axios.$put(
          "/Images",
          {
            _id: this.id,
            publicationRef: this.publicationRef,
            noteBookRef: this.notebookRef,
            page: this.pageI !== "Desconocido" ? this.pageI : null,
            place: this.place,
            clasificationRef: this.clasificationRef,
            agency: this.PublishingAgencyRef,
            photographer: this.PhotographerRef,
            externalFotographer: this.externalPhotographer,
            material: this.material,
            origenDate: this.creationDate,
            publicationDate: this.publicationDate,
            isPublished: this.isPublished,
            isYearBook: this.isYearbook,
            isSelleable: this.isSelleable,
            ImageTitle:
              this.imageFoot !== null ? this.imageFoot : this.file?.name,
            description:
              this.imageFoot !== null ? this.imageFoot : this.file?.name,
            observations: this.observations,
            pixels: this.pixel,
            idNoticia: this.idNoticia

            // typeExtencion: ".png",
            // status: this.status,
            // pie de foto,
            // isPublished: this.isPublished,
            // isYearBook: this.isYearbook,
            // canSell: this.isSelleable,
            // graphicRef: this.graphRef,
            // itWasExported: this.wasExported,
            // attributedTitle: this.attributedTitle,
          },
          {
            headers: { Authorization: "Bearer " + localStorage.token },
          }
        );
        // console.log('respuesta img', response);
        this.$store.commit(
          "openSnack",
          "La imagen se ha actualizado exitosamente"
        );

        this.cleanAndClose();
      } catch (error) {
        console.log(error);
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        this.loadingCard = false;
        return;
      }
    },
    generatePages() {
      this.pages.push("Desconocido");
      for (let i = 1; i <= 44; i++) {
        this.pages.push(i);
      }
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.formIMG.reset();
    },

    async cleanAndClose() {
      console.log("EJECUTO cleanAndClose");
      this.$refs.form.reset();
      this.$refs.formIMG.reset();
      this.$parent.loading = true;
      let pag = this.$parent.page;

      this.loadingCard = false;
      this.loading = false;
      this.confirm = false;
      this.cargando = 0;
      this.id = null;
      this.dialog = false;

      this.$parent.page = 1;
      this.$parent.advObj.quantity = 1;
      this.$parent.saveSearchedPage = [];
      await this.$parent.getImages();
      await this.$parent.getPagination();

      this.$parent.page = pag;
      this.$parent.nextPage();
      this.$parent.selected = [];

      this.$parent.loading = false;
    },
    validate() {
      if (this.$refs.form.validate() && this.$refs.formIMG.validate()) {
        this.confirm = true;
      }
    },
    sendToStatics() {
      this.$router.push({
        path: "/chartsAndGraphics",
        query: {
          content: btoa(JSON.stringify(this.id)),
          mode: "Imagenes",
        },
      });
    },
    getPixel() {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = this.image;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    },
    async setPixels() {
      try {
        const response = await this.$axios.$put("/imageP", {
          id: this.id,
          size: this.pixel,
          headers: { Authorization: "Bearer " + localStorage.token },
        });
      } catch (error) {
        console.log(error.response);
      }
    },
    errorHandler() {
      this.image = this.errImgPath;
      this.$forceUpdate();
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
