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

            <v-toolbar-title>Creación de Nota</v-toolbar-title>
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
                  <v-card-actions>
                    <v-btn color="grey lighten-2" @click="$refs.editorNotePreviewDialog.openDialog()"
                      >Previsualizar nota</v-btn>
                  </v-card-actions>

                  <v-card-text>

                    <v-form ref="formNota">
                      <editor
                        v-if="showEditor"
                        :api-key="'zlsfl8mrv98mfeg0jmyckhx3pwagf392svpd77b0n999imuh'"
                        :init="{
                          height: 600,
                          menubar: false,
                          plugins: [
                            'advlist autolink lists link anchor fullscreen insertdatetime paste code table wordcount',
                          ],
                          toolbar:
                            'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | link | code | fullscreen | table tabledelete | \
                            tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | \
                            tableinsertcolbefore tableinsertcolafter tabledeletecol',
                        }"
                        v-model="content"
                      />
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
                        hide-details
                        class="custom-field mb-4"
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
                        v-model="page"
                        hide-details
                        :items="pages"
                        class="mb-4"
                      ></v-select>

                      <v-text-field
                        label="Título"
                        outlined
                        dense
                        v-model="title"
                        :rules="validations.fieldRules"
                        hide-details
                        class="mb-4"
                      ></v-text-field>

                      <v-text-field
                        label="Subtítulo"
                        outlined
                        dense
                        hide-details
                        v-model="subtitle"
                        class="mb-4"
                      ></v-text-field>

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
                            hide-details
                            dense
                            v-bind="attrs"
                            v-on="on"
                            :rules="validations.fieldRules"
                            class="mb-4"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="publishDate"
                          @input="dateMenu = false"
                          locale="es-MX"
                        ></v-date-picker>
                      </v-menu>

                      <v-text-field
                        label="Mongo PDF ID"
                        outlined
                        dense
                        v-model="idMongoPDF"
                        hide-details
                        class="mb-4"
                      ></v-text-field>

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
                        > Crear nota </v-btn>
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
      <v-card :loading="loading">
        <v-card-title>Advertencia</v-card-title>

        <v-card-text v-if="!loading">
          ¿Esta seguro de proceder a crear la nota?
        </v-card-text>

        <v-card-text v-else>
          Cargando la nota
        </v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn dark @click="confirm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="createNote()">Aceptar</v-btn>
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

    <EditorNotePreviewDialog ref="editorNotePreviewDialog" :observations="observations" :section="'NACIONAL - INTERNACIONAL'" :published="isPublished" :selleable="isSelleable" :agency="'REVISTA DE YUCATÁN'" :publishDate="publishDate" :id="'-------------------------'" :page="page" :icon="icon" :content="content" :title="title" :subTitle="subtitle"/>
  </div>
</template>

<script>
  import EditorNotePreviewDialog from '~/components/editor/EditorNotePreviewDialog';
  import Editor from '@tinymce/tinymce-vue'
export default {
  components : {
    EditorNotePreviewDialog,
    Editor
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
    isPublished: true,
    isYearbook: false,
    observations : null,
    page:null,
    idMongoPDF: null,
    pages: [],
    validations: {
      fieldRules : [
        (v) => !!v || "Campo requerido",
      ],
      caracterLength : [
        ( v ) => v.length <= 98800 || 'El títutlo debe ser menor a 98800 caracteres',
      ]
    },
    icon : '',

    confirm2 : false,
    showEditor : false
  }),
  watch : {
    dialog( newValue ){
      if( !newValue ){
        this.showEditor = false;
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
    openDialog() {
      this.dialog = true;
      this.getPublications();
      this.getNotebooks();
      this.generatePages();
      setTimeout(() => {
        this.showEditor = true;
      }, 1);
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
    async createNote() {
      this.loading = true;
      console.log("Creando nota");
      try {
        const response = await this.$axios.$post(
          "/addNote",
          {
            title: this.title,
            subTitle: this.subtitle,
            publicationRef: this.publicationRef,
            noteBookRef: this.notebookRef,
            page : this.page !== 'Desconocido' ? this.page : 0,
            originalAuthor: this.autor,
            date: this.publishDate,
            content: this.content,
            idMongoPDF: this.idMongoPDF?.trim(),
            isSelleable : this.isSelleable,
            isPublished : this.isPublished,
            isYearbook : this.isYearbook,
          },
          {
            headers: { Authorization: "Bearer " + localStorage.token },
          }
        );
        console.log(response);
        if (response) {
          this.$store.commit(
            "openSnack",
            "La nota ha sido creada exitosamente"
          );
        // this.$parent.getNotes();
          this.cleanAndClose();
        }
      } catch (error) {
        this.loading = false;
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return;
      }
    },
    generatePages(){
      this.pages.push('Desconocido');
      for( let i = 1; i <= 44; i++){
        this.pages.push(i);
      }
    },
    cleanAndClose(){
      this.reset();
      this.confirm = false;
      this.loading = false;
      this.dialog = false;
    },
    reset(){
      this.$refs.form.reset();
      this.$refs.formNota.reset();
      this.isSelleable = false;
      this.isPublished = false;
      this.isYearbook = false;
    },
    validate(){
      if(this.$refs.formNota.validate() && this.$refs.form.validate()){
        this.confirm = true;
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
