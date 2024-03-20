<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Cuadernos</v-toolbar-title><v-spacer />
      <v-btn class="mr-1" color="secondary" @click="$refs.catalogTable.openDialog()">Ver más</v-btn>
      <v-btn color="primary" @click="$refs.addDialog.openDialog()"
        ><v-icon left>mdi-plus</v-icon> Agregar</v-btn
      >
    </v-toolbar>

    <v-card-text>
        <div>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar Cuadernos"
        single-line
        style="width:300px"
        hide-details
      ></v-text-field>
      </div>
      <v-data-table :headers="headers" :items="search === null ? notebooks : searchingNotebooks" :items-per-page="5">
        <template v-slot:[`item.image`]="{ item }">
          <v-img
            :src="imgPath + item.icon"
            :lazy-src="imgPath + item.icon"
            height="50"
            width="100"
            contain
          ></v-img>
        </template>
          <template v-slot:[`item.status`]="{ item }">
                  <label v-if="item.status == undefined "> Desconocido </label>
                  <label v-if="item.status == true ">Vigente</label>
                  <label v-if="item.status == false ">No vigente </label>
          </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-icon class="mr-2" @click="$refs.editDialog.openDialog(item)"
            >mdi-pencil</v-icon
          >
          <v-icon class="mr-2" @click="$refs.deleteDialog.openDialog(item._id)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>

    <Notebook-Add-Dialog ref="addDialog" />
    <Notebook-Edit-Dialog ref="editDialog" />
    <Notebook-Delete-Dialog ref="deleteDialog" />
    <CatalogTable :headers="headers2" :allItems="notebooks" :titulo="'Cuadernos'" :icon="false" :state="true" :publications="true" :type="true" ref="catalogTable"/>
  </v-card>
</template>

<script>
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
import NotebookAddDialog from "~/components/catalogs/NotebookAddDialog";
import NotebookEditDialog from "~/components/catalogs/NotebookEditDialog";
import NotebookDeleteDialog from "~/components/catalogs/NotebookDeleteDialog";
import { removeSpecialCharacters } from '~/static/functions';

export default {
  components: {
    NotebookAddDialog,
    NotebookEditDialog,
    NotebookDeleteDialog,
  },
  data: () => ({
    search : null,
    imgPath: process.env.imgPath,
    notebooks: [],
    searchingNotebooks: [],
    headers: [
      { text: "Cuaderno", sortable:false, value: "NoteBookName" },
      { text : 'Publicación', value : 'PublicationReference.publicationName'},
      { text : 'Estado', value : 'status'},
      { text : 'Orden', value : 'order'},
      { text: "Acciones", align: "center", value: "action", sortable: false },
    ],
    headers2: [
      { text: "Cuaderno", value: "NoteBookName" },
      { text : 'Publicación', value : 'PublicationReference.publicationName'},
      { text : 'Estado', value : 'status'},
      { text : 'Tipo', value : 'type'},
      { text : 'Orden', value : 'order'},

    ],
    disabled : false,
  }),
  created() {
    if (process.browser) {
      this.getNotebooks();
    }
  },
  watch: {
    search(newValue){
      if(newValue !== null && newValue !== undefined){
        this.searchingNotebooks = [];
        this.notebooks.forEach(notebook => {
          if(removeSpecialCharacters(notebook.NoteBookName, newValue) || notebook._id.toLowerCase().includes(newValue.toLowerCase()) ) {
            this.searchingNotebooks.push(notebook);
          }
        })
      }
    }
  },
  methods: {
    async getNotebooks() {
      const response = await this.$axios.$get("/NoteBooks", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.notebooks = response.data.notebooks;
      this.searchingNotebooks = this.notebooks;
    },
    async createPDF(){
      this.disabled = true;
      const doc = new jsPDF();
      let title = 'Cuadernos - ' + new Date().toISOString().substring(0, 10);
      let body = [];
      for(let i = 0; i < this.notebooks.length; i++){
        let data = [
          this.notebooks[i].NoteBookName,
          this.notebooks[i].PublicationReference != null ? this.notebooks[i].PublicationReference.publicationName : '',
          this.notebooks[i].status == true ? 'Activo' : 'Inactivo',
          this.notebooks[i].type != undefined ? this.notebooks[i].type : '',
        ]
        body.push(data);
      }
      doc.text( title, 75, 10);
      doc.setFontSize(12);
      doc.text('Lista de cuadernos', 10, 18);
      doc.autoTable();
      doc.autoTable({
        theme : 'striped',
        head : [[ 'Nombre', 'Publicación', 'Estado', 'Tipo']],
        body : body
      });
      this.disabled = false;
      doc.save(title);
    }
  },
};
</script>

<style>
</style>
