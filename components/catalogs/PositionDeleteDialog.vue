<template>
  <v-dialog max-width="300" v-model="dialog">
    <v-card>
      <v-card-title>Eliminar</v-card-title>
      <v-card-text v-if="!loading">
        ¿Esta seguro de querer eliminar el puesto seleccionado?
      </v-card-text>

      <v-card-text v-if="loading"> Eliminando puesto </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn text color="" @click="dialog = false">Cancelar</v-btn>
        <v-btn text color="red" @click="deletePosition()">Eliminar</v-btn>
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
    data(){
      return {
        dialog : false,
        loading : false,
        id : null,
      }
    },
    methods : {
      openDialog( id ){
        this.id = id;
        this.dialog = true;
      },
      async deletePosition(){
        this.loading = true;
        try {
          const response = await this.$axios.$delete('/position/' + this.id, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });

          this.$store.commit(
            'openSnack',
            'Se ha borrado exitosamente el puesto'
          );
          this.cleanAndClose();

        } catch (error) {
          this.loading = false;
          console.log(error.response);
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, vuelva a intentarlo'
          );
        }
      },
      cleanAndClose(){
        this.$parent.$parent.getPositions();
        this.id = null;
        this.dialog = false;
        this.loading = false;
      }
    }
  }
</script>

<style>

</style>
