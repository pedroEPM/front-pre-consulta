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

            <v-toolbar-title>Creaciones de documento PDF</v-toolbar-title>
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
                          :rules=" dialog != false ? validations.caracterLength :  validations.noRules "
                        ></v-text-field>

                        <!-- <v-textarea
                          outlined
                          label="Observaciones"
                          height="5rem"
                          v-model="observations"
                        ></v-textarea> -->
                    </v-card-text>
                  </v-form>

                </v-card>
              </v-flex>

              <v-flex xs12 md4>
                <v-card
                  outlined

                >
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
                      >
                        <template v-slot:item="{ item, attrs, on }">
                          <v-list-item v-on="on" v-bind="attrs">
                            <v-list-item-content>
                              <v-list-item-title>
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

                      <v-text-field
                        label="Director"
                        outlined
                        dense
                        v-model="director"
                        class="mb-4"
                        hide-details
                      ></v-text-field>

                      <v-text-field
                        label="Lugar"
                        outlined
                        dense
                        v-model="place"
                        class="mb-4"
                        hide-details
                      ></v-text-field>

                      <v-text-field
                        label="Serie local"
                        outlined
                        dense
                        v-model="localSeries"
                        class="mb-4"
                        hide-details
                      ></v-text-field>

                      <v-text-field
                        label="Píe de imprenta"
                        outlined
                        dense
                        v-model="imprint"
                        class="mb-4"
                        hide-details
                      ></v-text-field>

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

                      <v-text-field
                        label="Idioma"
                        outlined
                        dense
                        v-model="language"
                        class="mb-4"
                        hide-details
                      ></v-text-field>

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
                            class="mb-4"
                            hide-details
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="creationDate"
                          @input="dateMenu1 = false"
                          :min="'1800-01-01'"
                          locale="es-MX"
                        ></v-date-picker>
                      </v-menu>

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

                      <v-text-field
                        label="Institución catalogadora"
                        outlined
                        dense
                        v-model="catalogingInstitution"
                        class="mb-4"
                        hide-details
                      ></v-text-field>

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
                      <v-btn block color="primary" @click="validate()" class="mb-3"
                      >Cargar PDF</v-btn>
                      <v-btn block color="secondary" @click="confirm2 = true" class="mb-3"
                      >Limpiar datos</v-btn>
                      <v-btn block class="mb-2" color="#3091C5" style="color : white" @click="$refs.contentDFDialog.openDialog(), openSelect = false"
                      >Ver PDF</v-btn>
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
          <v-btn
            icon @click="openSelect = false"
          ><v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-layout class="pa-3" row wrap>
            <v-btn
              block color="secondary" @click="$refs.contentZoomDialog.openDialog(image), openSelect = false" class="mb-1"
            >Ver imagen</v-btn>
          </v-layout>
          
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirm" max-width="300">
      <v-card
        :loading="loading"
      >
        <v-card-title>Advertencia</v-card-title>

        <v-card-text v-if="!loading">
          ¿Esta seguro de proceder con la actualización del documento PDF?
        </v-card-text>

        <v-card-text v-else>
          Cargando el documento PDF
        </v-card-text>

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
    <ContentZoomDialog ref="contentZoomDialog" />
    <ContentDFDialog :pdfSrc="pdfSrc" :pdfTitle="title != null ? title : ''" ref="contentDFDialog" :mode="false"/>
  </div>
</template>

<script>
  import ContentZoomDialog from '~/components/editor/contentZoomDialog';
  import ContentDFDialog from '~/components/editor/ContenPDFDialog.vue';

export default {
  components : {
    ContentZoomDialog,
    ContentDFDialog
  },
  data: () => ({
    imgPath: process.env.imgPath,

    loading: false,
    dialog : false,

    dateMenu : false,
    dateMenu1 : false,
    confirm : false,
    confirm2 : false,
    creationDate : null,
    publicationDate : null,
    publicationRef : null,
    page : null,
    status: null,
    title: null,
    PhotographerRef: null,
    notebookRef : null,
    isPublished: false,
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
      fieldRules : [
        (v) => !!v || "Campo requerido",
      ],
      caracterLength : [
        ( v ) => !!v && v.length <= 98800 || 'El títutlo debe ser menor a 98800 caracteres',
      ],
      noRules : []
    },
    imageFoot : null,
    id : null,
    image : null,
    PublishingAgency: [],
    clasifications: [],
    Photographers: [],
    publications : [],
    noteBooks : [],
    noteBooks2 : [],
    pages : [],
    files : [],
    mode : null,

    catalogingInstitution : null,
    periodicity : null,
    language : null,
    imprint : null,
    director : null,
    localSeries : null,

    openSelect : false,
    errImgPath : process.env.errImgPath,
    imagePDF : null,
    index : null,
    pdfSrc : null,
  }),
  watch : {
    publicationRef( newValue ){
      this.noteBooks2 = [];
      this.noteBooks.forEach( x => {
        if(x.PublicationReference && x.PublicationReference._id == newValue ){
          this.noteBooks2.push(x);
        }
      });
      if( this.noteBooks2.length == 0 ){
        this.noteBooks2.push({ NoteBookName : 'No se encontraron cuadernos', status : true, _id : 'NO-VALIDO', disable: true});
      }else{
        this.noteBooks2.sort(function (a, b) {
          if (a.NoteBookName > b.NoteBookName) {
            return 1;
          }
          if (a.NoteBookName < b.NoteBookName) {
            return -1;
          }
          return 0;
        });
        this.noteBooks2.unshift({ NoteBookName : 'Vigente', status : true, _id : 'NO-VALIDO', disable: true});
        this.noteBooks2.unshift({ NoteBookName : 'No vigente', status : false, _id : 'NOVALIDO', disable: true});
        
        let newObjetVoid = [];
        this.noteBooks2.forEach( ( x, index ) => {
          if( x.status == true ){
            newObjetVoid.push(x);
          }
        }); 
        this.noteBooks2.forEach( ( x, index ) => {
          if( x.status == false ){
            newObjetVoid.push(x);
          }
        });
        
        this.noteBooks2 = newObjetVoid;
        
      }
    }
  },
  methods : {
    async openDialog( index ){
      if(this.index != null){
        if(this.index != index){
          this.index = index;
          await this.getPDF();
        }
      }else{
        this.index = index;
        await this.getPDF();
      }
      await this.getSrc()
      this.dialog = true;
      this.getPublications();
      this.getNotebooks();
      this.generatePages();
      this.getPhotographers();
      this.getPublishingAgency();
      this.getClasifications();
    },
    async updatePDF(){
      this.loading = true;

      try {
            this.$parent.$parent.migrationCSV[this.index].nombre = this.title != null ? this.title.substring(0,98800) : this.$parent.$parent.files2[this.index].name;
            this.$parent.$parent.migrationCSV[this.index].pagina = this.page != 'Desconocido' ? this.page : null;
            this.$parent.$parent.migrationCSV[this.index].date = this.creationDate;
            this.$parent.$parent.migrationCSV[this.index].idPublicacion = this.publicationRef;
            this.$parent.$parent.migrationCSV[this.index].cuaderno =  this.notebookRef;
            this.$parent.$parent.migrationCSV[this.index].lastEditionDate = new Date();
            this.$parent.$parent.migrationCSV[this.index].isSelleable = this.isSelleable;
            // isPublished : this.isPublished,
            this.$parent.$parent.migrationCSV[this.index].isYearbook = this.isYearbook;
            this.$parent.$parent.migrationCSV[this.index].catalogingInstitution = this.catalogingInstitution;
            // periodicity : this.periodicity,
            this.$parent.$parent.migrationCSV[this.index].language = this.language;
            // agency: this.PublishingAgencyRef,
            this.$parent.$parent.migrationCSV[this.index].imprint = this.imprint;
            this.$parent.$parent.migrationCSV[this.index].director = this.director;
            this.$parent.$parent.migrationCSV[this.index].localSeries = this.localSeries;
            this.$parent.$parent.migrationCSV[this.index].place = this.place;
            this.$store.commit(
            'openSnack',
            'El documento PDF se ha actualizado'
            );

        this.cleanAndClose();

      } catch (error) {
        this.loading = false;
        this.confirm = false;

        console.log(error)
        this.$store.commit(
          'openSnack',
          'Ha ocurrido un error, por favor intente de nuevo'
        );
        return;
      }
    },
    async getPublications(){
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.publications = response.data.publicaciones;
    },
    async getNotebooks() {
      const response = await this.$axios.$get("/NoteBooks", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.noteBooks = response.data.notebooks;
      this.noteBooks.sort(function (a, b) {
        if (a.NoteBookName > b.NoteBookName) {
          return 1;
        }
        if (a.NoteBookName < b.NoteBookName) {
          return -1;
        }
        return 0;
      });
      this.noteBooks.unshift({ NoteBookName : 'Vigente', status : true, _id : 'NO-VALIDO', disable: true});
      this.noteBooks.unshift({ NoteBookName : 'No vigente', status : false, _id : 'NOVALIDO', disable: true});
      
      let newObjetVoid = [];
      this.notebooks.forEach( ( x, index ) => {
        if( x.status == true ){
          newObjetVoid.push(x);
        }
      }); 
      this.notebooks.forEach( ( x, index ) => {
        if( x.status == false ){
          newObjetVoid.push(x);
        }
      });
      
      this.notebooks = newObjetVoid;

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
    async getPDF(){
        const response = this.$parent.$parent.migrationCSV[this.index];


        this.title = response.nombre;
        this.creationDate = new Date(response.date).toISOString().substring(0,10);
        this.publicationRef = response.idPublicacion;
        this.notebookRef = response.cuaderno
        this.PublishingAgencyRef = response.agency != null
            ? response.agency
            : null;
        this.page = response.pagina;
        this.place = response.place;

        this.image = this.imgPath + response.imageSrc;
        this.imagePDF = response.imageSrc;

        this.catalogingInstitution = response.catalogingInstitution != undefined ? response.catalogingInstitution : null;
        this.periodicity = response.periodicity != undefined ? response.periodicity : null;
        this.language = response.language != undefined ? response.language : null;

        this.isPublished = response.isPublished != undefined ? response.isPublished : false;
        this.isSelleable = response.isSelleable != undefined ? response.isSelleable : false;
        this.isYearbook = response.isYearbook != undefined ? response.isYearbook : false;

        this.director = response.director;
        this.localSeries = response.localSeries;
        this.imprint = response.imprint;    

    },
    generatePages(){
      this.pages.push('Desconocido');
      for( let i = 1; i <= 44; i++){
        this.pages.push(i);
      }

    },
    cleanAndClose(){
      this.reset();
      //this.$parent.getPDFs();
      this.confirm = false;
      this.dialog = false;
      this.loading = false;
      this.id = null;
    },
    reset(){
      this.$refs.form.reset();
      this.$refs.formPDF.reset();
      this.isPublished = false;
      this.isSelleable = false;
      this.isYearbook = false;
      this.id = null;
      this.index = null;
    },
    validate(){
      if(this.$refs.form.validate() && this.$refs.formPDF.validate()){
        this.confirm = true;
      }
    },
    async getSrc() {
      let file = new Blob([this.$parent.$parent.files2[this.index]], {type: 'application/pdf'});
      const urlPreview = await URL.createObjectURL(file);
      this.pdfSrc = urlPreview;
    },
    errorHandler(){
      console.log(this.errImgPath);
      this.image = this.errImgPath;
      console.log('arriba')
      this.$forceUpdate()
    }
  }
}
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
