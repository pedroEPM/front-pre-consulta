<template>
  <v-dialog max-width="300" v-model="dialog">
    <v-card>
      <v-card-title>Eliminar</v-card-title>
      <v-card-text v-if="!loading">
        ¿Esta seguro de querer eliminar el documento PDF seleccionado?
      </v-card-text>

      <v-card-text v-if="loading"> Eliminando documento PDF </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn text color="" @click="dialog = false">Cancelar</v-btn>
        <v-btn text color="red" @click="deletePDF()">Eliminar</v-btn>
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
    openDialog( id ) {
      this.dialog = !this.dialog;
      this.id = id;
    },
    async deletePDF() {
      this.loading = true;

      try {
        const response = await this.$axios.$delete("/pdfs/" + this.id, {
          headers : { Authorization : "Bearer " + localStorage.token },
        });
        if (response) {
          this.$store.commit(
            "openSnack",
            "El documento PDF ha sido eliminada exitosamente"
          );

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
        this.$parent.loading = true;

        let pag = this.$parent.page;

        this.$parent.page = 1;
        this.$parent.advObj.quantity = 1;
        this.$parent.saveSearchedPage = [];

        this.dialog = false;
        this.loading = false;
        this.cargando = 0;
        await this.$parent.getPDFs();
        await this.$parent.getPagination();

        this.$parent.page = pag;
        this.$parent.nextPage();
        this.$parent.selected = [];

        this.$parent.loading = false;
      }
  },
};
</script>

<style>
</style>
