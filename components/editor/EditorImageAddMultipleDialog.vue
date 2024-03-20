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

            <v-toolbar-title>Creación de Multiples fotos</v-toolbar-title>
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
                      label="Pie de foto"
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
                      label="Observaciones"
                      height="5rem"
                      v-model="observations"
                    ></v-textarea>

                    <v-form ref="formIMG">
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
                    </v-form>
                  </v-card-text>

                  <v-card-text style="height: 68.5vh; overflow-y: auto" v-if="!loadingImage">
                    <v-layout row wrap v-if="mode == 2">
                      <v-flex
                        xs6
                        md4
                        v-for="(item, index) in files2"
                        v-bind:key="index"
                      >
                        <v-card
                          style="cursor : pointer"
                          @click="$refs.contentZoomDialog.openDialog(item)"
                        >
                          <v-img :src="item"></v-img>
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
                            :style="colorstant(item)"
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
          <v-btn color="primary" @click="createImageSelection()">Aceptar</v-btn>
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
        <v-dialog v-model="reportfinal" max-width="400" persistent>
      <v-card>
        <v-card-title>Reporte de aviso</v-card-title>

        <v-card-text>
            <h3>Se subieron {{uploads}} correctamente!</h3>
         <h4>Estos archivos no se subieron correctamente</h4>
         <div>
           <center>
              <v-data-table
                  :headers="reportaddhead"
                  :items="reportadd"
                  hide-default-footer
                  class="elevation-1"
              ></v-data-table>
           </center>
         </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn dark @click="cerrarreporte()">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ContentZoomDialog ref="contentZoomDialog" />
  </div>
</template>

<script>
  import ContentZoomDialog from '~/components/editor/contentZoomDialog';
export default {
  components : {
    ContentZoomDialog
  },
  data: () => ({
    dialog: false,
    loading : false,
    loadingImage : false,
    confirm: false,
    confirm2 : false,
    materialdata : ['Negativo','Positivo','Diapositiva','Impresa','Digital'],
    dateMenu: false,
    dateMenu1: false,
    files: [],
    iconB64 : [],
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
    errori : 0 ,
    filetrack : null,
    reportfinal : false,
    externalPhotographer: null,
    wasExported: false,
    clasificationRef: null,
    material: null,
    validations: {
      fieldRules : [
        (v) => !!v || "Campo requerido",
      ],
      caracterLength : [
        ( v ) => !!v && v.length <= 98800 || 'El títutlo debe ser menor a 98800 caracteres',
      ]
    },

    PublishingAgency: [],
    clasifications: [],
    Photographers: [],
    publications: [],
    notebooks: [],
    notebooks2: [],
    pagesI: [],
    uploads : null,
    reportadd : [],
      reportaddhead: [
      {
        text: "Estado",
        align: "center",
        value: "text",
      },
      { text: "Nombre archivo", align: "center", value: "value"},
    ],
    isSelleable : false,
    isPublished : true,
    isYearbook : false,

    mode: null,
    cargando : 0,
    pages : [],
    amount : 6,
    totalPages : null,

    pixel : null,
    page : null,
    attributedTitle : null,
    arrayImgSRC : [],

    isExternPhoto : [
      { value : true, text : 'Es externo'},
      { value : false, text : 'Es interno'},
    ]
  }),
  watch : {
    files( newValue ){
      if( newValue != null ){
        this.arrayImgSRC = [];
        for( let i = 0; i < newValue.length; i++ ){
          this.arrayImgSRC.push(this.getImgPreview( newValue[i]));
          this.imageToBase64(newValue[i]);
        }
        this.getPagination();
        this.getArrayImage(1);
      }else{
        this.iconB64 = [];
      }
    },
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
    },
    getImgPreview(file) {
      const urlPreview = URL.createObjectURL(file);
      return urlPreview;
    },
    async getPixel( file ){
      const urlPreview = URL.createObjectURL(file);
      return await this.addImageProcess(urlPreview);
    },
    addImageProcess(src){
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img.width + ' x ' + img.height)
        img.onerror = reject
        img.src = src
      })
    },
    colorstant(item){
      if (item.subtittle == true){
        return 'background-color : #b3b3b3'
      }
      if (item.disable == true){
        return 'background-color : #b3b3b3'
      }
      return ''
    },
    cerrarreporte(){
      this.reportfinal = false;
      this.reportadd = [];
    },
    async getPublications() {
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      let publicationsAux = response.data.publicaciones;

      publicationsAux.sort(function(a, b) {
        return a.orden - b.orden;
      });
      publicationsAux.splice(0, 0, { publicationName : 'Todas las publicaciones', status : true, _id : null})
      publicationsAux.splice(1, 0, { publicationName : 'Medios Tradicionales', status : false, _id : 'Megamedia Editorial', disable: true})
      publicationsAux.splice(6, 0, { publicationName : 'La Factoría', status : false, _id : 'La Factoría', disable: true})
      publicationsAux.splice(11, 0, { publicationName : 'Medios ligeros', status : false, _id : 'Medios ligeros', disable: true})
      publicationsAux.splice(15, 0, { publicationName : 'Otras publicaciones', status : false, _id : 'Otras publicaciones', disable: true})
      //console.log(publicationsAux)
      this.publications = publicationsAux
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
      let photographerob = []
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
    async createImageSelection() {
      this.loading = true;
      let staticPage = this.page;
      this.files2 = [];
      switch (this.mode) {
        case 2:
          for(let i = 0; i <= this.files.length; i++){
            this.cargando = ( i * 100 ) / this.files.length;
            if( i === this.files.length){
              this.getPagination();
              this.getArrayImage( staticPage );
              this.cleanClose();
              if(this.reportadd.length > 0){
                this.reportfinal = true;
              }
            }else{
              let respuesta = await this.createImages(this.files[i], i);
              console.log(i + ' ' + respuesta)
            }
          }

          break;
      }
    },

    async createImages(file, addPage) {
      let formData = new FormData();
      let body = {
        CreationImage: this.creationDate,
        CreationImage: this.creationDate,
        publicationDate: this.publicationDate,
        imageTitle: this.imageFoot != null ? this.imageFoot : file.name,
        publicationRef: this.publicationRef,
        noteBookRef: this.notebookRef,
        typeExtencion: ".png",
        status: this.status,
        description: this.imageFoot != null ? this.imageFoot : file.name,
        page: this.pageI != 'Desconocido' ? this.pageI + addPage : null,
        photographer: this.PhotographerRef,
        section: this.PublishingAgencyRef,
        observations: this.observations,
        place: this.place,
        graphicRef: this.graphRef,
        externalFotographer: this.externalPhotographer,
        itWasExported: this.wasExported,
        canSell: this.isSelleable,
        clasificationRef : this.clasificationRef,
        isPublished : this.isPublished,
        isYearBook : this.isYearbook,
        isSelleable : this.isSelleable,
        pixels : undefined,
        attributedTitle : this.attributedTitle,
        type: ".png",
        Image64 : null,
      };
      let x = this.iconB64[addPage].length;
      let y = 100000;
      x = Math.round(( x / y ) + 1);
      for( let i = 0; i < x; i++){
        // body['Image64_' + i ] = this.iconB64.substring( ( i * y ), ( y * ( i + 1) ) );
        formData.append('Image64_' + i, this.iconB64[addPage].substring( ( i * y ), ( y * ( i + 1) ) ));
      }
      formData.append('x', x);
      console.log(body);
      formData.append("Imagen", file);
      formData.append("body", JSON.stringify(body));
      this.filetrack = file.name;

      try {
        const response = await this.$axios.$post("/Images", formData, {
          headers: { Authorization: "Bearer " + localStorage.token },
        });
      // console.log('respuesta de la imagen',response);
        let total = this.files.length;
        let position = (addPage + 1) - this.errori;
      this.$store.commit(
          "openSnack",
          "La imagen " + position + '/' + total + " se ha cargado exitosamente"
        );
       this.uploads =  position + '/' + total;
        return true;

      } catch (error) {
        console.log(file)
        console.log(error)
        var imgerror = this.filetrack;
        this.errori = this.errori + 1;
        this.reportadd.push({ text: "no registrado", value: this.filetrack });
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error en la imagen " + imgerror +  " , por favor intente de nuevo"
        );
        return false;
      }
    },

    cleanClose() {
      this.reset();
      console.log('subido');
      //this.$parent.getImages();
      this.errori = 0;
      this.confirm = false;
      this.dialog = false;
      this.loading = false;
    },
    generatePages(){
      this.pagesI.push('Desconocido');
      for( let i = 1; i <= 44; i++ ){
        this.pagesI.push(i);
      }
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.formIMG.reset();
      this.imageFoot = null;
      this.observations = null;
    },
    validate(){
      if(this.$refs.formIMG.validate() && this.$refs.form.validate()){
        this.confirm = true;
      }
    },
    getPagination() {
      this.page = 1;
      this.totalPages = Math.ceil(this.files.length / this.amount);
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
      for( firstElement; firstElement < lastElement; firstElement++ ){
        if( firstElement == this.arrayImgSRC.length ){
          break;
        }
        this.files2.push(this.arrayImgSRC[firstElement]);
      }
      this.loadingImage = false;

    },
    async getPixel( file ){
      const urlPreview = URL.createObjectURL(file);
      return await this.addImageProcess(urlPreview);
    },
    addImageProcess(src){
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img.width + ' x ' + img.height)
        img.onerror = reject
        img.src = src
      })
    },
    imageToBase64 (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.iconB64.push(reader.result);
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
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
