<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Permisos</v-toolbar-title>
      <v-spacer />

      <v-btn class="primary" @click="$refs.permissionsAddDialog.openDialog()">
        <v-icon left>mdi-plus</v-icon>Agregar
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="permissionsHeaders"
        :items="permissions"
        :items-per-page="5"
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-icon
            class="mr-2"
            @click="$refs.permissionsEditDialog.openDialog(item)"
            >mdi-pencil</v-icon
          >
          <v-icon
            class="mr-2"
            @click="$refs.permissionsDeleteDialog.openDialog(item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>
    <PermissionsAddDialog ref="permissionsAddDialog" />
    <PermissionsEditDialog ref="permissionsEditDialog" />
    <PermissionsDeleteDialog ref="permissionsDeleteDialog" />
  </v-card>
</template>

<script>
import PermissionsAddDialog from "~/components/Configurations/PermissionsAddDialog.vue";
import PermissionsEditDialog from "~/components/Configurations/PermissionsEditDialog.vue";
import PermissionsDeleteDialog from "~/components/Configurations/PermissionsDeleteDialog.vue";
export default {
  components: {
    PermissionsAddDialog,
    PermissionsEditDialog,
    PermissionsDeleteDialog,
  },
  data() {
    return {
      permissions: [],
      permissionsHeaders: [
        { text: "Permiso", value: "name" },
        { text: "Acciones", value: "action", align: "center", sortable: false },
      ],
      permissionsHeaders2: [{ text: "Permiso", value: "name" }],
    };
  },
  created() {
    if (process.browser) {
      this.getPermissions();
    }
  },
  methods: {
    async getPermissions() {
      const response = await this.$axios.$get("/permissions", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      console.log("Here is response permissions");
      console.log(response);
      this.permissions = response.data;
    },
  },
};
</script>

<style>
</style>
