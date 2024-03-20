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

            <v-toolbar-title>Creación de PDF</v-toolbar-title>
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
                  height="87vh"
                  class="scroll"
                  style="overflow-y: auto"
                >
                  <v-form ref="formPDF">
                  <h3>Datos del PDF</h3>
                  <br>
                    <v-card-text>
                      <v-text-field
                        outlined
                        label="Título"
                        v-model="title"
                      ></v-text-field>

                      <!-- <v-textarea
                        outlined
                        label="Observaciones"
                        height="5rem"
                        v-model="observations"
                      ></v-textarea> -->

                      <v-file-input
                        :rules="validations.fieldRules"
                        v-model="file"
                        outlined
                        label="Ingrese el documento PDF"
                        counter
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small>
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
                    </v-card-text>
                      <!-- <v-card-text>
                        <h3>Agregar imagenes de PDF *opcional*</h3>
                        <br>
                    <v-file-input

                        v-model="imgthumbnail"
                        outlined
                        label="Ingrese las fotos para thumbnail"
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
                        <v-card elevation="1" v-if="imgthumbnail != null"

                        >
                          <v-img style="max-height:100px" :src="imgthumbnailSRC" contain imgPreview></v-img>
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
                        <v-card v-if="imgthumbnail  != null"
                        elevation="1"
                        >
                          <v-img style="max-height:150px"  :src="imgcalidadSRC" contain imgPreview></v-img>
                        </v-card>
                      </v-flex>
                    </v-layout>
                    </v-card-text> -->
                  </v-form>
                </v-card>
              </v-flex>

              <v-flex xs12 md4>
                <v-card
                  outlined
                >
                  <v-card-title>Información</v-card-title>
                  <v-card-text>
                    <v-form
                      ref="form"
                    >
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
                            :style="item.disable == true ? 'background-color : #b3b3b3' : ''"
                          >
                            <v-list-item-content :style="item.disable == true ? '' : 'padding-left : 10px'">
                              <v-list-item-title v-if="item.disable" :class="!item.disable == true ? 'listItemTitleFalse' : 'listItemTitleTrue'">
                                {{ item.publicationName}}
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
                            :style="item.disable == true ? 'background-color : #b3b3b3' : ''"
                          >
                            <v-list-item-content :style="item.disable == true ? 'padding-left : 2px' : ''">
                              <v-list-item-title :class="item.disable == true ? 'listItemTitleTrue' : 'listItemTitleFalse'">
                                {{ item.NoteBookName}}
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

                     <!---- <v-text-field
                        label="Director"
                        outlined
                        dense
                        v-model="director"
                        class="mb-4"
                        hide-details
                      ></v-text-field>---->

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

                     <!-- <v-text-field
                        label="Lugar"
                        outlined
                        dense
                        v-model="place"
                        class="mb-4"
                        hide-details
                      ></v-text-field>--->

                    <!--  <v-text-field
                        label="Serie local"
                        outlined
                        dense
                        v-model="localSeries"
                        class="mb-4"
                        hide-details
                      ></v-text-field>--->

                   <!---   <v-combobox
                        label="Pie de imprenta"
                        placeholder="Seleccione una opción"
                        outlined
                        dense
                        v-model="imprint"
                        class="mb-4"
                        :items="imprenta"
                        hide-details
                      ></v-combobox>--->

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
<!--
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

                   <!---   <v-combobox
                        label="Idioma"
                        outlined
                        dense
                        v-model="language"
                        class="mb-4"
                        hide-details
                        placeholder="Seleccione una opción"
                        :items="idioma"
                      ></v-combobox> ---->

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
                           required
                          :rules="validations.fieldRules"
                          item-disabled="disable"
                            hide-details
                            class="mb-4"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="creationDate"
                          @input="dateMenu1 = false"
                          :min="'1800-01-01'"
                          locale="es-MX"
                        ></v-date-picker>
                      </v-menu>

                   <!--   <v-combobox
                        label="Institución catalogadora"
                         placeholder="Seleccione una opción"
                        outlined
                        dense
                        :items="instcata"
                        v-model="catalogingInstitution"
                        class="mb-4"
                        hide-details
                      ></v-combobox>---->

                      <!-- <v-menu
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
                      </v-menu> -->

                      <v-row justify="center">
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

                      <v-card-actions class="pl-5 pr-5">
                        <v-layout row wrap class="pa-3">
                          <v-btn block color="primary" @click="validate()" class="mb-2"
                            >Cargar PDF</v-btn>
                          <v-btn block color="secondary" @click="confirm2 = true" class="mb-2"
                            >Limpiar campos</v-btn>
                          <v-btn block color="#3091C5" @click="$refs.contentDFDialog.openDialog()" style="color : white" :disabled="file != null && file.type == 'application/pdf' ? false : true"
                            >Ver PDF</v-btn>
                        </v-layout>
                      </v-card-actions>

                    </v-form>
                  </v-card-text>
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
          ¿Esta seguro de proceder con la carga del documento PDF?
        </v-card-text>

        <v-card-text v-else>
          Cargando el archivo
        </v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn dark @click="confirm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="createImage()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirm2" max-width="300" persistent>
      <v-card>
        <v-card-title>Advertencia</v-card-title>

        <v-card-text>
          ¿Esta seguro de limpiar todos los campos?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn dark @click="confirm2 = false">Cancelar</v-btn>
          <v-btn color="primary" @click="reset(), confirm2 = false">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ContentDFDialog :pdfSrc="pdfSrc" :pdfTitle="title != null ? title : file != null ? file.name : ''" ref="contentDFDialog" :mode="false"/>
  </div>
</template>

<script>
  import { mapState } from "vuex";

  import ContentDFDialog from '~/components/editor/ContenPDFDialog.vue';
  import { orderNotebooks } from "~/static/functions";
export default {
  components : {
    ContentDFDialog
  },
  data: () => ({
    loading : false,
    dialog: false,

    dateMenu: false,
    dateMenu1: false,
    file: null,
    imgthumbnail : null,
    imgthumbnailSRC : null,
    showPixel : null,
    pixel : null,
    imgthumbnailB64 : null,
    imgcalidadB64 : null,
    imgcalidad : null,
    imgcalidadSRC : null,
    iconB64 : null,
    confirm: false,
    confirm2: false,
    creationDate: null,
    publicationDate: null,
    publicationRef: null,
    page: null,
    status: null,
    title: null,
    PhotographerRef: null,
    notebookRef: null,
    isPublished: true,
    isYearbook: false,
    PublishingAgencyRef : null,
    observations: null,
    place: null,
    graphRef: null,
    externalPhotographer: false,
    wasExported: false,
    clasificationRef: null,
    isSelleable: false,
    material: null,
    validations: {
      fieldRules : [(v) => !!v || "Campo requerido"]
    },
    PublishingAgency: [],
    clasifications: [],
    Photographers: [],
    publications: [],
    notebooks: [],
    notebooks2: [],
    pages : [],
    directors: ["Carlos R. Menéndez Navarrete","Abel Menéndez Romero","Carlos R. Menéndez González","Carlos R. Menéndez Losa"],
    imprenta:["Compañía Tipográfica Yucateca"],
    idioma:['Español'],
    instcata:['Grupo Megamedia'],
    catalogingInstitution : null,
    // periodicity : null,
    language : null,
    imprint : null,
    director : null,
    localSeries : null,

    pdfSrc : null,
  }),
  watch : {
    publicationRef( newValue ){
      this.notebooks2 = orderNotebooks(this.notebooks, newValue);
    },
    file( newValue ){
      if( newValue != null || newValue != undefined ){
        this.getSrc();
        this.imageToBase64(newValue);
      }else{
        this.iconB64 = null;
      }
    },
      imgthumbnail( newValue ){
        console.log('entro al metodo imgthumbnail' ,newValue);
      if( newValue != undefined || newValue != null){
        this.imgthumbnailSRC = null;
        this.imgthumbnailSRC = this.getImgPreview(newValue);
        console.log('getImgPreview----');
        console.log(this.imgthumbnailSRC);
        this.addimageToBase64(newValue, 1);
      }else{
        this.imgthumbnailB64 = null;
      }
    },
    imgcalidad( newValue ){
         console.log('entro al metodo calidad' ,newValue);
      if( newValue != undefined || newValue != null){
        this.imgcalidadSRC = null;
        this.imgcalidadSRC = this.getImgPreview(newValue);
         console.log('getImgPreview---');
        console.log(this.imgcalidadSRC);
        this.addimageToBase64(newValue, 2);
      }else{
        this.imgcalidadB64 = null;
      }
    }
  },
  computed: {
    ...mapState(["notebooksStore", "publicationsStore"]),
  },
  methods: {
    openDialog() {
      this.dialog = true;
      this.getPublications();
      this.getNotebooks();
      this.generatePages();
      this.getPhotographers();
      this.getPublishingAgency();
      this.getClasifications();
    },
    async getSrc() {
      let file = new Blob([this.file], {type: 'application/pdf'});
      const urlPreview = await URL.createObjectURL(file);
      this.pdfSrc = urlPreview;
    },
    test() {
      console.log("");
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
    async getPhotographers(){
      const response = await this.$axios.$get('/Photographer', {
        headers : { Authorization : 'Bearer ' + localStorage.token}
      });
      this.Photographers = response.data.Photographerobj;
      console.log(this.Photographers)
    },
    async getPublishingAgency(){
      const response = await this.$axios.get('/Agency', {
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });
      this.PublishingAgency = response.data.data.agenciaobj
    },
    async getClasifications(){
      const response = await this.$axios.$get('/Clasifications', {
        headers : { Authorization :  'Bearer ' + localStorage.token }
      });
      this.clasifications = response.data.body;
    },
    async createImage() {
      this.loading = true;
      let formData = new FormData();
      let body = {
        publicationDate: this.creationDate,
        title: this.title != null ? this.title : this.file.name, // titulo del pdf (este se usa para buscarlo de momento)
        fileName: this.file.name,
        place : this.place,
        lastEditionDate : new Date(),
        page: this.page != 'Desconocido' ? this.page : null,
        // agency: this.PublishingAgencyRef,
        publication: this.publicationRef,
        notebook: this.notebookRef,
        isSelleable : this.isSelleable,
         isPublished : this.isPublished,
        isYearbook : this.isYearbook,
        catalogingInstitution : this.catalogingInstitution,
        // periodicity : this.periodicity,
        language : this.language,
        imprint : this.imprint,
        director : this.director,
        localSeries : this.localSeries,

        Image64 : this.iconB64,
        imgthumbnailB64 : this.imgthumbnailB64,
        imgcalidadB64 : this.imgcalidadB64,
        //observations: string, // observaciones
        //section: string, // seccion sin definir como los anteriores
      };
      console.log(body);
      //formData.append("pdf", this.file);
      formData.append("body", JSON.stringify(body));

      try {
        const response = await this.$axios.$post("/pdfs", body, {
          headers: { Authorization: "Bearer " + localStorage.token },
          maxContentLength: 100000000,
          maxBodyLength: 1000000000
        });
        console.log('respuesta data PDF',response);

        this.$store.commit("openSnack", "El PDF se ha agregado exitosamente");

        this.cleanClose();
      } catch (e) {
        console.log(e.response)
        this.loading = false;
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return;
      }
    },
    cleanClose() {
      this.reset();
      console.log('VA EJECUTAR EL $parent.getPDFs()');
     // this.$parent.getPDFs();
      this.confirm = false;
      this.dialog = false;
      this.loading = false;
      this.isPublished = false;
      this.isYearbook = false;
      this.isSelleable = false;
    },
    generatePages(){
      this.pages.push('Desconocido');
      for( let i = 1; i <= 44; i++){
        this.pages.push(i);
      }
    },
    reset(){
      this.$refs.form.reset();
      this.$refs.formPDF.reset();
      this.file = null;
    },
    validate(){
      if(this.$refs.form.validate() && this.$refs.formPDF.validate()){
        this.confirm = true;
      }
    },
    imageToBase64 (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.iconB64 = reader.result;
        console.log(this.iconB64.length)
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    },
     addimageToBase64 (file,type) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if(type == 1){
           this.imgthumbnailB64 = reader.result;
             console.log('base 64 full 111',
         this.imgthumbnailB64
        );

        }
        if(type == 2){
          this.imgcalidadB64 = reader.result;
               console.log('base 64 full 222',
         this.imgcalidadB64
        );
        }

      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    },
     getImgPreview(file) {
      const urlPreview = URL.createObjectURL(file);
      const img = new Image();
      img.src = urlPreview;
      img.onload = () => {
        this.pixel = img.width + ' x ' + img.height;
        this.showPixel = img.width + ' x ' + img.height;
      }
      return urlPreview;
    },
  },
};
</script>
<style scoped>
  .listItemTitleTrue{
    text-align : left !important;
    color : White !important;
    font-size : 15px !important;
  }
  .listItemTitleFalse{
    padding-left: 12px !important;
  }
</style>
