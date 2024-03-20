<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
      <v-toolbar elevation="0">
        <v-toolbar-title>Editar clasificación</v-toolbar-title>

        <v-spacer />

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

      </v-toolbar>

      <v-card-text>
        <v-form ref="form">

          <v-text-field
            label="Nombre"
            v-model="clasificationName"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>
          <v-select
            label="Estado"
            item-text="name"
            item-value="value"
            :items="clasificationsStatus"
            v-model="state"
            :disabled="loading"
            :rules="state != false ? validations.fieldRules : validations.noRules"
          ></v-select>
          <!-- <v-file-input
            label="Ícono"
            v-model="icon"
            :disabled="loading"
          ></v-file-input> -->

        </v-form>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn
          color="primary"
          @click="validate()"
        >Agregar</v-btn>
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
    id: null,
    clasificationName: null,
    publications: [],
    publicationID: null,
    icon: null,
    state: null,
    clasificationsStatus : [
      { name: 'Vigente', value: true },
      { name: 'No vigente', value: false }
    ],
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
      noRules: []
    }
  }),
  methods: {
    openDialog(item){
      // this.getPublications();
      this.dialog = true;
      this.id = item._id;
      this.clasificationName = item.name;
      this.state = item.status;

    },
    async updateClasification(){
      this.loading = true;
      let formData = new FormData();
      const body = {
        _id: this.id,
        name: this.clasificationName,
        // PublicationReference: this.publicationID
        status: this.state
      }
      formData.append('Imagen', null);
      formData.append('body', JSON.stringify(body));
      try {
        const response = await this.$axios.put('/Clasifications', formData, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        if(response){
          this.$parent.$parent.getClasifications();
          this.$store.commit(
            'openSnack',
            'La clasifación se ha agreado exitosamente'
          );
        }
        this.cleanAndClose();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        if(error.response.data.message !== undefined){
          return this.$store.commit(
            'openSnack',
            error.response.data.message
          );
        }
        this.$store.commit(
          'openSnack',
          'Ha ocurrido un error, por favor intente de nuevo'
        );
      }
    },
    async getPublications(){
      const response = await this.$axios.$get('/Publications', {
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });
      this.publications = response.data.publicaciones;
    },
    cleanAndClose(){
      this.clasificationName = '';
      this.publicationID = '';
      this.icon = '';

      this.dialog = false;
    },
    validate(){
      if(this.$refs.form.validate()){
        this.updateClasification();
      }
    }
  }
};
</script>

<style>
</style>
