<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Puestos</v-toolbar-title>
      <v-spacer />
      <v-btn class="mr-1" color="secondary" @click="$refs.catalogTable.openDialog()">Ver más</v-btn>
      <v-btn color="primary" @click="$refs.positionAddDialog.openDialog()"><v-icon left>mdi-plus</v-icon> Agregar</v-btn>
    </v-toolbar>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="positions"
        :items-per-page="5"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="$refs.positionEditDialog.openDialog(item._id)"
            >mdi-pencil</v-icon
          >
          <v-icon class="mr-2" @click="$refs.positionDeleteDialog.openDialog(item._id)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>
    <PositionAddDialog ref="positionAddDialog" />
    <PositionEditDialog ref="positionEditDialog" />
    <PositionDeleteDialog ref="positionDeleteDialog" />

    <CatalogTable :headers="headers2" :allItems="positions" :titulo="'Puestos'" :icon="false" :state="false" ref="catalogTable"/>
  </v-card>
</template>

<script>
  import PositionAddDialog from '~/components/catalogs/PositionAddDialog';
  import PositionEditDialog from '~/components/catalogs/PositionEditDialog';
  import PositionDeleteDialog from '~/components/catalogs/PositionDeleteDialog';
  import CatalogTable from '~/components/catalogs/CatalogTable';

  export default {
    components : {
      PositionAddDialog,
      PositionEditDialog,
      PositionDeleteDialog,
      CatalogTable
    },
    data(){
      return {
        positions : [],
        headers : [
          { text : 'Puesto', value : 'position' },
          { text : 'Acciones', align : 'center', value : 'actions', sortable : false }
        ],
        headers2 : [
          { text : 'Puesto', value : 'position' },

        ]
      }
    },
    created(){
      if( process.browser ){
        this.getPositions();
      }
    },
    methods : {
      async getPositions(){
        const response = await this.$axios.$get('/position', {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        this.positions = response.data;
      }
    }
  }
</script>

<style>

</style>
