<template>
  <div>
    <v-card>
      <v-card-title>
        {{ isAdmin ? 'Administradores' : 'Usuarios' }}
        <v-spacer />

        <v-btn color="primary" @click="$refs.addUserDialog.openDialog()"
          ><v-icon left>mdi-account-plus</v-icon> Agregar</v-btn
        >
      </v-card-title>
      <v-layout row wrap pl-5>
        <v-flex xs12 md8 class="">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            single-line
            hide-details
            :label="isAdmin ? 'Buscar administradores' : 'Buscar usuarios'"
            :placeholder="isAdmin ? 'Buscar administradores' : 'Buscar usuarios'"
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-card-text>
        <v-data-table :headers="headers" :items="search === null ? users : searchingUsers" :items-per-page="20">
          <template v-slot:[`item.number`]="{ item }">
            {{ users.indexOf(item) }}
          </template>
          <template v-slot:[`item.activate`]="{ item }">
            <v-chip small outlined color="primary" v-if="item.activate">Activo</v-chip>
            <v-chip small outlined color="red" v-else>Inactivo</v-chip>

            <!--
              <v-btn small color="teal">Aceptar</v-btn>
              <v-btn small color="red">Rechazar</v-btn>
              -->
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              icon
              @click="
                $refs.permitsUserDialog.openDialog(item.permissions, item._id)
              "
              ><v-icon>mdi-shield-edit</v-icon></v-btn
            >
            <v-btn icon @click="$refs.editUserDialog.openDialog(item)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-btn v-if="!isAdmin" icon @click="$refs.delUserDialog.openDialog(item._id)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
            <v-btn v-if="!isAdmin" icon @click="$refs.viewHistorialLogsDialog.openDialog(item._id)">
              <v-icon>mdi-history</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <Add-User-Dialog ref="addUserDialog" :isAdmin="isAdmin" @actualizartabla="actualizartabla"/>
    <Edit-User-Dialog ref="editUserDialog" :isAdmin="isAdmin"/>
    <Delete-User-Dialog ref="delUserDialog" />
    <Permissions-User-Dialog ref="permitsUserDialog" :isAdmin="isAdmin" />
    <ViewUserHistorialDialog ref="viewHistorialLogsDialog" />
  </div>
</template>

<script>
import AddUserDialog from "~/components/Configurations/AddUserDialog.vue";
import EditUserDialog from "~/components/Configurations/EditUserDialog.vue";
import PermissionsUserDialog from "~/components/Configurations/PermissionsUserDialog.vue";
import DeleteUserDialog from "~/components/Configurations/DeleteUserDialog.vue";
import ViewUserHistorialDialog from '~/components/Configurations/ViewUserHisorialLogs.vue';
import { removeSpecialCharacters } from '~/static/functions';

export default {
  components: {
    AddUserDialog,
    DeleteUserDialog,
    EditUserDialog,
    PermissionsUserDialog,
    ViewUserHistorialDialog,
  },
  data: () => ({
    loading: false,
    headers: [
      {
        text: "No.",
        align: "start",
        sortable: false,
        value: "number",
      },
      { text: "Solicitante", value: "name" },
      { text: "Correo / Usuario", value: "email" },
      { text: "Departamento", value: "job.position" },
      { text: "Estado", value: "activate", align: "center" },
      { text: "Acciones", value: "actions", width: '25%', sortable: false },
    ],
    users: [],
    searchingUsers: [],
    search : null,
  }),
  props : {
    isAdmin : {
      type : Boolean,
      default : false
    }
  },
  created() {
    if (process.browser) {
      this.getUsers();
    }
  },
  watch: {
    search(newValue){
      if(newValue !== null && newValue !== undefined){
        this.searchingUsers = [];
        this.users.forEach(user => {
          if(removeSpecialCharacters(user.name, newValue) || removeSpecialCharacters(user.email, newValue)){
            this.searchingUsers.push(user);
          }
        })
      }
    }
  },
  methods: {
    actualizartabla(){
      console.log('actualiza en usercard')
      this.getUsers()
    },
    async getUsers() {
      this.loading = true;
      let endPoint = this.isAdmin ? '/adminsById' : '/users';
      try {
        const response = await this.$axios.$get(endPoint, {
          headers: { Authorization: "Bearer " + localStorage.token },
        });
        this.users = response.data;
        this.searchingUsers = this.users;

      } catch (error) {
        console.log(error.response)
      }
    },
  },
};
</script>

<style scoped>
  .customFlex {
    padding: 0 12px;
  }
</style>
