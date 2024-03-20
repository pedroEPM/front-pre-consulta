<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
      <v-toolbar elevation="0">
        <v-toolbar-title>Agregar sección</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Nombre"
            v-model="sectionName"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>

          <v-select
            label="Publicación"
            item-text="publicationName"
            item-value="_id"
            :items="publications"
            v-model="publicationID"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-select>

          <v-select
            label="Estado"
            item-text="name"
            item-value="value"
            :items="sectionStatus"
            v-model="sectionState"
            :disabled="loading"
            :rules="sectionState != false ? validations.fieldRules : validations.noRules"
          ></v-select>
        </v-form>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn color="primary" @click="validate()">Agregar</v-btn>
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
    loading: false,
    sectionName: null,
    publicationID: null,
    publications: [],
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
      noRules: []
    },
    sectionStatus : [
      { name: 'Vigente', value: true },
      { name: 'No vigente', value: false }
    ],
    sectionState : null,
  }),
  methods: {
    openDialog() {
      this.getPublications();
      this.dialog = true;
    },
    async addSection() {
      this.loading = true;
      let formData = new FormData();
      let body = {
        name: this.sectionName,
        publicationId: this.publicationID,
        status : this.sectionState,
      };
      formData.append("body", JSON.stringify(body));
      try {
        const response = await this.$axios.$post("/section", formData, {
          headers: { Authorization: "Bearer " + localStorage.token },
        });
        if (response) {
          this.$parent.$parent.getSections();
          this.$store.commit(
            "openSnack",
            "La sección ha sido registrado exitosamente"
          );
          this.cleanAndClose();
        }
      } catch (error) {
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return;
      }
    },
    async getPublications() {
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.publications = response.data.publicaciones;
    },
    cleanAndClose() {
      this.sectionName = "";
      this.publicationID = "";
      this.sectionState = null;
      this.dialog = false;
      this.loading = false;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.addSection();
      }
    },
  },
};
</script>

<style>
</style>
