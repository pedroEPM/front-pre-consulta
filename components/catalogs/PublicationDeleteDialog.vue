<template>
  <v-dialog max-width="300" v-model="dialog">
    <v-card>
      <v-card-title>Eliminar</v-card-title>
      <v-card-text v-if="!loading">
        ¿Esta seguro de querer eliminar el cuaderno seleccionado?
      </v-card-text>

      <v-card-text v-if="loading"> Eliminando cuaderno </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn text color="" @click="dialog = false">Cancelar</v-btn>
        <v-btn text color="red" @click="deleteNotebook()">Eliminar</v-btn>
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
    openDialog(item) {
      this.dialog = !this.dialog;
      this.id = item._id;
    },
    async deleteNotebook() {
      this.loading = true;

      try {
        const response = await this.$axios.delete("/Publications/" + this.id, {
          headers: { Authorization: "Bearer " + localStorage.token },
        });

        console.log(response);
        if (response) {
          this.$store.commit(
            "openSnack",
            "La pregunta ha sido eliminada exitosamente"
          );
          this.$parent.getPublications();
          this.loading = false;
          this.dialog = false;
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
  },
};
</script>

<style>
</style>
