<template>
  <v-dialog max-width="300" v-model="dialog">
    <v-card :loading="loading">
      <v-card-title>Eliminar</v-card-title>
      <v-card-text v-if="!loading">
        ¿Esta seguro de querer eliminar el banner?
      </v-card-text>
      <v-card-text v-if="loading">Eliminando banner</v-card-text>
      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn text color="" @click="dialog = false">Cancelar</v-btn>
        <v-btn text color="red" @click="deleteBanner()">Eliminar</v-btn>
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
        console.log(id)
        this.dialog = true;
        this.id = id;
      },
      async deleteBanner(){
        try {
          this.loading = true;
          const response = await this.$axios.$delete('/banner/' + this.id, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          console.log(response.data);
          this.cleanAndClose();

          this.$store.commit(
            'openSnack',
            'Se ha borrado exitosamente'
          );

        } catch (error) {
          this.loading = false;
          console.log(error.response);
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, inténtelo de nuevo'
          );
        }
      },
      async cleanAndClose(){
        this.dialog = false;
        this.$parent.$parent.$parent.dialog = false;
        let pag = this.$parent.$parent.$parent.$parent.page;
        await this.$parent.$parent.$parent.$parent.$parent.getBanners();
        this.$parent.$parent.$parent.$parent.$parent.getPagination();
        this.$parent.$parent.$parent.$parent.$parent.getArrayImage(pag);

        this.$parent.$parent.$parent.$parent.page = pag;
        this.loading = false;
        this.id = null;
      }
    }
  }
</script>

<style>

</style>
