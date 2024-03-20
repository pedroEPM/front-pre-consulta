<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
      <v-toolbar elevation="0">
        <v-toolbar-title>Agregar clasificación</v-toolbar-title>

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
    clasificationName: null,
    icon: null,
    iconB64 : null,
    publicationID: null,
    publications: [],
    state: null,
    clasificationsStatus : [
      { name: 'Vigente', value: true },
      { name: 'No vigente', value: false }
    ],
    validations: {
      fieldRules: [(v) => !!v || "Campos requeridos"],
      noRules: []
    },
  }),
  watch : {
    icon( newValue ){
      if( newValue != undefined || newValue != null){
        this.imageToBase64(newValue);
      }else{
        this.iconB64 = null;
      }
    }
  },
  methods: {
    openDialog(){
      this.dialog = true;
      // this.getPublications();
    },
    async addClasification(){
      this.loading = true;
      let formData = new FormData();
      const body = {
        name : this.clasificationName,
        status: this.state
        // PublicationReference : null,
        // Image64 : this.iconB64,
      };
      // formData.append('Imagen', null);
      formData.append('body', JSON.stringify(body));
      try {
        const response = await this.$axios.$post('/addClasifications', formData, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        if(response){
          this.$parent.$parent.getClasifications();
          this.$store.commit(
            'openSnack',
            'La clasificación ha sido registrada exitosamente'
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
        return;
      }
    },
    async getPublications(){
      const { data } = await this.$axios.$get('/Publications',{
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });
      this.publications = data.publicaciones;
    },
    cleanAndClose(){
      this.clasificationName = '';
      this.publicationID = '';
      this.icon = null;
      this.state = null;

      this.dialog = false;
    },
    validate(){
      if(this.$refs.form.validate()){
        this.addClasification();
      }
    },
    imageToBase64 (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.iconB64 = reader.result;
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    }
  }
};
</script>

<style>
</style>
