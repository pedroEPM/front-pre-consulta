<template>
  <v-dialog max-width="300" v-model="dialog">
    <v-card>
      <v-card-title>Eliminar</v-card-title>
      <v-card-text>¿Esta seguro de querer eliminar el fotografo seleccionado?</v-card-text>
      <v-card-text v-if="loading"> Eliminando fótografo </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn text color="" @click="dialog = false">Cancelar</v-btn>
        <v-btn text color="red" @click="deletePhotographer()">Eliminar</v-btn>
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
      id : null,
      loading : false,
    }
  },
  methods : {
    openDialog( item ){
      this.dialog = !this.dialog;
      this.id = item._id;
    },
    async deletePhotographer(){
      this.loading = true;
      try {
        const response = await this.$axios.delete('/Photographer/' + this.id,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        if(response){
          this.$store.commit(
            'openSnack',
            'El fotógrafo se ha eliminado exitosamente'
          );
          this.$parent.$parent.getPhotographers();
          this.dialog = false;
        }
        this.loading = false;
      } catch (error) {
        this.$store.commit(
          'openSnack',
          'Ha ocurrido un error, por favor intente de nuevo'
        );
        this.loading = false;
        return;
      }
    }
  }
}
</script>

<style>

</style>
