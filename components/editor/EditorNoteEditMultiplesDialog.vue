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
            <v-icon> mdi-newspaper-variant-outline </v-icon>
            <v-spacer />

            <v-toolbar-title>Edición de Nota</v-toolbar-title>
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
                    <v-card-text style="height: 68.5vh; overflow-y: auto" v-if="!loadingImage">
                        <v-layout row wrap>
                            <v-flex
                                xs6
                                md4
                                v-for="(item, index) in files2"
                                v-bind:key="index"
                            >
                                <v-card
                                @click="openVisualization(item)"
                                style="cursor:pointed"
                                >
                                    <v-card-title>{{item.title}}</v-card-title>
                                    <v-card-text class="justify-center">
                                        <v-icon class="hidden-sm-and-down" size="100"> mdi-newspaper-variant-outline</v-icon>
                                        <v-icon class="hidden-sm-and-up" size="50"> mdi-newspaper-variant-outline</v-icon>
                                    </v-card-text>
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
                        v-model="pageP"
                        :items="pagesP"
                        hide-details
                        class="mb-4"
                      ></v-select>


                      <v-text-field
                        label="Autor"
                        outlined
                        dense
                        v-model="autor"
                        hide-details
                        class="mb-4"
                        ></v-text-field>
                        <!-- :rules="validations.fieldRules" -->

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
                            v-model="publishDate"
                            label="Fecha de publicación"
                            append-icon="mdi-calendar"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                            :rules="validations.fieldRules"
                            hide-details
                            class="mb-4"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="publishDate"
                          @input="dateMenu = false"
                          locale="es-MX"
                        ></v-date-picker>
                      </v-menu>

                     <!-- <v-textarea
                        outlined
                        label="Observaciones"
                        height="6rem"
                        v-model="observations"
                        hide-details
                      ></v-textarea> -->

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
                      <v-btn block class="mb-3" color="primary" @click="validate()"
                        > Editar nota </v-btn>
                      <v-btn block class="mb-3" color="secondary" @click="confirm2 = true"
                      > Limpiar campos </v-btn>
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
          <v-btn color="primary" @click="editNotesSelection()">Aceptar</v-btn>
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
    <EditorNotePreviewDialog ref="editorNotePreviewDialog" :observations="observations" :section="'NACIONAL - INTERNACIONAL'" :published="isPublished" :selleable="isSelleable" :agency="'REVISTA DE YUCATÁN'" :publishDate="publishDate" :id="id" :page="page" :icon="icon" :content="content" :title="title" :subTitle="subtitle"/>
  </div>
</template>

<script>
  import EditorNotePreviewDialog from '~/components/editor/EditorNotePreviewDialog';
export default {
  components : {
    EditorNotePreviewDialog
  },
  data: () => ({
    loading : false,
    confirm : false,
    dialog: false,
    notebooks: [],
    notebooks2: [],
    publications: [],
    publishDate: null,
    dateMenu: false,
    publicationRef: null,
    notebookRef: null,
    title: null,
    subtitle: null,
    autor: null,
    content: null,
    isSelleable: false,
    isPublished: false,
    isYearbook: false,
    observations : null,
    pageP:null,
    id: null,
    pagesP: [],
    validations: {
      fieldRules : [
        (v) => !!v || "Campo requerido",
      ],
    },
    icon : '',
    confirm2 : false,

    pages : [],
    page : null,
    amount : 6,
    totalPages : null,
    files2 : [],
    loadingImage : false,
    cargando : 0,
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
    openDialog() {

      this.dialog = true;
      this.getPublications();
      this.getNotebooks();
      this.generatePages();

      this.getPagination();
      this.getArrayImage( 1 );
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
    async editNotesSelection() {
      this.loading = true;
      this.files2 = [];
      for(let i = 0; i <= this.$parent.selected.length; i++){
        this.cargando = ( i * 100 ) / this.$parent.selected.length;
        if( i === this.$parent.selected.length){
          this.cleanAndClose();
        }else{
          let respuesta = await this.editNote(this.$parent.selected[i]._id, this.$parent.selected[i], i);
          console.log(i + ' ' + respuesta)
        }
      }
    },
    async editNote( id, file, addPage ) {
      this.loading = true;
      try {
        const response = await this.$axios.$put("/note",
          {
            title: file.title,
            subTitle: file.subtitle,
            publicationRef: this.publicationRef,
            noteBookRef: this.notebookRef,
            section: null, // nunca se uso
            originalAuthor: this.autor,
            modifierAuthor: this.autor,
            page : this.pageP != 'Desconocido' ? this.pageP + addPage : null,
            date: this.publishDate,
            LastModifyDate: new Date(),
            content: file.content,
            isSelleable : this.isSelleable,
            isPublished : this.isPublished,
            isYearbook : this.isYearbook,
            observations : this.observations,
            _id: id
          },
          {
            headers: { Authorization: "Bearer " + localStorage.token },
          }
        );
        console.log(response);
        if (response) {
          this.$store.commit(
            "openSnack",
            "La nota ha sido editada exitosamente"
          );
        }
        return true;
      } catch (error) {
        console.log(error)
        this.loading = false;
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return false;
      }
    },
    generatePages(){
      this.pagesP.push('Desconocido');
      for( let i = 1; i <= 44; i++){
        this.pagesP.push(i);
      }
    },
    async cleanAndClose(){

      this.reset();
      this.$parent.loading = true;

      let pag = this.$parent.page;

      this.$parent.page = 1;
      this.$parent.advObj.quantity = 1;
      this.$parent.saveSearchedPage = [];
      await this.$parent.getNotes();
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
    reset(){
      this.$refs.form.reset();
      this.isSelleable = false;
      this.isPublished = false;
      this.isYearbook = false;
    },
    validate(){
      if(this.$refs.form.validate()){
        this.confirm = true;
      }
    },
    sendToStatics(){
      this.$router.push({
        path : '/chartsAndGraphics',
        query : {
          content : btoa(JSON.stringify(this.id)),
          mode : 'Notas'
        }
      });
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
      for( firstElement; firstElement < lastElement; firstElement++ ){
        if( firstElement == this.$parent.selected.length ){
          break;
        }
        this.files2.push(this.$parent.selected[firstElement]);
      }
      this.loadingImage = false;
      console.log('The problem is here')
      console.log(this.files2)
    },
    openVisualization( item ){
        this.title = item.title;
        this.content = item.content;
        this.subtitle = item.subtitle;

        this.$refs.editorNotePreviewDialog.openDialog();
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

