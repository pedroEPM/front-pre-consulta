<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title
        >Editar Permisos <v-spacer /><v-btn icon @click="dialog = !dialog"
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >

      <v-card-text>
        <v-layout row wrap class="ma-2">
          <v-flex xs6 v-for="(item, index) in permissions" v-bind:key="index">
            <v-checkbox
              v-model="userPermits"
              :label="item.name"
              :value="item._id"
              style="text-transform: capitalize"
            ></v-checkbox>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="isAdmin ? updateUser() : updatePermissions()">Actualizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    userPermits: [],
    id: null,
    permissions: [],
    allAdminInf : {},
  }),
  props : {
    isAdmin : {
      type : Boolean,
      default : false
    }
  },
  methods: {
    async openDialog(item, id) {
      this.dialog = true;
      this.userPermits = item;
      this.id = id;
      await this.getPermissions();
      await this.getUser();
    },
    async getPermissions() {
      //this.loading = true;
      const response = await this.$axios.$get("/permissions", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.permissions = response.data;
    },
    async updatePermissions() {
      try {
        const response = await this.$axios.patch(
          "/users/" + this.id + "/permissions",
          {
            permissions: this.userPermits,
          },
          {
            headers: { Authorization: "Bearer " + localStorage.token },
          }
        );
        console.log({permissions: this.userPermits})
        console.log(response);
        if (response) {
          this.$store.commit(
            "openSnack",
            "Los permisos se han actualizado exitosamente"
          );
          this.dialog = false;
          this.loading = false;
          this.$parent.getUsers();
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return;
      }
    },
    async updateUser() {

      try {
        const response = await this.$axios.$put('/admin/' + this.id, {
          // group: this.group,

          name: this.allAdminInf.name != undefined ? this.allAdminInf.name : null,
          phone: this.allAdminInf.phone != undefined ? this.allAdminInf.phone : null,
          img : this.allAdminInf.img != undefined ? this.allAdminInf.img : null,
          role : this.allAdminInf.role != undefined ? this.allAdminInf.role : null,
          activat : this.allAdminInf.activate != undefined ? this.allAdminInf.activate : false,
          permissions : this.userPermits != undefined ? this.userPermits : [],
        },
        {
          headers : { Authorization : 'Berarer ' + localStorage.token }
        });

        if( response ){
          this.$store.commit(
            'openSnack',
            'Se ha actualizado correctamente'
          );
          this.$parent.getUsers();
          this.dialog = false;
          this.loading = false;
        }
      } catch (error) {
        console.log(error)
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
      }
    },
    async getUser(){
      try {
        const endPoint = this.isAdmin ? '/adminsById/' : '/users/';
        const response = await this.$axios.$get(endPoint + this.id, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        if( this.isAdmin ){
          this.userPermits = response.data.permissions;
          this.allAdminInf = response.data;
          console.log(this.allAdminInf)
        }else{
          this.userPermits = response.data.permissions[0].permissions;
        }
      } catch (error) {

      }
    }
  },
};
</script>

<style>
</style>
