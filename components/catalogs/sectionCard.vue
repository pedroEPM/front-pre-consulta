<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Secciones</v-toolbar-title><v-spacer />
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
        label="Buscar sección"
        single-line
        style="width:300px"
        hide-details
      ></v-text-field>
      </div>
      <v-data-table :headers="headers" :items="search === null ? sections : searchingSections" :items-per-page="5">
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
          <v-icon class="mr-2" @click="$refs.deleteDialog.openDialog(item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>

    <SectionAddDialog ref="addDialog" />
    <SectionEditDialog ref="editDialog" />
    <SectionDeleteDialog ref="deleteDialog" />
    <CatalogTable :headers="headers2" :allItems="sections" :titulo="'Secciones'" :icon="false" :state="true" :publications="true" :type="false" ref="catalogTable"/>
  </v-card>
</template>

<script>
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import SectionAddDialog from "~/components/catalogs/sectionAddDialog";
  import SectionEditDialog from "~/components/catalogs/sectionEditDialog";
  import SectionDeleteDialog from "~/components/catalogs/sectionDeleteDialog";
  import { removeSpecialCharacters } from '~/static/functions';

export default {
  components: {
    SectionAddDialog,
    SectionEditDialog,
    SectionDeleteDialog
  },
  data: () => ({
    search : null,
    imgPath: process.env.imgPath,
    sections: [],
    searchingSections: [],
    headers: [
      { text: "Sección", sortable:false, value: "name" },
      { text : 'Publicación', value : 'PublicationReference.publicationName'},
      // { text : 'Estado', value : 'status'},
      { text: "Acciones", align: "center", value: "action", sortable: false },
    ],
    headers2: [
      { text: "Sección", value: "name" },
      { text : 'Publicación', value : 'PublicationReference.publicationName'},
      { text : 'Estado', value : 'status'},

    ],
    disabled : false,
  }),
  created() {
    if (process.browser) {
      this.getSections();
    }
  },
  watch: {
    search(newValue){
      if(newValue !== null && newValue !== undefined){
        this.searchingSections = [];
        this.sections.forEach(section => {
          if(removeSpecialCharacters(section.name, newValue)) {
            this.searchingSections.push(section);
          }
        })
      }
    }
  },
  methods: {
    async getSections() {
      const response = await this.$axios.$get("/section", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.sections = response.data.sections;
      this.searchingSections = this.sections;
    },
    async createPDF(){
      this.disabled = true;
      const doc = new jsPDF();
      let title = 'Secciones - ' + new Date().toISOString().substring(0, 10);
      let body = [];
      for(let i = 0; i < this.notebooks.length; i++){
        let data = [
          this.sections[i].name,
          this.sections[i].PublicationReference != null ? this.sections[i].PublicationReference.publicationName : '',
          this.sections[i].status == true ? 'Activo' : 'Inactivo',
        ]
        body.push(data);
      }
      doc.text( title, 75, 10);
      doc.setFontSize(12);
      doc.text('Lista de secciones', 10, 18);
      doc.autoTable();
      doc.autoTable({
        theme : 'striped',
        head : [[ 'Nombre', 'Publicación', 'Estado']],
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
