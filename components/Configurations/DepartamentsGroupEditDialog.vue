<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title
        >Editar departamento <v-spacer /><v-btn icon @click="dialog = !dialog"
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="name"
            label="Nombre"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>
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
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="validate()">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    loading : false,
    name : null,
    userPermits: [],
    permissions: [],
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
    },
    id : null
  }),
  methods: {
    async openDialog( item ) {
      this.dialog = true;
      this.id = item._id;
      await this.getGroup();
      await this.getPermissions();
    },
    async getPermissions() {
      //this.loading = true;
      const response = await this.$axios.$get("/permissions", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.permissions = response.data;
    },
    async getGroup() {
      //this.loading = true;
      const response = await this.$axios.$get("/group/" + this.id , {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.name = response.data.name;
      this.userPermits = response.data.permissions;

    },
    async editGroup(){
      try {
        const body = {
          name : this.name,
          permissions : this.userPermits
        }

        const response = await this.$axios.put('/groups/' + this.id, body, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        if( response ){
          this.$parent.$parent.getGroups();
          this.reset();
          this.$store.commit(
            'openSnack',
            'Se ha actualizado correctamente'
          );
        }

      } catch (error) {
        console.log(error.response)
      }
    },
    reset(){
      this.dialog = false;
      this.id = null;
      this.$refs.form.reset();
      this.permissions = [];
    },
    validate(){
      if( this.$refs.form.validate() ){
        if( this.userPermits.length > 0 ){
          this.editGroup();
        }else{
          this.$store.commit(
            'openSnack',
            'No se ha seleccionado los permisos'
          );
        }
      }
    }
  },
};
</script>

<style>
</style>
