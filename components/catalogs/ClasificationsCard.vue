<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Clasificación</v-toolbar-title>
      <v-spacer />
      <v-btn class="mr-1" color="secondary" @click="$refs.catalogTable.openDialog()">Ver más</v-btn>
      <v-btn color="primary" @click="$refs.addDialog.openDialog()"><v-icon left>mdi-plus</v-icon> Agregar</v-btn>
    </v-toolbar>

    <v-card-text>
      <v-data-table
        :headers="clasificationHeaders"
        :items="clasifications"
        :items-per-page="5"
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

    <Clasifications-Add-Dialog ref="addDialog"/>
    <Clasifications-Edit-Dialog ref="editDialog"/>
    <Clasifications-Delete-Dialog ref="deleteDialog" />
    <CatalogTable :headers="headers2" :allItems="clasifications" :titulo="'Clasificación'" :icon="false" :state="false" ref="catalogTable"/>
  </v-card>
</template>

<script>
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
import ClasificationsAddDialog from '~/components/catalogs/ClasificationsAddDialog'
import ClasificationsEditDialog from '~/components/catalogs/ClasificationsEditDialog'
import ClasificationsDeleteDialog from '~/components/catalogs/ClasificationsDeleteDialog'
  import CatalogTable from '~/components/catalogs/CatalogTable';
export default {
  components: {
    ClasificationsAddDialog,
    ClasificationsEditDialog,
    ClasificationsDeleteDialog,
    CatalogTable
  },
  data: () => ({
    imgPath: process.env.imgPath,
    clasifications: [],
    clasificationHeaders: [
      { text: "Clasificación", value: "name" },
      { text: "Acciones", align: "center", value: "action", sortable: false },
    ],
    headers2: [
      { text: "Clasificación", value: "name" },
    ],
    disabled : false,
  }),
  created(){
    if(process.browser){
      this.getClasifications();
    }
  },
  methods : {
    async getClasifications(){
      const response = await this.$axios.$get('/Clasifications', {
        headers : { Authorization :  'Bearer ' + localStorage.token }
      });

      this.clasifications = response.data.body;
    },
    async createPDF(){
      this.disabled = true;
      const doc = new jsPDF();
      let title = 'Clasificación - ' + new Date().toISOString().substring(0, 10);
      let body = [];
      for(let i = 0; i < this.clasifications.length; i++){
        let data = [
          this.clasifications[i].name,
        ]
        body.push(data);
      }
      doc.text( title, 75, 10);
      doc.setFontSize(12);
      doc.text('Lista de clasificación', 10, 18);
      doc.autoTable();
      doc.autoTable({
        theme : 'striped',
        head : [[ 'Nombre' ]],
        body : body
      });
      this.disabled = false;
      doc.save(title);
    }
  }
};
</script>

<style>
</style>
