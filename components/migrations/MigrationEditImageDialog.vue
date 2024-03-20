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
                      :src="SRCImgPreview"
                      :lazy-src="SRCImgPreview"
                      @click="$refs.contentZoomDialog.openDialog(SRCImgPreview)"
                      @error="errorHandler"
                      style="cursor: pointer"
                      contain
                      height="400"
                      class="mb-3"
                    ></v-img>

                    <v-form ref="formIMG"
                    >
                      <v-textarea
                        outlined
                        label="Píe de foto"
                        height="10rem"
                        v-model="imageFoot"
                      ></v-textarea>
                      
                      <v-text-field
                        outlined
                        label="Título atribuido"
                        v-model="attributedTitle"
                      ></v-text-field>

                      <v-textarea
                        outlined
                        label="Observadores"
                        height="5rem"
                        v-model="observations"
                      ></v-textarea> 
                    </v-form>
                  </v-card-text>
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
                        :rules="validations.fieldRules"
                        hide-details
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

                      <v-select
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

                      <v-select label="Material" outlined dense class="mb-4" hide-details></v-select>
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
                      <v-btn block color="primary" @click="validate" class="mb-2"
                        >Actualizar Imagen</v-btn>
                      <v-btn block color="secondary" @click="confirm2 = true" class="mb-2"
                        >Limpiar campos</v-btn>
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

        <v-card-text v-else>
          Cargando la imagen
        </v-card-text>

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
  </div>
</template>

<script>
import LoaderCard from "~/components/LoaderCard";
import ContentZoomDialog from '~/components/editor/contentZoomDialog';

export default {
  components: {
    LoaderCard,
    ContentZoomDialog
  },
  data: () => ({
    dialog: false,
    loading: false,
    loadingCard : false,
    dateMenu: false,
    dateMenu1: false,
    files: [],
    imgPath: process.env.imgPath,
    errImgPath : process.env.errImgPath,
    image: null,
    confirm: false,
    confirm2 : false,

    id: null,
    creationDate: null,
    publicationDate: null,
    title: null,
    publicationRef: null,
    notebookRef: null,
    PhotographerRef: null,
    clasificationRef: null,
    PublishingAgencyRef : null,
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
    validations: {
      fieldRules : [(v) => !!v || "Campo requerido"]
    },
    Photographers: [],
    PublishingAgency: [],
    clasifications: [],
    pages: [],
    publications: [],
    notebooks: [],
    notebooks2: [],

    showPixel : null,
    pixel : null,
    page : null,
    attributedTitle : null,
    index : null,
    SRCImgPreview : null

  }),
  watch : {
    publicationRef( newValue ){
      for(let i = 0; i < this.publications.length; i++){
        if(newValue == this.publications[i]._id){
          this.icon = this.publications[i].icon;
        }
      }
      this.notebooks2 = [];
      this.notebooks.forEach( x => {
        if(x.PublicationReference && x.PublicationReference._id == newValue ){
          this.notebooks2.push(x);
        }
      });
      if( this.notebooks2.length == 0 ){
        this.notebooks2.push({ NoteBookName : 'No se encontraron cuadernos', status : true, _id : 'NO-VALIDO', disable: true});
      }else{
        this.notebooks2.sort(function (a, b) {
          if (a.NoteBookName > b.NoteBookName) {
            return 1;
          }
          if (a.NoteBookName < b.NoteBookName) {
            return -1;
          }
          return 0;
        });
        this.notebooks2.unshift({ NoteBookName : 'Vigente', status : true, _id : 'NO-VALIDO', disable: true});
        this.notebooks2.unshift({ NoteBookName : 'No vigente', status : false, _id : 'NOVALIDO', disable: true});
        
        let newObjetVoid = [];
        this.notebooks2.forEach( ( x, index ) => {
          if( x.status == true ){
            newObjetVoid.push(x);
          }
        }); 
        this.notebooks2.forEach( ( x, index ) => {
          if( x.status == false ){
            newObjetVoid.push(x);
          }
        });
        
        this.notebooks2 = newObjetVoid;

      }
    },
  },
  methods: {
    openDialog(index) {
      // this.reset();
      if(this.index != null){
        if(this.index != index){
          this.index = index;
          this.getImage();
        }
      }else{
        this.index = index;
        this.getImage();
      }
      this.SRCImgPreview = this.getImgPreview(this.$parent.$parent.files2[this.index]);
      this.dialog = true;
      this.getPublications();
      this.getNotebooks();
      this.generatePages();
      this.getPublishingAgency();
      this.getPhotographers();
      this.getClasifications();
    },

    getImgPreview(file) {
      if( file != null){
        const urlPreview = URL.createObjectURL(file);
        return urlPreview;
      }
    },

    async getPublications() {
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.publications = response.data.publicaciones;
      //console.log(response);
    },
    async getNotebooks() {
      const response = await this.$axios.$get("/NoteBooks", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      //console.log(response);
      this.notebooks = response.data.notebooks;
      this.notebooks.sort(function (a, b) {
        if (a.NoteBookName > b.NoteBookName) {
          return 1;
        }
        if (a.NoteBookName < b.NoteBookName) {
          return -1;
        }
        return 0;
      });
      this.notebooks.unshift({ NoteBookName : 'Vigente', status : true, _id : 'NO-VALIDO', disable: true});
      this.notebooks.unshift({ NoteBookName : 'No vigente', status : false, _id : 'NOVALIDO', disable: true});
      
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
    async getImage() {
      this.loading = true;
      const response = this.$parent.$parent.migrationCSV[this.index];
      console.log(response)
      
      this.observations = response.descripcion;
      //this.image = this.imgPath + response.imageSrc;
      this.imageFoot = response.nombre;
      this.publicationRef = response.idPublicacion;
      this.notebookRef = response.idCuaderno;
      this.pageI = response.pagina != null
          ? response.pagina
          : 'Desconocido';

      this.PhotographerRef = response.idFotografo;

      this.place = response.lugar;
      this.PublishingAgencyRef = response.seccion;
      this.creationDate =
        response.date != null
          ? new Date(response.date).toISOString().substring(0, 10)
          : null;
      this.publicationDate =
        response.publicationDate != null
          ? new Date(response.publicationDate)
              .toISOString()
              .substring(0, 10)
          : null;
      this.clasificationRef = response.idClasificacion;

      this.isPublished = response.publicada;
      this.isYearbook = response.anuario;
      this.isSelleable = response.vendible;
      this.externalPhotographer = response.fotografoExterno;

      this.showPixel = '0 x 0'
      this.pixel = this.showPixel;

      this.attributedTitle = response.attributedTitle != undefined ? response.attributedTitle : null;

      this.loading = false;
    },
    async updateImage() {
      this.loadingCard = true;
      try {
        this.$parent.$parent.migrationCSV[this.index].date = this.creationDate; //date creation; when the pic was taken
        this.$parent.$parent.migrationCSV[this.index].publicationDate = this.publicationDate; //date publication
        this.$parent.$parent.migrationCSV[this.index].nombre = this.imageFoot != null ? this.imageFoot : this.$parent.$parent.files2[this.index].name;
        this.$parent.$parent.migrationCSV[this.index].idPublicacion = this.publicationRef;
        this.$parent.$parent.migrationCSV[this.index].idCuaderno = this.notebookRef;
        //status: this.status; // estatus de la imagen "texto definido por el editor"
        //caption: this.imageFoot != null ? this.imageFoot : this.file.name; // pie de foto;
        this.$parent.$parent.migrationCSV[this.index].pagina = this.pageI != 'Desconocido' ? this.pageI : null; // numero de pagina del pdf al que pertenece
        this.$parent.$parent.migrationCSV[this.index].photographer = this.PhotographerRef; // nombre dle fotografo
        this.$parent.$parent.migrationCSV[this.index].publicada = this.isPublished; // iindica si esta publicada en un pdf o no
        this.$parent.$parent.migrationCSV[this.index].anuario = this.isYearbook; // indica si pertence a un anuario
        this.$parent.$parent.migrationCSV[this.index].seccion =  this.PublishingAgencyRef; // indica la seccion a la que pertence (son demasiadas secciones)
        this.$parent.$parent.migrationCSV[this.index].descripcion = this.observations; // texto que coloca el editor con respecto a la imagen
        this.$parent.$parent.migrationCSV[this.index].lugar = this.place; // nombre o direccion en la cual fue tomada la imagen
        //graphicRef: this.graphRef; // para cuando hayan graficos se agregara el id ahi
        this.$parent.$parent.migrationCSV[this.index].fotografoExterno = this.externalPhotographer; // indica si fue un fotografo externo quien tomo la foto
        //itWasExported: this.wasExported; // indica si la iamgen fue exportada de otra revista/ mpresa
        //canSell: this.isSelleable; // indica si la imagen se puede vender
        //clasificationRef : this.clasificationRef;
        this.$parent.$parent.migrationCSV[this.index].publicada = this.isPublished; // iindica si esta publicada en un pdf o no
        this.$parent.$parent.migrationCSV[this.index].anuario = this.isYearbook; // indica si pertence a un anuario
        this.$parent.$parent.migrationCSV[this.index].vendible = this.isSelleable;
        //pixels : this.pixel;
        this.$parent.$parent.migrationCSV[this.index].attributedTitle = this.attributedTitle;
        this.cleanClose();

        this.$store.commit(
          "openSnack",
          "La imagen se ha actualizado exitosamente"
        );

        this.$parent.getImages();
        this.confirm = false;
        this.loadingCard = false;
      } catch (error) {
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        this.loadingCard = false;
        return;
      }
    },
    generatePages(){
      this.pages.push('Desconocido');
      for( let i = 1; i <= 44; i++ ){
        this.pages.push(i);
      }
    },
    reset(){
      this.$refs.form.reset();
      this.$refs.formIMG.reset();
      this.index = null;
    },
    cleanClose() {
      this.$refs.form.reset();
      this.$refs.formIMG.reset();
      this.confirm = false;
      this.dialog = false;
      this.loading = false;
      this.id = null;
    },
    validate(){
      if(this.$refs.form.validate() && this.$refs.formIMG.validate()){
        this.confirm = true;
      }
    },
    async getPixel(){
      const img = new Image();
      img.src = this.imgPath + this.image;
      img.onload = () => {
        this.pixel = img.width + ' x ' + img.height;
        this.showPixel = img.width + ' x ' + img.height;
      }
      try {
        const response = await this.$axios.$put('/imageP', {
          id : this.id,
          size : this.pixel,
          headers : { Authorization: "Bearer " + localStorage.token },
        });


      } catch (error) {
        console.log(error.response);
      }
      return img.width + ' x ' + img.height;
    },
    errorHandler(){
      this.image = this.errImgPath;
      this.$forceUpdate()
    }
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
