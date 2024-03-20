<template>
  <v-dialog max-width="300" v-model="dialog">
    <v-card>
      <v-card-title>Eliminar</v-card-title>
      <v-card-text v-if="!loading">
        ¿Esta seguro de querer eliminar la nota seleccionado?
      </v-card-text>

      <v-card-text v-if="loading"> Eliminando nota </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn text color="" @click="dialog = false">Cancelar</v-btn>
        <v-btn text color="red" @click="deleteNote()">Eliminar</v-btn>
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
    openDialog( item ) {
      this.dialog = !this.dialog;
      this.id = item._id;
      console.log(this.id)
    },
    async deleteNote() {
      this.loading = true;

      try {
        const response = await this.$axios.$delete("/Note/" + this.id, {
          headers : { Authorization : "Bearer " + localStorage.token },
        });
        if (response) {
          this.$store.commit(
            "openSnack",
            "La nota ha sido eliminada exitosamente"
          );
         //this.$parent.getNotes();
        //  this.loading = false;
        //  this.dialog = false;
        this.cleanAndClose();
        } else {
          this.loading = false;
        }
      } catch (error) {
        console.log(error.response)
        this.loading = false;
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return;
      }
    },
      async cleanAndClose(){
      // console.log('EJECUTO cleanAndClose');
        this.$parent.loading = true;
        let pag = this.$parent.page;


        this.loading = false;
        this.dialog = false;
        this.$parent.page = 1;
        this.$parent.advObj.quantity = 1;
        this.$parent.saveSearchedPage = [];
        await this.$parent.getNotes();
        await this.$parent.getPagination();

        this.$parent.page = pag;
        this.$parent.nextPage();
        this.$parent.selected = [];
    },
  },
};
</script>

<style>
</style>
