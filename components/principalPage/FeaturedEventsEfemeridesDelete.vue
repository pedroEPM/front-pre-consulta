<template>
  <v-dialog max-width="300" v-model="dialog">
    <v-card :loading="loading">
      <v-card-title>Eliminar</v-card-title>
      <v-card-text v-if="!loading">
        ¿Esta seguro de querer eliminar el acontecimiento destacado?
      </v-card-text>
      <v-card-text v-if="loading">Eliminando acontecimineto destacado</v-card-text>
      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn text color="" @click="dialog = false">Cancelar</v-btn>
        <v-btn text color="red" @click="deleteFeaturedEvent()">Eliminar</v-btn>
      </v-card-actions>
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
        this.dialog = true;
        this.id = id;
      },
      async deleteFeaturedEvent(){
        try {
          this.loading = true;
          const response = await this.$axios.$delete('/featuredEvents/' + this.id, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          console.log(response.data);
          this.cleanAndClose();
        } catch (error) {
          this.loading = false;
          console.log(error.response);
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, inténtelo de nuevo'
          );
        }
      },
      cleanAndClose(){
        let pag = this.$parent.$parent.$parent.page;
        let month = this.$parent.$parent.$parent.month;
        this.$parent.$parent.$parent.getEvents(month);
        this.$parent.$parent.$parent.getArrayImage(pag);
        this.dialog = false;
        this.loading = false;
        this.id = null;
      }
    }
  }
</script>

<style>

</style>
