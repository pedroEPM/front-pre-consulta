<template>
  <v-card>
    <v-card-title>
     Departamentos
      <v-spacer />
      <v-btn color="primary" @click="$refs.departamentsGroupAddDialog.openDialog()"><v-icon left>mdi-plus</v-icon>Agregar</v-btn>
    </v-card-title>

    <v-card-text>
        <v-data-table :headers="groupHeaders" :items="groups" :items-per-page="20">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon @click="$refs.departamentsGroupEditDialog.openDialog(item)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon @click="$refs.departamentsGroupDeleteDialog.openDialog( item._id )"><v-icon>mdi-delete</v-icon></v-btn>
        </template>
      </v-data-table>
    </v-card-text>
    <DepartamentsGroupAddDialog ref="departamentsGroupAddDialog" />
    <DepartamentsGroupEditDialog ref="departamentsGroupEditDialog"/>
    <DepartamentsGroupDeleteDialog ref="departamentsGroupDeleteDialog" />
  </v-card>
</template>

<script>
  import DepartamentsGroupAddDialog from '~/components/Configurations/DepartamentsGroupAddDialog.vue';
  import DepartamentsGroupEditDialog from '~/components/Configurations/DepartamentsGroupEditDialog.vue';
  import DepartamentsGroupDeleteDialog from '~/components/Configurations/DepartamentsGroupDeleteDialog.vue';
  export default {
    components : {
      DepartamentsGroupAddDialog,
      DepartamentsGroupEditDialog,
      DepartamentsGroupDeleteDialog
    },
    data(){
      return {
        groupHeaders: [
          {
            text: "Nombre",
            align: "start",
            sortable: false,
            value: "name",
          },
          { text: "Acciones", value: "actions", aling: 'center', sortable: false },
        ],
        groups: [],
      }
    },
    created() {
      if(process.browser){
        this.getGroups();
      }
    },
    methods : {
      async getGroups() {
        this.loading = true;
        const response = await this.$axios.$get("/groups", {
          headers: { Authorization: "Bearer " + localStorage.token },
        });
        console.log(response);
        this.groups = response.data;
      },
    }
  }
</script>

<style>

</style>
