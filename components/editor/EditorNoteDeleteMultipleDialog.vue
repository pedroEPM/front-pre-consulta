<template>
  <v-dialog v-model="dialog" max-width="300" persistent>
    <v-card>
      <v-card-title v-if="!loading"> Advertencia </v-card-title>
      <v-card-title v-else> Cargando notas </v-card-title>

      <v-card-text v-if="!loading">
        ¿Esta seguro de proceder con remover las notas seleccionadas?
      </v-card-text>

      <v-card-text v-else>
        <v-progress-linear
          v-model="cargando"
          style="color : white"
          height="25"
        >
          <strong>{{ Math.ceil(cargando) }}%</strong>
        </v-progress-linear>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn dark @click="dialog = false">Cancelar</v-btn>
        <v-btn color="primary" @click="deleteNotes()">Aceptar</v-btn>
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
        cargando : 0,
      }
    },
    methods : {
      openDialog(){
        console.log(this.$parent.selected);
        this.dialog = true;
      },
      async deleteNotes() {
        this.loading = true;

        for(let i = 0; i <= this.$parent.selected.length; i++){
          this.cargando = ( i * 100 ) / this.$parent.selected.length;
          if( i === this.$parent.selected.length){

            this.cleanAndClose();
          }else{
            let respuesta = await this.deleteNote(this.$parent.selected[i]._id);
            console.log(i + ' ' + respuesta)
          }
        }
      },
      async deleteNote( id ) {
        try {
          const response = await this.$axios.$delete("/Note/" + id, {
            headers: { Authorization: "Bearer " + localStorage.token },
          });
          console.log(response);
          this.$store.commit(
            "openSnack",
            "Las notas se ha removido correctamente"
          );
          return true;

        } catch (error) {
          console.log( id )
          console.log(error.response)
          this.$store.commit(
            "openSnack",
            "Ha ocurrido un error, por favor intente de nuevo"
          );
          return false;
        }
      },
      async cleanAndClose(){
        this.$parent.loading = true;

        let pag = this.$parent.page;

        this.$parent.page = 1;
        this.$parent.advObj.quantity = 1;
        this.$parent.saveSearchedPage = [];
        await this.$parent.getNotes();
        await this.$parent.getPagination();

        this.$parent.page = pag;
        this.$parent.nextPage();
        this.$parent.selected = [];

        this.dialog = false;
        this.loading = false;
        this.cargando = 0;

        this.$parent.loading = false;
      }
    }
  }
</script>

<style>

</style>
