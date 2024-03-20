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

            <v-toolbar-title>Creaciones de documentos PDF</v-toolbar-title>
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
                      <!-- <v-textarea
                        outlined
                        label="Observaciones"
                        height="5rem"
                        v-model="observations"
                      ></v-textarea> -->

                      <v-file-input
                        :rules="validations.fieldRules"
                        v-model="files"
                        outlined
                        label="Ingrese los documentos PDF"
                        multiple
                        counter
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small>
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
                    </v-card-text>
                    <v-card-text style="height: 68.5vh; overflow-y: auto" v-if="files != null ? true : false">
                      <v-layout row wrap>
                        <v-flex
                          xs6
                          md4
                          v-for="(item, index) in files"
                          v-bind:key="index"
                        >
                          <v-card
                            @click="openPDFDialog( arraySrc[index], item.name )"
                            style="cursor:pointed"
                            class="justify-center"
                          >
                            <v-card-title>{{ item.name }}</v-card-title>
                            <v-card-text class="justify-center">
                              <v-icon class="hidden-sm-and-down" size="100"> mdi-file</v-icon>
                              <v-icon class="hidden-sm-and-up" size="50"> mdi-file</v-icon>
                            </v-card-text>
                          </v-card>
                        </v-flex>
                      </v-layout>
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

                      <v-combobox
                        label="Director"
                        outlined
                        dense
                         placeholder="Seleccione una opción"
                        v-model="director"
                        class="mb-4"
                        :items="directors"
                        hide-details
                      ></v-combobox>

                   <!--   <v-text-field
                        label="Lugar"
                        outlined
                        dense
                        v-model="place"
                        class="mb-4"
                        hide-details
                      ></v-text-field>--->

                    <!---  <v-text-field
                        label="Serie local"
                        outlined
                        dense
                        v-model="localSeries"
                        class="mb-4"
                        hide-details
                      ></v-text-field>---->

                   <!---   <v-combobox
                        label="Pie de imprenta"
                        outlined
                        dense
                        v-model="imprint"
                        class="mb-4"
                        placeholder="Seleccione una opción"
                        :items="imprenta"
                        hide-details
                      ></v-combobox> ----->

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
                      ></v-select>
 -->
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

                   <!----   <v-combobox
                        label="Idioma"
                        outlined
                        dense
                        :items="idioma"
                        v-model="language"
                        placeholder="Seleccione una opción"
                        class="mb-4"
                        hide-details
                      ></v-combobox> --->

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
                            required
                          :rules="validations.fieldRules"
                          item-disabled="disable"
                            hide-details
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

                    <!---  <v-combobox
                        label="Institución catalogadora"
                        outlined
                        placeholder="Seleccione una opción"
                        :items="instcata"
                        dense
                        v-model="catalogingInstitution"
                        class="mb-4"
                        hide-details
                      ></v-combobox> --->

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
                    <v-layout class="pa-3" row wrap>
                      <v-btn block color="primary" @click="validate()" class="mb-2"
                        >Cargar PDFS</v-btn
                      >
                      <v-btn block color="secondary" @click="confirm2 = true"
                        >Limpiar datos</v-btn
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

    <v-dialog v-model="confirm" max-width="300" persistent>
      <v-card>
        <v-card-title v-if="!loading">Advertencia</v-card-title>
        <v-card-title v-else>Cargando archivos</v-card-title>

        <v-card-text v-if="!loading">
          ¿Esta seguro de proceder con la carga de los documentos PDF?
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
          <v-btn color="primary" @click="createPDFSSelection()">Aceptar</v-btn>
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
    <ContentDFDialog :pdfSrc="fileSrc" :pdfTitle="titleSrc != null ?  titleSrc : '' " :mode="false" ref="contentDFDialog"/>
  </div>
</template>

<script>
  import ContentDFDialog from '~/components/editor/ContenPDFDialog.vue';
export default {
  components : {
    ContentDFDialog
  },
  data() {
    return {
      loading: false,
      dialog: false,

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
      errori : 0,
       filetrack : null,
    reportfinal : false,
    uploads: null,
        reportadd : [],
      reportaddhead: [
      {
        text: "Estado",
        align: "center",
        value: "text",
      },
      { text: "Nombre archivo", align: "center", value: "value"},
    ],
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
      imageFoot: null,
      PublishingAgency: [],
      clasifications: [],
      Photographers: [],
      publications: [],
      noteBooks: [],
      noteBooks2: [],
      pages: [],
      files: [],
      iconB64 : [],
    directors: ["Carlos R. Menéndez Navarrete","Abel Menéndez Romero","Carlos R. Menéndez González","Carlos R. Menéndez Losa"],
    imprenta:["Compañía Tipográfica Yucateca"],
    idioma:['Español'],
    instcata:['Grupo Megamedia'],
      mode: null,
      cargando : 0,

      catalogingInstitution : null,
      periodicity : null,
      language : null,
      imprint : null,
      director : null,
      localSeries : null,

      arraySrc : [],
      fileSrc : null,
      titleSrc : null,
    };
  },
  watch : {
    publicationRef( newValue ){
      this.notebookRef = null;
      this.noteBooks2 = [];
      this.noteBooks.forEach( x => {
        if(x.PublicationReference && x.PublicationReference._id == newValue ){
          this.noteBooks2.push(x);
        }
      });
      if( this.noteBooks2.length == 0 ){
        this.noteBooks2.push({ NoteBookName : 'No se encontraron cuadernos', status : true, _id : 'NO-VALIDO', disable: true});
      }else{
        let newObjetVoidT = [];
        let newObjetVoidF = [];

        this.noteBooks2.forEach( ( x, index ) => {
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

        this.noteBooks2.forEach( ( x, index ) => {
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

        this.noteBooks2 = [];

        newObjetVoidT.forEach( x => {
          this.noteBooks2.push(x);
        });
        newObjetVoidF.forEach( x => {
          this.noteBooks2.push(x);
        });

      }
    },
    async files( newValue ){
      if( newValue != null ){
        this.arraySrc = [];
        for( let i = 0; i < newValue.length; i++ ){
          await this.getSrc(newValue[i]);
          this.imageToBase64(newValue[i]);
          if( i == 0 ){
            this.fileSrc = this.arraySrc[0];
            this.titleSrc = newValue[0].name;
          }
        }
      }else{
        this.iconB64 = [];
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
    openPDFDialog( imgSRC, titleSRC){
     // console.log('AAAAAAA')
     // console.log(imgSRC);
     // console.log(titleSRC)
      this.fileSrc = imgSRC;
      this.titleSrc = titleSRC;
      this.$refs.contentDFDialog.openDialog();
    },
    async getSrc( addfile ) {
      let file = new Blob([addfile], {type: 'application/pdf'});
      const urlPreview = await URL.createObjectURL(file);
      this.arraySrc.push(urlPreview);
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
      this.noteBooks = response.data.notebooks;
      let newObjetVoidT = [];
      let newObjetVoidF = [];

      this.noteBooks.forEach( ( x, index ) => {
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

      this.noteBooks.forEach( ( x, index ) => {
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

      this.noteBooks = [];

      newObjetVoidT.forEach( x => {
        this.noteBooks.push(x);
      });
      newObjetVoidF.forEach( x => {
        this.noteBooks.push(x);
      });

    },
     cerrarreporte(){
      this.reportfinal = false;
      this.reportadd = [];
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
    async createPDFSSelection() {
      this.loading = true;
      switch (this.mode) {
        case 2:
          for(let i = 0; i <= this.files.length; i++){
            this.cargando = ( i * 100 ) / this.files.length;
            if( i === this.files.length){
              this.cleanAndClose();
              if(this.reportadd.length > 0){
                this.reportfinal = true;
              }
            }else{
              let respuesta = await this.createPDFS(this.files[i], i);
              console.log(i + ' ' + respuesta)
            }
          }
          break;
      }
    },
    async createPDFS(file, addPage) {
      let formData = new FormData();
      let body = {
        dateCreation: this.creationDate,
        title: file.name,
        page : this.page != 'Desconocido' ? this.page + addPage : null,
        // agency: this.PublishingAgencyRef,
        publication: this.publicationRef,
        notebook: this.notebookRef,
        isSelleable : this.isSelleable,
        isPublished : this.isPublished,
        isYearbook : this.isYearbook,
        catalogingInstitution : this.catalogingInstitution,
        // periodicity : this.periodicity,
        language : this.language,
        type: ".pdf",
        lastEditionDate : new Date(),
        imprint : this.imprint,
        director : this.director,
        localSeries : this.localSeries,
        Image64 : null//this.iconB64[addPage],
      };
      console.log(body);
      //--------cortando jsons por que son muy largos
      let x = this.iconB64[addPage].length;
      console.log(this.iconB64[addPage].length)
      console.log(this.iconB64[addPage].length)
      let y = 100000;
      x = Math.round(( x / y ) + 1);
      for( let i = 0; i < x; i++){
        // body['Image64_' + i ] = this.iconB64.substring( ( i * y ), ( y * ( i + 1) ) );
        formData.append('Image64_' + i, this.iconB64[addPage].substring( ( i * y ), ( y * ( i + 1) ) ));
      }
      formData.append('x', x);
      console.log(x)
      //--------cortando jsons por que son muy largos
      formData.append("pdf", file);
      formData.append("body", JSON.stringify(body));

        this.filetrack = file.name;

      try {
        const response = await this.$axios.$post("/pdfs", formData, {
          headers: { Authorization: "Bearer " + localStorage.token },
        });

        let total = this.files.length;
        let position = (addPage + 1) - this.errori;

        this.$store.commit(
          "openSnack",
          "El documento PDF " + position + '/' + total + " se ha agregado exitosamente"
        );
        this.uploads =  position + '/' + total;
        return true;
      } catch (error) {
        // this.loading = false;
        console.log(error)
         var pdfrror = this.filetrack;
        this.errori = this.errori + 1;
        this.reportadd.push({ text: "no registrado", value: this.filetrack });
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error en el pdf " + pdfrror +  " , por favor intente de nuevo"
        );
        return false;
      }
    },
    generatePages() {
      this.pages.push('Desconocido');
      for (let i = 1; i <= 44; i++) {
        this.pages.push(i);
      }
    },
    cleanAndClose() {
      this.reset();
     //this.$parent.getPDFs();
     this.errori = 0;
      this.confirm = false;
      this.dialog = false;
      this.loading = false;
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.formPDF.reset();
      this.isPublished = false;
      this.isSelleable = false;
      this.isYearbook = false;
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
