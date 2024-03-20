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

            <v-toolbar-title>Creación de Fotos</v-toolbar-title>
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
                <v-card outlined>

                  <v-card-text>
                    <v-textarea
                      outlined
                      label="Píe de foto"
                      height="6rem"
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

                    <!-- <v-form ref="formIMG">
                      <v-file-input
                        v-model="files"
                        outlined
                        label="Ingrese las fotos"
                        multiple
                        counter

                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small>
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
                    </v-form> -->
                  </v-card-text>

                  <v-card-text style="height: 68.5vh; overflow-y: auto" v-if="!loadingImage">
                    <v-layout row wrap>
                      <v-flex
                        xs6
                        md4
                        v-for="(item, index) in files2"
                        v-bind:key="index"
                      >
                        <v-card
                          @click="$refs.contentZoomDialog.openDialog(arrImg[index])"
                          style="cursor : pointer"
                        >
                          <v-img @error="errorHandler(index)" :src="arrImg[index]"></v-img>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                  <v-layout row wrap justify-center>

                    <v-flex xs12 md4 >
                      <v-pagination
                        v-model="page"
                        :length="totalPages"
                        :total-visible="$vuetify.breakpoint.mobile ? 5 : 7"
                        @input="nextPage()"
                      ></v-pagination>
                    </v-flex>

                    <v-flex xs12 md2 >
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

                      <!--
                      <v-text-field label="Página" outlined dense></v-text-field>
                      -->

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
                        :items="pagesI"
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

                      <v-text-field
                        label="Fotógrafo externo"
                        outlined
                        dense
                        v-model="externalPhotographer"
                        hide-details
                        class="mb-4"
                      ></v-text-field>

                      <v-select :items="materialdata" label="Material" outlined dense hide-details class="mb-4"></v-select>
                      <!--
                      <v-text-field label="Lugar" outlined dense></v-text-field>
                      <v-select label="Clasificación" outlined dense></v-select>
                      <v-select label="Agencia" outlined dense></v-select>
                      <v-select label="Fotógrafo" outlined dense></v-select>
                      <v-text-field
                        label="Fotógrafo externo"
                        outlined
                        dense
                      ></v-text-field>
                      <v-select label="Material" outlined dense></v-select>
                      -->
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
                            v-on="on"
                            class="mb-4"
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
                      <v-btn block color="primary" @click="validate()" class="mb-2"
                        >Cargar Imagen</v-btn>
                      <v-btn block color="secondary" @click="confirm2 = true"
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

    <v-dialog v-model="confirm" max-width="300" persistent>
      <v-card>
        <v-card-title v-if="!loading"> Advertencia </v-card-title>
        <v-card-title v-else> Cargando fotos </v-card-title>

        <v-card-text v-if="!loading">
          ¿Esta seguro de proceder con la carga de las fotos?
        </v-card-text>

        <v-card-text v-else>
          <v-progress-linear
            v-model="cargando"
            style="color : white"
            height="25"
          >
            <strong>{{ Math.ceil(cargando) }}%</strong>
          </v-progress-linear>
        </v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn dark @click="confirm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="editImageSelection()">Aceptar</v-btn>
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
  import ContentZoomDialog from '~/components/editor/contentZoomDialog.vue';
export default {
  components : {
    ContentZoomDialog
  },
  data: () => ({
    imgPath: process.env.imgPath,
    dialog: false,
    loading : false,
    loadingImage : false,
    confirm: false,
    confirm2 : false,
    materialdata : ['Negativo','Positivo','Diapositiva','Impresa','Digital'],
    dateMenu: false,
    dateMenu1: false,
    files: [],
    files2: [],
    creationDate: null,
    publicationDate: null,
    publicationRef: null,
    notebookRef: null,
    pageI : null,
    status : null,
    imageFoot: null,
    PhotographerRef: null,
    PublishingAgencyRef : null,
    observations: null,
    place: null,
    graphRef: null,
    externalPhotographer: null,
    wasExported: false,
    clasificationRef: null,
    material: null,
    validations: {
      fieldRules : [
        (v) => !!v || "Campo requerido",
      ],
      caracterLength : [
        ( v ) => v.length <= 98800 || 'El títutlo debe ser menor a 98800 caracteres',
      ]
    },

    PublishingAgency: [],
    clasifications: [],
    Photographers: [],
    publications: [],
    notebooks: [],
    notebooks2: [],
    pagesI: [],
    isSelleable : false,
    isPublished : false,
    isYearbook : false,

    mode: null,
    cargando : 0,
    pages : [],
    page : null,
    amount : 6,
    totalPages : null,
    attributedTitle : null,

    errImgPath : process.env.errImgPath,
    arrImg : []
  }),
  watch : {
    publicationRef( newValue ){
      for(let i = 0; i < this.publications.length; i++){
        if(newValue == this.publications[i]._id){
          this.icon = this.publications[i].icon;
        }
      }
      this.notebookRef = null;
      this.notebooks2 = [];
      this.notebooks.forEach( x => {
        if(x.PublicationReference && x.PublicationReference._id == newValue ){
          this.notebooks2.push(x);
        }
      });
      if( this.notebooks2.length == 0 ){
        this.notebooks2.push({ NoteBookName : 'No se encontraron cuadernos', status : true, _id : 'NO-VALIDO', disable: true});
      }else{
        let newObjetVoidT = [];
        let newObjetVoidF = [];

        this.notebooks2.forEach( ( x, index ) => {
          if( x.status == true ){
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

        newObjetVoidT.unshift({ NoteBookName : 'Vigente', status : true, _id : 'NO-VALIDO', disable: true});
        //newObjetVoidT.unshift({ NoteBookName : 'Todos los cuadernos', status : true, _id : null});

        this.notebooks2.forEach( ( x, index ) => {
          if( x.status == false ){
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

        newObjetVoidF.unshift({ NoteBookName : 'No vigente', status : false, _id : 'NOVALIDO', disable: true});

        this.notebooks2 = [];

        newObjetVoidT.forEach( x => {
          this.notebooks2.push(x);
        });
        newObjetVoidF.forEach( x => {
          this.notebooks2.push(x);
        });

      }
    }
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
      this.getPagination();
      this.getArrayImage( 1 );
    },
    getImgPreview(file) {
      // console.log(file);
      const urlPreview = URL.createObjectURL(file);
      return urlPreview;
    },
    async getPublications() {
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.publications = response.data.publicaciones;
      let newObjetVoidT = [];
      let newObjetVoidF = [];

      this.publications.forEach( ( x, index ) => {
        if( x.status == true ){
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

      newObjetVoidT.unshift({ publicationName : 'Vigente', status : true, _id : 'NO-VALIDO', disable: true});
      //newObjetVoidT.unshift({ publicationName : 'Todas las publicaciones', status : true, _id : null});

      this.publications.forEach( ( x, index ) => {
        if( x.status == false ){
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

      newObjetVoidF.unshift({ publicationName : 'No vigente', status : false, _id : 'NOVALIDO', disable: true});

      this.publications = [];

      newObjetVoidT.forEach( x => {
        this.publications.push(x);
      });
      newObjetVoidF.forEach( x => {
        this.publications.push(x);
      });
    },
    async getNotebooks() {
      const response = await this.$axios.$get("/NoteBooks", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.notebooks = response.data.notebooks;
      let newObjetVoidT = [];
      let newObjetVoidF = [];

      this.notebooks.forEach( ( x, index ) => {
        if( x.status == true ){
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

      newObjetVoidT.unshift({ NoteBookName : 'Vigente', status : true, _id : 'NO-VALIDO', disable: true});
      newObjetVoidT.unshift({ NoteBookName : 'Todos los cuadernos', status : true, _id : null});

      this.notebooks.forEach( ( x, index ) => {
        if( x.status == false ){
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

      newObjetVoidF.unshift({ NoteBookName : 'No vigente', status : false, _id : 'NOVALIDO', disable: true});

      this.notebooks = [];

      newObjetVoidT.forEach( x => {
        this.notebooks.push(x);
      });
      newObjetVoidF.forEach( x => {
        this.notebooks.push(x);
      });
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
    async editImageSelection() {
      this.loading = true;
      let staticPage = this.page;
      this.files2 = [];
      for(let i = 0; i <= this.$parent.selected.length; i++){
        this.cargando = ( i * 100 ) / this.$parent.selected.length;
        if( i === this.$parent.selected.length){
          this.cleanClose();
        }else{
          let respuesta = await this.editImage(this.$parent.selected[i]._id, i);
          console.log(i + ' ' + respuesta)
        }
      }

    },

    async editImage( id, addPage ) {

      let body = {
        _id: id,
        date: this.creationDate, //date creation, when the pic was taken
        publicationDate: this.publicationDate, //date publication
        ImageTitle: this.imageFoot != null ? this.imageFoot : this.file.name,
        publicationRef: this.publicationRef,
        noteBookRef: this.notebookRef,
        typeExtencion: ".png", // extension de imagen
        status: this.status, // estatus de la imagen "texto definido por el editor"
        description: this.imageFoot != null ? this.imageFoot : this.file.name, // pie de foto,
        page : this.pageI != 'Desconocido' ? this.pageI + addPage : null, // numero de pagina del pdf al que pertenece
        photographer: this.PhotographerRef, // nombre dle fotografo
        isPublished: this.isPublished, // iindica si esta publicada en un pdf o no
        isYearBook: this.isYearbook, // indica si pertence a un anuario
        section: this.PublishingAgencyRef, // indica la seccion a la que pertence (son demasiadas secciones)
        observations: this.observations, // texto que coloca el editor con respecto a la imagen
        place: this.place, // nombre o direccion en la cual fue tomada la imagen
        graphicRef: this.graphRef, // para cuando hayan graficos se agregara el id ahi
        externalFotographer: this.externalPhotographer, // indica si fue un fotografo externo quien tomo la foto
        itWasExported: this.wasExported, // indica si la iamgen fue exportada de otra revista/ mpresa
        canSell: this.isSelleable, // indica si la imagen se puede vender
        clasificationRef : this.clasificationRef,
        isPublished : this.isPublished,
        isYearBook : this.isYearbook,
        isSelleable : this.isSelleable,
        attributedTitle : this.attributedTitle,
        pixel : undefined,
      };
      console.log(body);

      try {
        const response = await this.$axios.$put("/Images", body, {
          headers: { Authorization: "Bearer " + localStorage.token },
        });
        console.log(response);
        this.$store.commit(
          "openSnack",
          "La imagen se ha actualizado exitosamente"
        );
        return true;

      } catch (error) {
        console.log(file)
        console.log(error)
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return false;
      }
    },
    async cleanClose() {
      this.reset();
      this.$parent.loading = true;

      let pag = this.$parent.page;

      this.$parent.page = 1;
      this.$parent.advObj.quantity = 1;
      this.$parent.saveSearchedPage = [];
      await this.$parent.getImages();
      await this.$parent.getPagination();

      this.$parent.page = pag;
      this.$parent.nextPage();
      this.$parent.selected = [];

      this.dialog = false;
      this.loading = false;
      this.confirm = false;
      this.cargando = 0;

      this.$parent.loading = false;

    },
    generatePages(){
      this.pagesI.push('Desconocido');
      for( let i = 1; i <= 44; i++ ){
        this.pagesI.push(i);
      }
    },
    reset() {
      this.$refs.form.reset();
      this.imageFoot = null;
      this.observations = null;
      this.isSelleable = false;
      this.isYearbook = false;
      this.isPublished = false;
    },
    validate(){
      if(this.$refs.form.validate()){
        this.confirm = true;
      }
    },
    getPagination() {
      this.page = 1;
      this.totalPages = Math.ceil(this.$parent.selected.length / this.amount);
      this.generateArrayPages(this.totalPages);
    },
    generateArrayPages(total) {
      this.pages = Array.from(Array(total + 1).keys());
      this.pages.shift();
    },
    nextPage() {
      this.getArrayImage( this.page );
    },
    getArrayImage( page ){
      this.loadingImage = true;
      let lastElement = ( page * this.amount );
      let firstElement = lastElement - this.amount;
      this.files2 = [];
      this.arrImg = [];
      for( firstElement; firstElement < lastElement; firstElement++ ){
        if( firstElement == this.$parent.selected.length ){
          break;
        }
        this.files2.push(this.$parent.selected[firstElement]);
        this.arrImg.push(this.imgPath+this.$parent.selected[firstElement].imageSrc);
      }
      this.loadingImage = false;

    },
    errorHandler( i ){
      this.arrImg[i] = this.errImgPath;
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
