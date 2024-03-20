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

            <v-toolbar-title>Creación de fotos</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-xl>
            <v-layout row wrap>
              <v-flex xs12 md8>
                <v-card
                  outlined
                  height="110vh"
                  class="scroll"
                  style="overflow-y: auto"
                >
                  <v-card-text>
                    <v-form ref="form2">
                      <v-textarea
                        outlined
                        label="Pie de foto"
                        height="6rem"
                        v-model="imageFoot"
                      ></v-textarea>

                      <v-textarea
                        outlined
                        label="Observaciones"
                        height="5rem"
                        v-model="observations"
                      ></v-textarea>

                      <v-file-input
                        :rules="validations.fieldRules"
                        v-model="file"
                        outlined
                        label="Ingrese la foto"
                        counter
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small>
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
                    </v-form>
                  </v-card-text>

                  <v-card-text>
                    <v-layout row wrap justify-center>
                      <v-flex xs12 md6>
                        <v-card
                          v-if="file != null"
                          @click="$refs.contentZoomDialog.openDialog(imgSRC)"
                          style="cursor: pointer"
                        >
                          <v-img :src="imgSRC" contain imgPreview></v-img>
                        </v-card>
                      </v-flex>
                    </v-layout>
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
                            :style="colorstant(item)"
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
                        :items="publicationRef != null ? notebooks2 : notebooks"
                        label="Cuaderno"
                        placeholder="Seleccione una opción"
                        item-text="NoteBookName"
                        item-value="_id"
                        outlined
                        dense
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
                        v-model="page"
                        :items="pages"
                        hide-details
                        class="mb-4"
                      ></v-select>

                      <v-text-field
                        label="Lugar"
                        outlined
                        dense
                        v-model="place"
                        hide-details
                        class="mb-4"
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
                        :rules="validations.fieldRules"
                        hide-details
                        class="mb-4"
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
                        hide-details
                        class="mb-4"
                      ></v-select>

                      <v-select
                        label="Fotógrafo"
                        placeholder="Seleccione una opción"
                        :items="Photographers"
                        item-text="name"
                        item-value="_id"
                        v-model="PhotographerRef"
                        outlined
                        dense
                        hide-details
                        class="mb-4"
                      >
                        <template slot="selection" slot-scope="data">
                          {{ data.item.name }} {{ data.item.lname }}
                        </template>
                        <template slot="item" slot-scope="data">
                          {{ data.item.name }} {{ data.item.lname }}
                        </template>
                      </v-select>

                      <v-select
                        label="Fotógrafo externo"
                        placeholder="Seleccione una opción"
                        :items="isExternPhoto"
                        item-text="text"
                        item-value="value"
                        v-model="externalPhotographer"
                        outlined
                        dense
                        hide-details
                        class="mb-4"
                      ></v-select>

                      <v-text-field
                        label="Medidas"
                        outlined
                        dense
                        v-model="showPixel"
                        hide-details
                        class="mb-4"
                        readonly
                      ></v-text-field>

                      <v-select
                        :items="materialdata"
                        label="Material"
                        outlined
                        dense
                        hide-details
                        class="mb-4"
                        v-model="cMaterial"
                      ></v-select>

                      <v-text-field
                        label="ID Noticia"
                        outlined
                        dense
                        v-model="noticeId"
                        hide-details
                        class="mb-4"
                      ></v-text-field>

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
                            hide-details
                            dense
                            v-bind="attrs"
                            v-on="on"
                            :rules="validations.fieldRules"
                            class="mb-4"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="publicationDate"
                          locale="es-MX"
                          @input="dateMenu = false"
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
                            v-bind="attrs"
                            v-on="on"
                            hide-details
                            class="mb-4"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="creationDate"
                          locale="es-MX"
                          @input="dateMenu1 = false"
                        ></v-date-picker>
                      </v-menu>

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
                        @click="validate()"
                        class="mb-2"
                        >Cargar Imagen</v-btn
                      >
                      <v-btn block color="secondary" @click="confirm2 = true"
                        >Limpiar campos</v-btn
                      >
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
      <v-card :loading="loading">
        <v-card-title> Advertencia </v-card-title>

        <v-card-text v-if="!loading">
          ¿Esta seguro de proceder con la carga de las fotos?
        </v-card-text>

        <v-card-text v-else> Cargando las fotos </v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn dark @click="confirm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="createImageSelection()">Aceptar</v-btn>
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
import ContentZoomDialog from "~/components/editor/contentZoomDialog";
import { orderNotebooks } from "~/static/functions";

export default {
  components: {
    ContentZoomDialog,
  },
  data: () => ({
    dialog: false,
    loading: false,
    confirm: false,
    confirm2: false,
    materialdata: ["Negativo", "Positivo", "Diapositiva", "Impresa", "Digital"],
    dateMenu: false,
    dateMenu1: false,
    file: null,
    iconB64: null,
    creationDate: null,
    publicationDate: null,
    publicationRef: null,
    notebookRef: null,
    page: null,
    status: null,
    imageFoot: null,
    PhotographerRef: null,
    PublishingAgencyRef: null,
    observations: null,
    place: null,
    graphRef: null,
    externalPhotographer: null,
    wasExported: false,
    clasificationRef: null,
    material: null,
    cMaterial: null,
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
    },
    PublishingAgency: [],
    clasifications: [],
    Photographers: [],
    publications: [],
    notebooks: [],
    notebooks2: [],
    pages: [],
    isSelleable: false,
    isPublished: true,
    isYearbook: false,
    mode: null,
    noticeId: null,
    showPixel: null,
    pixel: null,
    attributedTitle: null,
    imgSRC: null,
    isExternPhoto: [
      { value: true, text: "Es externo" },
      { value: false, text: "Es interno" },
    ],
  }),
  watch: {
    publicationRef(newValue) {
      this.notebooks2 = orderNotebooks(this.notebooks, newValue);
    },
    file(newValue) {
      if (newValue != undefined || newValue != null) {
        this.imgSRC = null;
        this.imgSRC = this.getImgPreview(newValue);
        this.imageToBase64(newValue);
      } else {
        this.iconB64 = null;
      }
    },
  },
  computed: {
    ...mapState(["notebooksStore", "publicationsStore"]),
  },
  methods: {
    openDialog(mode) {
      this.mode = mode;
      this.dialog = true;
      this.getPublications();
      this.getNotebooks();
      this.generatePages();
      this.getPhotographers();
      this.getPublishingAgency();
      this.getClasifications();
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

    colorstant(item) {
      if (item.subtittle == true) {
        return "background-color : #b3b3b3";
      }
      if (item.disable == true) {
        return "background-color : #858585";
      }
      return "";
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
      let photographerob = [];
      photographerob = response.data.Photographerobj;
      photographerob.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });

      this.Photographers = photographerob;
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
    createImageSelection() {
      this.loading = true;
      switch (this.mode) {
        case 1:
          this.createImage();
          break;
      }
    },

    async createImage() {
      let formData = new FormData();
      let body = {
        description: this.imageFoot != null ? this.imageFoot : this.file.name,
        observations: this.observations,
        publicationRef: this.publicationRef,
        noteBookRef: this.notebookRef,
        page: this.page !== "Desconocido" ? this.page : 0,
        idNoticia: this.noticeId,
        place: this.place,
        clasificationRef: this.clasificationRef,
        agency: this.PublishingAgencyRef,
        photographer: this.PhotographerRef,
        externalFotographer: this.externalPhotographer,
        pixels: this.pixel,
        material: this.cMaterial,
        publicationDate: this.publicationDate,
        CreationImage: this.creationDate,
        isPublished: this.isPublished,
        isYearBook: this.isYearbook,
        isSelleable: this.isSelleable,
        Image64: null,
        imageTitle: this.file?.name ?? '',
      };
      let x = this.iconB64.length;
      let y = 100000;
      x = Math.round(x / y + 1);
      for (let i = 0; i < x; i++) {
        // body['Image64_' + i ] = this.iconB64.substring( ( i * y ), ( y * ( i + 1) ) );
        formData.append(
          "Image64_" + i,
          this.iconB64.substring(i * y, y * (i + 1))
        );
      }
      formData.append("x", x);
      formData.append("Imagen", this.file);
      formData.append("body", JSON.stringify(body));

      try {
        const response = await this.$axios.$post("/Images", formData, {
          headers: { Authorization: "Bearer " + localStorage.token },
        });
        console.log("respuesta de la imagen", response);

        this.$store.commit("openSnack", "La imagen se ha cargado exitosamente");

        this.cleanClose();
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return;
      }
    },
    cleanClose() {
      this.$refs.form.reset();
      this.$refs.form2.reset();
      console.log("no msg loop");
      // this.$parent.getImages();
      this.confirm = false;
      this.dialog = false;
      this.loading = false;
      this.isSelleable = false;
      this.isPublished = false;
      this.isSelleable = false;
    },
    generatePages() {
      this.pages.push("Desconocido");
      for (let i = 1; i <= 44; i++) {
        this.pages.push(i);
      }
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.form2.reset();
      this.file = null;
    },
    validate() {
      if (this.$refs.form.validate() && this.$refs.form2.validate()) {
        this.confirm = true;
      }
    },
    imageToBase64(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.iconB64 = reader.result;
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
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
