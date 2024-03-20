<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
      <v-toolbar elevation="0">
        <v-toolbar-title>Agregar puesto</v-toolbar-title>

        <v-spacer />

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

      </v-toolbar>

      <v-card-text>
        <v-form ref="form">

          <v-text-field
            label="Nombre"
            v-model="positionName"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>

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
    data(){
      return {
        dialog : false,
        loading : false,
        positionName : null,

        validations : {
          fieldRules : [
            ( v => !!v || 'Campo requerido')
          ]
        }
      }
    },
    methods : {
      openDialog(){
        this.dialog = true;
      },
      async addPosition(){
        this.loading = true;
        let body = {
          position : this.positionName
        }

        try {
          const response = await this.$axios.$post('/position', body, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });

          this.$store.commit(
            'openSnack',
            'Se ha agregado correctamente el puesto'
          );

          this.cleanAndClose();
        } catch (error) {
          this.loading = false;
          console.log(error.response)
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, vuelva a intentarlo'
          );
        }
      },
      validate(){
        if( this.$refs.form.validate() ){
          this.addPosition();
        }
      },
      reset(){
        this.$refs.form.reset();
      },
      cleanAndClose(){
        this.dialog = false;
        this.loading = false;
        this.$parent.$parent.getPositions();
        this.reset();
      }
    }
  }
</script>

<style>

</style>
