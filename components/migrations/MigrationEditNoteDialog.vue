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
                  <v-card-actions>
                     <v-btn color="grey lighten-2" @click="$refs.editorNotePreviewDialog.openDialog()"
                      >Previsualizar nota</v-btn>
                  </v-card-actions>

                  <v-card-text>

                    <v-form ref="formNota">
                      <v-textarea
                        outlined
                        label="Nota"
                        height="73.7vh"
                        v-model="content"
                        :rules="validations.fieldRules"
                      ></v-textarea>
                    </v-form>
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
                        v-model="page"
                        :items="pages"
                        hide-details
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
                        v-model="subtitle"
                        hide-details
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

                      <v-textarea
                        outlined
                        label="Observaciones"
                        height="6rem"
                        v-model="observations"
                        hide-details
                      ></v-textarea>

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
      <v-card :loading="loading">
        <v-card-title>Advertencia</v-card-title>

        <v-card-text v-if="!loading">
          ¿Esta seguro de proceder a editar la nota?
        </v-card-text>

        <v-card-text v-else>
          Cargando la nota
        </v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn dark @click="confirm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="editNote()">Aceptar</v-btn>
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
    <EditorNotePreviewDialog ref="editorNotePreviewDialog" :observations="observations" :section="'NACIONAL - INTERNACIONAL'" :published="isPublished" :selleable="isSelleable" :agency="'REVISTA DE YUCATÁN'" :publishDate="publishDate" :id="cResponse.idMegamedia ? cResponse.idMegamedia : id" :page="page" :icon="icon" :content="content" :title="title" :subTitle="subtitle"/>
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
    page:null,
    id: null,

    cResponse: [],
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
    index : null
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
    openDialog( index ) {
      if(this.index != null){
        if(this.index != index){
          this.index = index;
          this.getNote();
        }
      }else{
        this.index = index;
        this.getNote();
      }


      this.dialog = true;
      this.getPublications();
      this.getNotebooks();
      this.generatePages();
    },
    async getPublications() {
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.publications = response.data.publicaciones;
    },
    async getNotebooks() {
      const response = await this.$axios.$get("/NoteBooks", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
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
    async getNote(){
      this.loading = true;
      try {
        const response = this.$parent.$parent.migrationCSV[this.index];

        this.cResponse = response;
        this.title = response.title;
        this.subtitle = response.subTitle;
        this.content = response.content;
        this.publicationRef = response.publicationRef != undefined
                            ? response.publicationRef
                            : null;
        this.notebookRef = response.noteBookRef != undefined
                            ? response.noteBookRef
                            : null;
        this.publishDate = response.date != undefined
                            ? new Date(response.date).toISOString().substring(0, 10)
                            : null;
        this.page = response.page != null
            ? response.page
            : 'Desconocido';
        this.autor = response.originalAuthor;
        this.observations = response.observations != undefined ? response.observations : null;
        this.isSelleable = response.isSelleable != undefined ? response.isSelleable : false;
        this.isPublished = response.isPublished != undefined ? response.isPublished : false;
        this.isYearbook = repsone.isYearbook != undefined ? response.isYearbook : null;

      } catch (error) {
        console.log(error.response)
      }

      this.loading = false;
    },
    async editNote() {
      this.loading = true;
      try {
        this.$parent.$parent.migrationCSV[this.index].title = this.title;
        this.$parent.$parent.migrationCSV[this.index].subTitle = this.subtitle;
        this.$parent.$parent.migrationCSV[this.index].content = this.content;
        this.$parent.$parent.migrationCSV[this.index].publicationRef =  this.publicationRef;
        this.$parent.$parent.migrationCSV[this.index].noteBookRef = this.notebookRef;
        this.$parent.$parent.migrationCSV[this.index].date = this.publishDate;
        this.$parent.$parent.migrationCSV[this.index].page = this.page != null ? this.page : 'Desconocido';
        this.$parent.$parent.migrationCSV[this.index].originalAuthor = this.autor;
        this.$parent.$parent.migrationCSV[this.index].observations = this.observations;
        this.$parent.$parent.migrationCSV[this.index].isSelleable = this.isSelleable;
        this.$parent.$parent.migrationCSV[this.index].isPublished = this.isPublished;
        this.$parent.$parent.migrationCSV[this.index].isYearbook = this.isYearbook;

        this.$store.commit(
        "openSnack",
        "La nota ha sido editada exitosamente"
        );
        this.cleanAndClose();
      } catch (error) {
        console.log(error)
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
      this.id = null;
      this.index = null;
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

