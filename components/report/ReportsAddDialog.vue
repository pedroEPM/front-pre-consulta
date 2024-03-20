<template>
  <v-dialog
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    v-model="dialog"
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar dark color="primary">
          <v-icon> mdi-alert-circle </v-icon>
          <v-spacer />
          <v-toolbar-title>Agregar reporte</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex md3></v-flex>
            <v-flex xs12 md6>
              <v-card outlined class="pa-5">
                <v-form class="mt-5" ref="form">
                  <v-text-field
                    outlined
                    label="Nombre"
                    v-model="name"
                    :rules="validations.fieldRules"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    label="Email"
                    v-model="email"
                    :rules="validations.fieldRules"
                  ></v-text-field>
                  <v-textarea
                    outlined
                    label="Descripción del error"
                    height="150"
                    v-model="description"
                    :rules="validations.fieldRules"
                  ></v-textarea>
                </v-form>
                <v-card-actions class="mt-1">
                  <v-spacer />
                  <v-btn outlined color="primary" @click="validate()"> Aceptar </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <v-dialog v-model="confirm" max-width="300">
      <v-card :loading="loading">
        <v-card-title> Aviso </v-card-title>

        <v-card-text v-if="!loading">¿Agregar reporte?</v-card-text>
        <v-card-text v-if="loading">Cargando reporte</v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn outlined @click="confirm = false"
          > Cancelar </v-btn>
          <v-btn outlined color="primary" @click="addReport()"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
  export default {
    data(){
      return {
        dialog: false,
        confirm : false,
        loading : false,
        name : null,
        email : null,
        description : null,
        validations : {
          fieldRules : [ ( v ) => !!v || 'Campo requerido']
        }
      }
    },
    methods : {
      openDialog(){
        this.dialog = true;
      },
      cleanAndClose(){
        this.$refs.form.reset();
        this.confirm = false;
        this.dialog = false;
        this.loading = false;
      },
      validate(){
        if(this.$refs.form.validate()){
          this.confirm = true;
        }
      },
      async addReport(){
        this.loading = true;
        try {
          this.loading = false;

          const body = {
            name : this.name,
            email : this.email,
            description : this.description,
            userId : localStorage.user_id
          }

          const response = await this.$axios.$post('/addReport', body, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });

          this.$parent.$parent.getReports();
          this.cleanAndClose();
          this.$store.commit(
            'openSnack',
            'Se ha enviado exitosamente el reporte'
          );

        } catch (error) {
          this.loading = false;
          console.log(error.response)
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, vuelva a intentarlo'
          );
        }
      },

    }
  }
</script>

<style>

</style>
