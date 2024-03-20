<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Fotógrafos</v-toolbar-title>
      <v-spacer />
      <v-btn class="mr-1" color="secondary" @click="$refs.catalogTable.openDialog()">Ver más</v-btn>
      <v-btn color="primary" @click="$refs.addDialog.openDialog()">
        <v-icon left>mdi-plus</v-icon> Agregar
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <div>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar Fotógrafo"
        single-line
        style="width:300px"
        hide-details
      ></v-text-field>
      </div>
      <v-data-table
        :headers="editionHeaders"
        :items="search === null ? photographers : SearchingPhotographers"
        :items-per-page="5"
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-icon class="mr-2" @click="$refs.editDialog.openDialog(item)">mdi-pencil</v-icon>
          <v-icon class="mr-2" @click="$refs.deleteDialog.openDialog(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>

    <PhotographersAddDialog ref="addDialog"/>
    <PhotographersDeleteDialog ref="deleteDialog"/>
    <PhotographersEditDialog ref="editDialog" />
    <CatalogTable :headers="headers2" :allItems="photographers" :titulo="'Fotógrafos'" :icon="false" :state="true" ref="catalogTable"/>
  </v-card>
</template>

<script>
import PhotographersAddDialog from '~/components/catalogs/PhotographersAddDialog';
import PhotographersDeleteDialog from '~/components/catalogs/PhotographersDeleteDialog';
import PhotographersEditDialog from '~/components/catalogs/PhotographersEditDialog';
import { removeSpecialCharacters } from '~/static/functions';

export default {
  components : {
    PhotographersAddDialog,
    PhotographersDeleteDialog,
    PhotographersEditDialog
  },
  data(){
    return {
      search : null,
      photographers: [],
      SearchingPhotographers: [],
      editionHeaders: [
      { text : 'Nombre', align : 'start', value : 'name' },
      { text : 'Apellido', align : 'start', value : 'lname' },
      { text : 'Télefono', align : 'start', value : 'phone' },
      { text : 'Acciones', align : 'center', value : 'action', sortable : false }
      ],
      headers2: [
      { text : 'Nombre', align : 'start', value : 'name' },
      { text : 'Apellido', align : 'start', value : 'lname' },
      { text : 'Télefono', align : 'start', value : 'phone' },
      { text : 'Estado', value : 'status'},
      { text : 'Correo', value : 'email'},
      { text : 'Teléfono', value : 'phone'},
      ]
    }
  },
  created(){
    if(process.browser){
      this.getPhotographers();
    }
  },
  watch: {
    search(newValue){
      if(newValue !== null && newValue !== undefined){
        this.SearchingPhotographers = [];
        this.photographers.forEach(photographer => {
          if(removeSpecialCharacters(photographer.name, newValue) || removeSpecialCharacters(photographer.lname, newValue)){
            this.SearchingPhotographers.push(photographer);
          }
        })
      }
    }
  },
  methods: {
    async getPhotographers(){
      const response = await this.$axios.$get('/Photographer', {
        headers : { Authorization : 'Bearer ' + localStorage.token}
      });
      this.photographers = response.data.Photographerobj;
      this.SearchingPhotographers = response.data.Photographerobj;
    },
  },
};
</script>

<style>

</style>
