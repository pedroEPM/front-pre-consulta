<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card>
      <v-toolbar elevation="0">
        <v-card-title>Editar agencia de publicación</v-card-title>

        <v-spacer />

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form">

          <v-text-field
            label="Nombre"
            v-model="publishingAgencyName"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>
          <v-select
            label="Estado"
            item-text="name"
            item-value="value"
            :items="agenciesStatus"
            v-model="agencyState"
            :disabled="loading"
            :rules="agencyState != false ? validations.fieldRules : validations.noRules"
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
        <v-btn color="primary" @click="validate()"> Agregar</v-btn>
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
      loading : false,
      id: null,
      publishingAgencyName : null,
      icon : null,
      iconB64 : null,
      publicationID : null,
      publications : [],
      agencyState: null,
      validations: {
        fieldRules : [(v) => !!v || "Campo requerido"],
        imageRules: [ ( v ) => (!!v && v.type == 'image/png' || !!v && v.type == 'image/jpeg' ) || 'El ícono solo puede ser png, jpeg o jpg',],
        noRules: []
      },
      agenciesStatus : [
        { name: 'Vigente', value: true },
        { name: 'No vigente', value: false }
      ],
      id : null
    }
  },
  watch : {
    icon( newValue ){
      if( newValue != undefined || newValue != null){
        this.imageToBase64(newValue);
      }else{
        this.iconB64 = null;
      }
    }
  },
  methods : {
    openDialog( item ){
      console.log(item )
      // this.getPublications();
      this.dialog = true;
      this.agencyState = item.status;
      this.id = item._id;
      this.publishingAgencyName = item.name;
    },
    async updatepublishingAgency(){
      this.loading = true;
      let formData = new FormData();
      const body = {
        name: this.publishingAgencyName,
        status: this.agencyState,
        _id: this.id
      };
      formData.append('body', JSON.stringify(body));

      try {
        const response = await this.$axios.$put('/Agency', formData, {
          headers : { Authorization : 'Bearer ' + localStorage.token },
          maxContentLength: 100000000,
          maxBodyLength: 1000000000
        });
        if(response){
          this.$parent.$parent.getPublishingAgency();
          this.$store.commit(
            'openSnack',
            'La agencia se ha actualizado exitosamente'
          );
        }
        this.clandAndClose();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$store.commit(
          'openSnack',
          'Ha ocurrido un error, por favor intente de nuevo'
        );
      }
    },
    async getPublications(){
      const { data } = await this.$axios.$get('/Publications', {
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });
      this.publications = data.publicaciones;
    },
    clandAndClose(){
      this.dialog = false;
      this.publishingAgencyName = '';
      this.publicationID = '';
      this.icon = null;

    },
    validate(){
      if(this.$refs.form.validate()) {
        this.updatepublishingAgency();
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
}
</script>

<style>

</style>
