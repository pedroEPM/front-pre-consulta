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

            <v-toolbar-title>Editor de documentos PDF</v-toolbar-title>
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
                  <v-card-text>
                    <v-text-field
                      outlined
                      label="Título"
                      v-model="title"
                      counter="98800"
                      :rules=" dialog != false ? validations.caracterLength :  validations.noRules "
                    ></v-text-field>
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
                          @click="openTODO(arrImg2[index])"
                          @error="errorHandler(index, item._id)"
                          style="cursor:pointed"
                        >
                          <v-img @error="errorHandler(index, item._id)" :src="arrImg[index]"></v-img>
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
                        v-model="pagePa"
                        :items="pagesP"
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
                            required
                          :rules="validations.fieldRules"
                          item-disabled="disable"
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

                      <v-text-field
                        label="Institución catalogadora"
                        outlined
                        dense
                        v-model="catalogingInstitution"
                        class="mb-4"
                        hide-details
                      ></v-text-field>

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
                  <v-card-actions class="pr-5 pl-5">
                    <v-layout row wrap class="pa-3">
                      <v-btn block color="primary" @click="validate()" class="mb-2"
                        >Cargar PDFS</v-btn
                      >
                      <v-btn block class="mb-2" color="secondary" @click="confirm2 = true"
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
              block class="mb-2" color="primary" @click="$refs.contentDFDialog.openDialog(), openSelect = false"
            >Ver PDF</v-btn>
            <v-btn
              block color="secondary" @click="$refs.contentZoomDialog.openDialog(image != workingPath ? imgPath + image : image), openSelect = false" class="mb-1"
            >Ver imagen</v-btn>
          </v-layout>

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
          <v-btn color="primary" @click="editPDFSSelection()">Aceptar</v-btn>
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
    <ContentDFDialog :pdfSrc="image" :pdfTitle="title != null ? title : ''" ref="contentDFDialog"/>
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
  data() {
    return {
      loading: false,
      dialog: false,

      dateMenu: false,
      dateMenu1: false,
      confirm: false,
      confirm2 : false,
      creationDate: null,
      publicationDate: null,
      publicationRef: null,
      pagePa: null,
      status: null,
      title: null,
      PhotographerRef: null,
      notebookRef: null,
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
        fieldRules : [(v) => !!v || "Campo requerido"]
      },
      imageFoot: null,
      PublishingAgency: [],
      clasifications: [],
      Photographers: [],
      publications: [],
      noteBooks: [],
      noteBooks2: [],
      pagesP: [],
      files: [],
      mode: null,
      cargando : 0,

      catalogingInstitution : null,
      periodicity : null,
      language : null,

      imprint : null,
      director : null,
      localSeries : null,

      pages : [],
      page : null,
      amount : 6,
      totalPages : null,
      files2 : [],
      loadingImage : false,
      imgPath: process.env.imgPath,
      openSelect : false,
      image : null,

      workingPath : process.env.workingPath,
      arrImg : [],
      arrImg2 : []
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
      console.log('Here is the error')
      console.log(this.$parent.selected)
    },
    openTODO( img ){
      this.image = img;
      console.log('---------------')
      console.log(this.image)
      console.log('---------------')
      this.openSelect = true;

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
    async editPDFSSelection() {
      this.loading = true;
      this.files2 = [];
      for(let i = 0; i <= this.$parent.selected.length; i++){
        this.cargando = ( i * 100 ) / this.$parent.selected.length;
        if( i === this.$parent.selected.length){
          this.cleanClose();
        }else{
          let respuesta = await this.editPDFS(this.$parent.selected[i]._id, this.$parent.selected[i], i);
          console.log(i + ' ' + respuesta)
        }
      }
    },
    async editPDFS( id, file, addPage ) {

      let body = {
        _id : id,
        title: this.title != undefined && this.title != null && this.title.trim() != '' ? this.title : file.title ,
        page : this.pagePa != 'Desconocido' ? this.pagePa + addPage : null,
        dateCreation: this.creationDate,
        publication: this.publicationRef,
        notebook: this.notebookRef,
        isSelleable : this.isSelleable,
        // isPublished : this.isPublished,
        isYearbook : this.isYearbook,
        catalogingInstitution : this.catalogingInstitution,
        lastEditionDate : new Date(),
        // periodicity : this.periodicity,
        language : this.language,
        // agency: this.PublishingAgencyRef,
        imprint : this.imprint,
        director : this.director,
        localSeries : this.localSeries,
      };
      console.log(body);

      try {
        const response = await this.$axios.$put("/pdfs", body, {
          headers: { Authorization: "Bearer " + localStorage.token },
        });
        this.$store.commit(
          "openSnack",
          "El documento PDFs se ha actualizado exitosamente"
        );
        return true;
      } catch (error) {
        // this.loading = false;
        console.log(id)
        console.log(error)
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return false;
      }
    },
    generatePages() {
      this.pagesP.push('Desconocido');
      for (let i = 1; i <= 44; i++) {
        this.pagesP.push(i);
      }
    },
    async cleanClose() {
      this.reset();
      this.$parent.loading = true;

      let pag = this.$parent.page;

      this.$parent.page = 1;
      this.$parent.advObj.quantity = 1;
      this.$parent.saveSearchedPage = [];
      await this.$parent.getPDFs();
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
    reset() {
      this.$refs.form.reset();
      // this.$refs.formPDF.reset();
      this.isPublished = false;
      this.isSelleable = false;
      this.isYearbook = false;
      this.title = null;
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
      this.arrImg2 = [];
      for( firstElement; firstElement < lastElement; firstElement++ ){
        if( firstElement == this.$parent.selected.length ){
          break;
        }
        this.files2.push(this.$parent.selected[firstElement]);
        console.log(this.files2)
        this.arrImg.push(this.imgPath+this.$parent.selected[firstElement].imageSrc);
        this.arrImg2.push(this.$parent.selected[firstElement].imageSrc);
      }
      this.loadingImage = false;
    },
    async errorHandler( i, id ){
      let img = this.arrImg[i];
      let img2 = this.arrImg2[i];
      setTimeout(() => {
        this.arrImg[i] = this.workingPath;
        this.arrImg2[i] = this.workingPath;
        console.log(this.arrImg[i])
        console.log(this.arrImg2[i])
      }, 1);
      try {
        const response = await this.$axios.$get('/pdfs/Createimage/' + id, {
          haeders : { Authorization : 'Bearer ' + localStorage.token }
        });

        console.log(response);

        if( response ){
          this.arrImg[i] = img;
          this.arrImg2[i] = img2;
        }
      } catch (error) {
        console.log(error.response);
      }
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
