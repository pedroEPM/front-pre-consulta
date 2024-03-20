<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Ediciones</v-toolbar-title>
      <v-spacer />
      <v-btn class="mr-1" color="secondary" @click="$refs.catalogTable.openDialog()">Ver más</v-btn>
      <v-btn color="primary" @click="$refs.addDialog.openDialog()"
        ><v-icon left>mdi-plus</v-icon> Agregar</v-btn
      >
    </v-toolbar>

    <v-card-text>
      <v-data-table
        :headers="editionHeaders"
        :items="editions"
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

    <Edition-Add-Dialog ref="addDialog" />
    <Edition-Edit-Dialog ref="editDialog" />
    <Edition-Delete-Dialog ref="deleteDialog" />
    <CatalogTable :headers="headers2" :allItems="editions" :titulo="'Ediciones'" :icon="true" :state="false" ref="catalogTable"/>
  </v-card>
</template>

<script>
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
import EditionAddDialog from "~/components/catalogs/EditionAddDialog";
import EditionEditDialog from "~/components/catalogs/EditionEditDialog";
import EditionDeleteDialog from "~/components/catalogs/EditionDeleteDialog";

export default {
  components: {
    EditionAddDialog,
    EditionEditDialog,
    EditionDeleteDialog,
  },
  data: () => ({
    imgPath: process.env.imgPath,
    editions: [],
    editionHeaders: [
      // {
      //   text: "Icono",
      //   align: "start",
      //   sortable: false,
      //   value: "icon",
      // },
      { text: "Edición", value: "editionName" },
      { text: "Publicación", value: "PublicationReference.publicationName" },
      { text: "Acciones", align: "center", value: "action", sortable: false },
    ],
    headers2 : [
      //  {
      //   text: "Icono",
      //   align: "start",
      //   sortable: false,
      //   value: "icon",
      // },      
      { text: "Edición", value: "editionName" },
      { text: "Publicación", value: "PublicationReference.publicationName" },
    ],
    disabled : false,
  }),
  created(){
    if (process.browser){
      this.getEditions();
    }
  },
  methods: {
    async getEditions(){
      const response = await this.$axios.$get('/Editions', {
        headers: { Authorization: 'Bearer ' + localStorage.token },
      });
      this.editions = response.data.edition;
    },
    async createPDF(){
      this.disabled = true;
      const doc = new jsPDF();
      let title = 'Ediciones - ' + new Date().toISOString().substring(0, 10);
      let body = [];
      for(let i = 0; i < this.editions.length; i++){
        let data = [
          '',
          this.editions[i].editionName,
        ]

        body.push(data);
      }
      doc.text( title, 75, 10);
      doc.setFontSize(12);
      doc.text('Lista de Ediciones', 10, 18);
      doc.autoTable();
        // let img = document.createElement('img');
        let src = this.imgPath + this.editions[0].icon;
        // img.id = 'imgPrueba';
        // document.body.appendChild(img)
      doc.autoTable({
        theme : 'striped',
        head : [[ 'Ícono', 'Nombre']],
        body : body,
        didDrawCell: function(data) {
          if (data.column.index === 0 && data.cell.section === 'body') {
            var td = data.cell.raw;
            var dim = data.cell.height - data.cell.padding('vertical');
            var textPos = data.cell.textPos;
            // console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
            console.log(data.cell)
            console.log(dim)
            doc.addImage(src, data.cell.x,  data.cell.y, dim, dim);
          }
        }
      });
      this.disabled = false;
      doc.save(title);
    }
  }
};
</script>

<style>
</style>
