<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
       <v-toolbar elevation="0">
        <v-toolbar-title>Editar edición</v-toolbar-title>

        <v-spacer />

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form
          ref="form"
        >

          <v-text-field
            label="Nombre"
            v-model="editionName"
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

          <!-- <v-file-input
            label="Ícono"
            v-model="icon"
            :disabled="loading"
            :rules="dialog != false ? validations.imageRules : validations.noRules"
          ></v-file-input> -->

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
    id: null,
    editionName: null,
    icon: null,
    iconB64 : null,
    publicationID: null,
    publications: [],
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
      imageRules: [
        ( v ) => (!!v && v.type == 'image/png' || !!v && v.type == 'image/jpeg' ) || 'El ícono solo puede ser png, jpeg o jpg'
      ],
      noRules: []
    }
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
    openDialog( item ){
      this.getPublications();
      this.dialog = true;
      this.id = item._id;
      this.editionName = item.editionName;
      this.publicationID = item?.PublicationReference?._id;
    },
    async updateEditions(){
      this.loading = true;
      let formData = new FormData();
      const body = {
        _id: this.id,
        editionName: this.editionName,
        PublicationReference: this.publicationID,
        // Image64 : null,
      };
      formData.append('body', JSON.stringify(body));
      try {
        const response = await this.$axios.$put('/Editions', formData, {
          headers: { Authorization: 'Bearer ' + localStorage.token}
        });
        if(response){
          this.$parent.$parent.getEditions();
          this.$store.commit(
            'openSnack',
            'La edición ha sido actualizada exitosamente'
          );
        }
        this.cleanAndClose();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        if( error.response.data.message !== undefined ){
          return this.$store.commit(
            'openSnack',
            response.data.message
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
      const response  = await this.$axios.$get('/Publications', {
        headers : { Authorization: 'Bearer ' + localStorage.token}
      });
      this.publications = response.data.publicaciones;
    },
    cleanAndClose(){
      this.editionName = '';
      this.publicationID = '';
      this.icon = null;

      this.dialog = false;
    },
    validate(){
      if(this.$refs.form.validate()){
        this.updateEditions();
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
