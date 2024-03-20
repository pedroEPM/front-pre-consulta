<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Agencias de publicación</v-toolbar-title>
      <v-spacer />
      <v-btn class="mr-1" color="secondary" @click="$refs.catalogTable.openDialog()">Ver más</v-btn>
      <v-btn color="primary" @click="$refs.addDialog.openDialog()">
        <v-icon left>mdi-plus</v-icon>Agregar
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="editionHeaders"
        :items="publishing"
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
          <v-icon color="mr-2" @click="$refs.editDialog.openDialog(item)">mdi-pencil</v-icon>
          <v-icon color="mr-2" @click="$refs.deleteDialog.openDialog(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>

    <PublishingAgencyAddDialog ref="addDialog"/>
    <PublishingAgencyEditDialog ref="editDialog"/>
    <PublishingAgencyDeleteDialog ref="deleteDialog"/>
    <CatalogTable :headers="headers2" :allItems="publishing" :titulo="'Agencias de publicación'" :icon="true" :state="false" ref="catalogTable"/>
  </v-card>
</template>

<script>

import PublishingAgencyAddDialog from '~/components/catalogs/PublishingAgencyAddDialog';
import PublishingAgencyEditDialog from '~/components/catalogs/PublishingAgencyEditDialog';
import PublishingAgencyDeleteDialog from '~/components/catalogs/PublishingAgencyDeleteDialog';

export default {
  components : {
    PublishingAgencyAddDialog,
    PublishingAgencyEditDialog,
    PublishingAgencyDeleteDialog
  },
  data(){
    return {
      imgPath: process.env.imgPath,
      publishing:[],
      editionHeaders: [
        { text: 'Nombre', align : 'start', value : 'name' },
        { text: 'Acciones', align : 'center', value : 'action', sortable : false }
      ],
      headers2: [
        { text: "Icono", align: "start", sortable: false, value: "icon"},
        { text: 'Nombre', align : 'start', value : 'name' },

      ]
    }
  },
  created(){
    if(process.browser){
      this.getPublishingAgency();
    }
  },
  methods: {
    async getPublishingAgency(){
      const response = await this.$axios.get('/Agency', {
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });
      this.publishing = response.data.data.agenciaobj
    }
  }
}
</script>

<style>

</style>
