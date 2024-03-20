<template>
  <div>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Publicaciones</v-toolbar-title>
        <v-spacer />
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
        label="Buscar Publicación"
        single-line
        style="width:300px"
        hide-details
      ></v-text-field>
      </div>
        <v-data-table
          :headers="headers"
          :items="search === null ? publications : searchingPublications"
          :items-per-page="5"
          sort-by="order"
          :sort-desc="false"
        >
          <template v-slot:[`item.icon`]="{ item }">
            <v-img
              :src="imgPath + item.icon"
              :lazy-src="imgPath + item.icon"
              height="50"
              width="100"
              contain
            ></v-img>
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
    </v-card>

    <Publication-Add-Dialog ref="addDialog" />
    <Publication-Edit-Dialog ref="editDialog" />
    <Publication-Delete-Dialog ref="deleteDialog" />
    <CatalogTable :headers="headers2" :allItems="publications" :titulo="'Publicaciones'" :icon="true" :state="true" ref="catalogTable"/>
  </div>
</template>

<script>
import PublicationAddDialog from "~/components/catalogs/PublicationAddDialog";
import PublicationEditDialog from "~/components/catalogs/PublicationEditDialog";
import PublicationDeleteDialog from "~/components/catalogs/PublicationDeleteDialog";
import CatalogTable from '~/components/catalogs/CatalogTable';
import { removeSpecialCharacters } from '~/static/functions';

export default {
  components: {
    PublicationAddDialog,
    PublicationEditDialog,
    PublicationDeleteDialog,
    CatalogTable
  },
  data: () => ({
     search : null,
     sortBy: 'fat',
    sortDesc: false,
    imgPath: process.env.imgPath,
    publications: [],
    searchingPublications: [],
    headers: [
      {
        text: "Icono",
        align: "start",
        sortable: false,
        value: "icon",
      },
      { text: "Publicación", sortable: false, value: "publicationName"  },
      { text : 'Orden', value : 'order'},
      { text: "Acciones",     sortable: false, align: "center", value: "action", sortable: false },
    ],
    headers2: [
      {
        text: "Icono",
        align: "start",
        sortable: false,
        value: "icon",
      },
      { text: "Publicación", value: "publicationName" },
      { text : 'Estado', value : 'status'},
      { text: "Referencia XML", value: "XLM" },
      { text : 'Orden', value : 'order'},
      { text : 'Grupo', value : 'group'},
    ],
  }),
  created() {
    if (process.browser) {
      this.getPublications();
      console.log(process.env.imgPath)
    }
  },
  watch: {
    search(newValue){
      if(newValue !== null && newValue !== undefined){
        this.searchingPublications = [];
        this.publications.forEach(publication => {
          if(removeSpecialCharacters(publication.publicationName, newValue)){
            this.searchingPublications.push(publication);
          }
        })
      }
    }
  },
  methods: {
    async getPublications() {
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.publications = response.data.publicaciones;
      this.searchingPublications = this.publications;

    },
  },
};
</script>

<style>
</style>
