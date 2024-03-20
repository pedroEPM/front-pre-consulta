<template>
  <v-dialog max-width="300" v-model="dialog">
    <v-card>
      <v-card-title>Eliminar</v-card-title>
      <v-card-text v-if="!loading">
        ¿Esta seguro de querer eliminar la solicitud seleccionada?
      </v-card-text>

      <v-card-text v-if="loading"> Eliminando solicitud </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn text color="" @click="dialog = false">Cancelar</v-btn>
        <v-btn text color="red" @click="deleteRequest()">Eliminar</v-btn>
      </v-card-actions>

      <v-progress-linear
        indeterminate
        color="primary"
        v-if="loading"
      ></v-progress-linear>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    id: null,
    loading: false,
  }),
  methods: {
    openDialog( item ){
      this.dialog = true;
      this.id = item._id;
    },
    async deleteRequest() {
      this.loading = true;
      try {
        const response = await this.$axios.$delete('/requestdocuments/'+ this.id, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.$parent.$parent.getRequests();
        this.closeDialog();
      } catch (error) {
        this.loading = false;
        this.$store.commit(
          'openSnack',
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return;
      }
    },
    closeDialog(){
      this.loading = false;
      this.dialog = false;
    }
  },
};
</script>

<style>
</style>
